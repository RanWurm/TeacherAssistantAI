import mysql, { Pool, RowDataPacket } from "mysql2/promise";

// ─────────────────────────────────────────────────────────────
// Connection Pool
// ─────────────────────────────────────────────────────────────

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "teacher_assistant",
      port: Number(process.env.DB_PORT) || 3307,
      waitForConnections: true,
      connectionLimit: 5,
      charset: "utf8mb4",
    });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// ─────────────────────────────────────────────────────────────
// SQL Validation (READ-ONLY ENFORCEMENT)
// ─────────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS = [
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|REPLACE)\b/i,
  /\b(GRANT|REVOKE|LOCK|UNLOCK)\b/i,
  /\b(CALL|EXECUTE|PREPARE)\b/i,
  /\bINTO\s+OUTFILE\b/i,
  /\bLOAD\s+DATA\b/i,
  /;.*;/,  // Multiple statements
];

const ALLOWED_TABLES = [
  "Articles",
  "Journals", 
  "Authors",
  "Subjects",
  "Keywords",
  "ArticlesAuthors",
  "ArticlesSubjects",
  "ArticlesKeywords",
];

export function validateReadOnlyQuery(sql: string): { valid: boolean; error?: string } {
  const trimmed = sql.trim();
  
  // Must start with SELECT
  if (!/^SELECT\b/i.test(trimmed)) {
    return { valid: false, error: "Query must start with SELECT" };
  }

  // Check forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: `Forbidden SQL pattern detected: ${pattern}` };
    }
  }

  // Verify only allowed tables are referenced (basic check)
  const fromMatch = trimmed.match(/\bFROM\s+(\w+)/gi);
  const joinMatch = trimmed.match(/\bJOIN\s+(\w+)/gi);
  
  const referencedTables: string[] = [];
  
  if (fromMatch) {
    fromMatch.forEach(m => {
      const table = m.replace(/FROM\s+/i, "").trim();
      referencedTables.push(table);
    });
  }
  
  if (joinMatch) {
    joinMatch.forEach(m => {
      const table = m.replace(/JOIN\s+/i, "").trim();
      referencedTables.push(table);
    });
  }

  for (const table of referencedTables) {
    if (!ALLOWED_TABLES.some(t => t.toLowerCase() === table.toLowerCase())) {
      return { valid: false, error: `Table not allowed: ${table}` };
    }
  }

  return { valid: true };
}

// ─────────────────────────────────────────────────────────────
// Query Execution
// ─────────────────────────────────────────────────────────────

export async function executeReadOnlyQuery<T extends RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
): Promise<{ rows: T; error?: string }> {
  const validation = validateReadOnlyQuery(sql);
  
  if (!validation.valid) {
    return { rows: [] as unknown as T, error: validation.error };
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute<T>(sql, params);
    return { rows };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown DB error";
    return { rows: [] as unknown as T, error: message };
  }
}

// ─────────────────────────────────────────────────────────────
// Pre-built Query Helpers
// ─────────────────────────────────────────────────────────────

