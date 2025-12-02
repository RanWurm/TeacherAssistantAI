// load_to_mysql.js
import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// --- Load raw file ---
const raw = JSON.parse(fs.readFileSync("data/core_raw.json", "utf8"));

// --- Helper to insert or get id (avoids duplicates) ---
// Helper returns the correct PK value from either insertId or fallback select.
async function insertOrGetId(query, params, selectAfterInsertQuery = null, selectParams = null) {
  const [rows] = await pool.execute(query, params);

  if (rows.insertId && rows.insertId > 0) {
    return rows.insertId;
  }
  // Fallback: selectAfterInsertQuery should return row with PK.
  if (selectAfterInsertQuery) {
    const [ret] = await pool.execute(selectAfterInsertQuery, selectParams);
    if (ret && ret.length > 0 && ret[0]) {
      // MySQL returns all PK columns, but try to grab any column ending with "_id"
      const idField = Object.keys(ret[0]).find(f => f.endsWith('_id'));
      return ret[0][idField];
    }
  }
  // If selectAfterInsertQuery is missing, fallback: look for a returned "id"
  if (rows[0] && typeof rows[0] === 'object') {
    const idField = Object.keys(rows[0]).find(f => f.endsWith('_id'));
    return rows[0][idField] || rows[0].id;
  }
  return null;
}

async function load() {
  console.log("🚀 Starting ETL → MySQL...");

  for (const paper of raw) {
    try {
      // --- Journals ---
      let journalName = paper.venue && paper.venue.trim() !== "" ? paper.venue.trim() : "Unknown";
      const journalInsertQ = `INSERT INTO Journals (name) VALUES (?) 
        ON DUPLICATE KEY UPDATE journal_id = LAST_INSERT_ID(journal_id)`;
      const journalSelectQ = `SELECT journal_id FROM Journals WHERE name = ?`;
      const journalId = await insertOrGetId(
        journalInsertQ,
        [journalName],
        journalSelectQ,
        [journalName]
      );
      console.log("JOURNAL:", journalName, "→", journalId);


      // --- Articles ---
      // Required columns: article_id(INT PK, auto), title(TEXT), year(INT), language, type, citation_count, journal_id (FK)
      const articleInsertQ = `INSERT INTO Articles (title, year, language, type, citation_count, journal_id)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE article_id = LAST_INSERT_ID(article_id)`;
      const articleSelectQ = `SELECT article_id FROM Articles WHERE title = ? AND journal_id = ?`;
      const language = paper.language || null;
      const articleType = paper.type || "research";
      const articleId = await insertOrGetId(
        articleInsertQ,
        [
          paper.title || null,
          paper.year || null,
          language,
          articleType,
          paper.citationCount || 0,
          journalId
        ],
        articleSelectQ,
        [paper.title || null, journalId]
      );
      console.log("ARTICLE:", paper.title, "→", articleId, "journalId=", journalId);

      // --- Authors ---
      for (const author of paper.authors || []) {
        // Required columns: author_id(INT PK, auto), name(VARCHAR), affiliation(VARCHAR)
        const authorName = author.name || "Unknown";
        const affiliation = author.affiliation || null;
        const authorInsertQ = `INSERT INTO Authors (name, affiliation)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE author_id = LAST_INSERT_ID(author_id)`;
        const authorSelectQ = `SELECT author_id FROM Authors WHERE name = ? AND (affiliation = ? OR (affiliation IS NULL AND ? IS NULL))`;
        const authorId = await insertOrGetId(
          authorInsertQ,
          [authorName, affiliation],
          authorSelectQ,
          [authorName, affiliation, affiliation]
        );

        // ArticlesAuthors (Many-to-Many)
        await pool.execute(
          `INSERT IGNORE INTO ArticlesAuthors (article_id, author_id)
           VALUES (?, ?)`,
          [articleId, authorId]
        );
      }

      // --- Subjects (from fieldsOfStudy) ---
      // Many-to-Many with Subjects and ArticlesSubjects
      if (paper.fieldsOfStudy) {
        for (const subj of paper.fieldsOfStudy) {
          const subjectInsertQ = `INSERT INTO Subjects (subject_name)
            VALUES (?)
            ON DUPLICATE KEY UPDATE subject_id = LAST_INSERT_ID(subject_id)`;
          const subjectSelectQ = `SELECT subject_id FROM Subjects WHERE subject_name = ?`;
          const subjectId = await insertOrGetId(
            subjectInsertQ,
            [subj],
            subjectSelectQ,
            [subj]
          );
          await pool.execute(
            `INSERT IGNORE INTO ArticlesSubjects (article_id, subject_id) VALUES (?, ?)`,
            [articleId, subjectId]
          );
        }
      }

      // --- Keywords (from keywords) ---
      // Many-to-Many with Keywords and ArticlesKeywords
      if (paper.keywords) {
        for (const kw of paper.keywords) {
          const keywordInsertQ = `INSERT INTO Keywords (keyword)
            VALUES (?)
            ON DUPLICATE KEY UPDATE keyword_id = LAST_INSERT_ID(keyword_id)`;
          const keywordSelectQ = `SELECT keyword_id FROM Keywords WHERE keyword = ?`;
          const keywordId = await insertOrGetId(
            keywordInsertQ,
            [kw],
            keywordSelectQ,
            [kw]
          );
          await pool.execute(
            `INSERT IGNORE INTO ArticlesKeywords (article_id, keyword_id) VALUES (?, ?)`,
            [articleId, keywordId]
          );
        }
      }

    } catch (err) {
      console.log("⚠ Error for article:", paper.title);
      console.log(err.message);
    }
  }

  console.log("✔ ETL finished successfully!");
  process.exit();
}

load();
