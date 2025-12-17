/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

;            // backend/data
const RAW_DIR = path.join(__dirname, "..", "data", "openalex_raw"); // backend/data/openalex_raw
const BATCH_SIZE = 400;

function* readJsonl(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter(Boolean);
  for (const line of lines) yield JSON.parse(line);
}

function pickArticleUrl(work) {
  return (
    work?.primary_location?.landing_page_url ||
    work?.primary_location?.source?.homepage_url ||
    null
  );
}

function normalizeWork(work) {
  const openalexId = work?.id; // e.g. "https://openalex.org/W..."
  if (!openalexId) return null;

  const title = work?.title || "";
  if (!title) return null;

  const journalName = work?.primary_location?.source?.display_name || null;
  const publisher = work?.primary_location?.source?.host_organization_name || null;

  const authors = (work?.authorships || [])
    .map((a) => ({
      name: a?.author?.display_name || null,
      affiliation: a?.institutions?.[0]?.display_name || null,
    }))
    .filter((x) => x.name);

  const subjects = (work?.concepts || [])
    .slice(0, 12)
    .map((c) => c?.display_name)
    .filter(Boolean);

  // OpenAlex doesn't always provide explicit keywords; keep empty for minimal version.
  const keywords = [];

  return {
    openalex_id: openalexId,
    title,
    year: work?.publication_year ?? null,
    language: work?.language || null,
    type: work?.type || null,
    citation_count: work?.cited_by_count ?? null,
    article_url: pickArticleUrl(work),
    journal: journalName ? { name: journalName, impact_factor: null, publisher } : null,
    authors,
    subjects,
    keywords,
  };
}

async function upsertJournal(conn, journal) {
  if (!journal?.name) return null;

  await conn.execute(
    `INSERT IGNORE INTO Journals (name, impact_factor, publisher) VALUES (?, ?, ?)`,
    [journal.name, journal.impact_factor, journal.publisher]
  );

  const [rows] = await conn.execute(
    `SELECT journal_id FROM Journals WHERE name = ?`,
    [journal.name]
  );
  return rows?.[0]?.journal_id ?? null;
}

async function upsertArticle(conn, r, journalId) {
  // Uses UNIQUE(openalex_id) per your schema
  await conn.execute(
    `INSERT INTO Articles (openalex_id, title, year, language, type, citation_count, journal_id, article_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title=VALUES(title),
       year=VALUES(year),
       language=VALUES(language),
       type=VALUES(type),
       citation_count=VALUES(citation_count),
       journal_id=VALUES(journal_id),
       article_url=VALUES(article_url)`,
    [
      r.openalex_id,
      r.title,
      r.year,
      r.language,
      r.type,
      r.citation_count,
      journalId,
      r.article_url,
    ]
  );

  const [rows] = await conn.execute(
    `SELECT article_id FROM Articles WHERE openalex_id = ?`,
    [r.openalex_id]
  );
  return rows?.[0]?.article_id ?? null;
}

async function ensureAuthor(conn, author) {
  // Your Authors UNIQUE(name, affiliation)
  await conn.execute(
    `INSERT IGNORE INTO Authors (name, affiliation) VALUES (?, ?)`,
    [author.name, author.affiliation]
  );

  // Handle NULL affiliation matching cleanly
  const [rows] = await conn.execute(
    `SELECT author_id
       FROM Authors
      WHERE name = ?
        AND ((affiliation IS NULL AND ? IS NULL) OR affiliation = ?)`,
    [author.name, author.affiliation, author.affiliation]
  );
  return rows?.[0]?.author_id ?? null;
}

async function ensureSubject(conn, subjectName) {
  await conn.execute(
    `INSERT IGNORE INTO Subjects (subject_name) VALUES (?)`,
    [subjectName]
  );
  const [rows] = await conn.execute(
    `SELECT subject_id FROM Subjects WHERE subject_name = ?`,
    [subjectName]
  );
  return rows?.[0]?.subject_id ?? null;
}

async function ensureKeyword(conn, keyword) {
  await conn.execute(
    `INSERT IGNORE INTO Keywords (keyword) VALUES (?)`,
    [keyword]
  );
  const [rows] = await conn.execute(
    `SELECT keyword_id FROM Keywords WHERE keyword = ?`,
    [keyword]
  );
  return rows?.[0]?.keyword_id ?? null;
}

async function linkAuthor(conn, articleId, authorId) {
  // PK (article_id, author_id) exists => INSERT IGNORE is safe
  await conn.execute(
    `INSERT IGNORE INTO ArticlesAuthors (article_id, author_id) VALUES (?, ?)`,
    [articleId, authorId]
  );
}

async function linkSubject(conn, articleId, subjectId) {
  await conn.execute(
    `INSERT IGNORE INTO ArticlesSubjects (article_id, subject_id) VALUES (?, ?)`,
    [articleId, subjectId]
  );
}

async function linkKeyword(conn, articleId, keywordId) {
  await conn.execute(
    `INSERT IGNORE INTO ArticlesKeywords (article_id, keyword_id) VALUES (?, ?)`,
    [articleId, keywordId]
  );
}

async function loadBatch(pool, batch) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const r of batch) {
      const journalId = await upsertJournal(conn, r.journal);
      const articleId = await upsertArticle(conn, r, journalId);
      if (!articleId) continue;

      for (const au of r.authors) {
        const authorId = await ensureAuthor(conn, au);
        if (authorId) await linkAuthor(conn, articleId, authorId);
      }

      for (const s of r.subjects) {
        const subjectId = await ensureSubject(conn, s);
        if (subjectId) await linkSubject(conn, articleId, subjectId);
      }

      for (const k of r.keywords) {
        const keywordId = await ensureKeyword(conn, k);
        if (keywordId) await linkKeyword(conn, articleId, keywordId);
      }
    }

    await conn.commit();
    return batch.length;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function main() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    port: Number(process.env.DB_PORT || 3306),
  });


  const files = fs.existsSync(RAW_DIR)
    ? fs.readdirSync(RAW_DIR).filter((f) => f.endsWith(".jsonl"))
    : [];

  if (files.length === 0) {
    console.log("No files found in backend/data/openalex_raw/*.jsonl");
    process.exit(0);
  }

  for (const file of files) {
    const fp = path.join(RAW_DIR, file);
    console.log(`Loading ${fp}`);

    let buffer = [];
    let processed = 0;

    for (const work of readJsonl(fp)) {
      const rec = normalizeWork(work);
      if (!rec) continue;

      buffer.push(rec);
      if (buffer.length >= BATCH_SIZE) {
        processed += await loadBatch(pool, buffer);
        buffer = [];
        console.log(`  processed=${processed}`);
      }
    }

    if (buffer.length) {
      processed += await loadBatch(pool, buffer);
      console.log(`  processed=${processed}`);
    }
  }

  await pool.end();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