export async function searchPapers(params: {
  query?: string;
  subject?: string;
  yearMin?: number;
  yearMax?: number;
  limit?: number;
}) {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (params.query) {
    conditions.push("(a.title LIKE ? OR k.keyword LIKE ?)");
    values.push(`%${params.query}%`, `%${params.query}%`);
  }

  if (params.subject) {
    conditions.push("s.subject_name LIKE ?");
    values.push(`%${params.subject}%`);
  }

  if (params.yearMin) {
    conditions.push("a.year >= ?");
    values.push(params.yearMin);
  }

  if (params.yearMax) {
    conditions.push("a.year <= ?");
    values.push(params.yearMax);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = Math.min(params.limit || 5, 10);

  const sql = `
    SELECT DISTINCT
      a.article_id,
      a.title,
      a.year,
      a.citation_count,
      a.article_url,
      j.name AS journal_name
    FROM Articles a
    LEFT JOIN Journals j ON a.journal_id = j.journal_id
    LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    LEFT JOIN Subjects s ON asub.subject_id = s.subject_id
    LEFT JOIN ArticlesKeywords ak ON a.article_id = ak.article_id
    LEFT JOIN Keywords k ON ak.keyword_id = k.keyword_id
    ${whereClause}
    ORDER BY a.citation_count DESC
    LIMIT ${limit}
  `;

  return executeReadOnlyQuery(sql, values);
}

export async function getPaperDetails(articleId: number) {
  // Base article info
  const articleSql = `
    SELECT 
      a.*,
      j.name AS journal_name,
      j.publisher,
      j.impact_factor
    FROM Articles a
    LEFT JOIN Journals j ON a.journal_id = j.journal_id
    WHERE a.article_id = ?
  `;

  const { rows: articles, error: artErr } = await executeReadOnlyQuery(articleSql, [articleId]);
  if (artErr || articles.length === 0) {
    return { article: null, error: artErr || "Article not found" };
  }

  const article = articles[0];

  // Authors
  const authorsSql = `
    SELECT au.name, au.affiliation
    FROM Authors au
    JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
    WHERE aa.article_id = ?
  `;
  const { rows: authors } = await executeReadOnlyQuery(authorsSql, [articleId]);

  // Subjects
  const subjectsSql = `
    SELECT s.subject_name
    FROM Subjects s
    JOIN ArticlesSubjects asub ON s.subject_id = asub.subject_id
    WHERE asub.article_id = ?
  `;
  const { rows: subjects } = await executeReadOnlyQuery(subjectsSql, [articleId]);

  // Keywords
  const keywordsSql = `
    SELECT k.keyword
    FROM Keywords k
    JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
    WHERE ak.article_id = ?
  `;
  const { rows: keywords } = await executeReadOnlyQuery(keywordsSql, [articleId]);

  return {
    article: {
      ...article,
      authors: authors.map((a: any) => ({ name: a.name, affiliation: a.affiliation })),
      subjects: subjects.map((s: any) => s.subject_name),
      keywords: keywords.map((k: any) => k.keyword),
    },
    error: null,
  };
}

export async function getAuthorPapers(authorName: string, limit = 5) {
  const sql = `
    SELECT DISTINCT
      a.article_id,
      a.title,
      a.year,
      a.citation_count,
      au.name AS author_name,
      au.affiliation
    FROM Articles a
    JOIN ArticlesAuthors aa ON a.article_id = aa.article_id
    JOIN Authors au ON aa.author_id = au.author_id
    WHERE au.name LIKE ?
    ORDER BY a.citation_count DESC
    LIMIT ?
  `;

  return executeReadOnlyQuery(sql, [`%${authorName}%`, limit]);
}

export async function listSubjects() {
  const sql = `
    SELECT s.subject_name, COUNT(asub.article_id) AS paper_count
    FROM Subjects s
    LEFT JOIN ArticlesSubjects asub ON s.subject_id = asub.subject_id
    GROUP BY s.subject_id, s.subject_name
    ORDER BY paper_count DESC
    LIMIT 30
  `;
  return executeReadOnlyQuery(sql);
}

export async function searchPapersWithPdf(params: {
  query?: string;
  limit?: number;
}) {
  const limit = Math.min(params.limit || 5, 10);
  
  const sql = `
    SELECT a.article_id, a.title, a.year, a.citation_count, a.article_url, j.name as journal_name
    FROM Articles a
    LEFT JOIN Journals j ON a.journal_id = j.journal_id
    WHERE (a.article_url LIKE '%arxiv.org%' 
           OR a.article_url LIKE '%jmlr.org%'
           OR a.article_url LIKE '%mlr.press%'
           OR a.article_url LIKE '%.pdf')
      AND (? IS NULL OR a.title LIKE CONCAT('%', ?, '%'))
    ORDER BY a.citation_count DESC
    LIMIT ?
  `;
  
  return executeReadOnlyQuery(sql, [params.query, params.query, limit]);
}