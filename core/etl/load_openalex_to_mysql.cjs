/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const RAW_DIR = path.join(__dirname, "..", "data", "openalex_raw"); // backend/data/openalex_raw
const BATCH_SIZE = 400;

function* readJsonl(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter(Boolean);
  for (const line of lines) yield JSON.parse(line);
}

function pickArticleUrl(work) {
  return (
    work?.best_oa_location?.pdf_url ||
    work?.locations?.find((l) => l?.pdf_url)?.pdf_url ||
    work?.best_oa_location?.landing_page_url ||
    work?.primary_location?.landing_page_url ||
    work?.doi ||
    null
  );
}

function normalizeWork(work) {
  const openalexId = work?.id;
  if (!openalexId) return null;

  const title = work?.title || "";
  if (!title) return null;

  const sourceName = work?.primary_location?.source?.display_name || null;
  const sourceType = work?.primary_location?.source?.type || null;
  const publisher = work?.primary_location?.source?.host_organization_name || null;

 const authors = (work?.authorships || [])
  .map((a) => ({
    openalex_author_id: a?.author?.id || null,
    name: a?.author?.display_name || null,
    institutions: (a?.institutions || [])
      .filter((inst) => inst?.id && inst?.display_name)
      .map((inst) => ({
        openalex_institution_id: inst.id,
        name: inst.display_name,
      })),
  }))
  .filter((x) => x.openalex_author_id && x.name);
  
    const subjects = (work?.concepts || [])
    .slice(0, 12)
    .map((c) => c?.display_name)
    .filter(Boolean);

  // OpenAlex doesn't always provide explicit keywords; keep empty for minimal version.
  const keywords = (work?.keywords || [])
  .slice(0, 12)
  .map((k) => k?.display_name)
  .filter(Boolean);

  return {
    openalex_id: openalexId,
    title,
    year: work?.publication_year ?? null,
    language: work?.language || null,
    type: work?.type || null,
    citation_count: work?.cited_by_count ?? null,
    article_url: pickArticleUrl(work),
    source: sourceName ? { name: sourceName, type: sourceType, publisher } : null,
    authors,
    subjects,
    keywords,
  };
}

async function upsertSource(conn, source) {
  if (!source?.name) return null;

  await conn.execute(
    `INSERT IGNORE INTO Sources (name, type, publisher) VALUES (?, ?, ?)`,
    [source.name, source.type, source.publisher]
  );

  const [rows] = await conn.execute(
    `SELECT source_id FROM Sources WHERE name = ?`,
    [source.name]
  );
  return rows?.[0]?.source_id ?? null;
}

async function upsertArticle(conn, r, sourceId) {
  await conn.execute(
    `INSERT INTO Articles (openalex_id, title, year, language, type, citation_count, source_id, article_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title=VALUES(title),
       year=VALUES(year),
       language=VALUES(language),
       type=VALUES(type),
       citation_count=VALUES(citation_count),
       source_id=VALUES(source_id),
       article_url=VALUES(article_url)`,
    [
      r.openalex_id,
      r.title,
      r.year,
      r.language,
      r.type,
      r.citation_count,
      sourceId,
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
  await conn.execute(
    `INSERT INTO Authors (openalex_author_id, name)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
       name=VALUES(name)`,
    [author.openalex_author_id, author.name]
  );

  const [rows] = await conn.execute(
    `SELECT author_id FROM Authors WHERE openalex_author_id = ?`,
    [author.openalex_author_id]
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

async function ensureInstitution(conn, institution) {
  await conn.execute(
    `INSERT IGNORE INTO Institutions (openalex_institution_id, name) VALUES (?, ?)`,
    [institution.openalex_institution_id, institution.name]
  );

  const [rows] = await conn.execute(
    `SELECT institution_id FROM Institutions WHERE openalex_institution_id = ?`,
    [institution.openalex_institution_id]
  );
  return rows?.[0]?.institution_id ?? null;
}
async function linkAuthorInstitution(conn, articleId, authorId, institutionId) {
  await conn.execute(
    `INSERT IGNORE INTO ArticleAuthorInstitutions (article_id, author_id, institution_id) VALUES (?, ?, ?)`,
    [articleId, authorId, institutionId]
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
      const sourceId = await upsertSource(conn, r.source);
      const articleId = await upsertArticle(conn, r, sourceId);
      if (!articleId) continue;

      for (const au of r.authors) {
        const authorId = await ensureAuthor(conn, au);
        if (authorId) {
          await linkAuthor(conn, articleId, authorId);
          for (const inst of au.institutions) {
            const institutionId = await ensureInstitution(conn, inst);
            if (institutionId) {
              await linkAuthorInstitution(conn, articleId, authorId, institutionId);
            }
          }
        }
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
    port: Number(process.env.DB_PORT || 3307),
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
