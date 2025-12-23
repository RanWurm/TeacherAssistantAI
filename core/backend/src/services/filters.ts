// services/filters.ts
import { query } from "../db";

function clampInt(n: unknown, fallback: number, min: number, max: number) {
  const x = typeof n === "number" ? n : fallback;
  if (!Number.isFinite(x)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(x)));
}

export async function getSubjects(
  q?: string,
  limit?: number,
  offset?: number
): Promise<string[]> {
  const L = clampInt(limit, 50, 1, 200);
  const O = clampInt(offset, 0, 0, 1_000_000);

  const where = q ? "WHERE subject_name LIKE ?" : "";
  const sql = `
    SELECT DISTINCT subject_name
    FROM Subjects
    ${where}
    ORDER BY subject_name ASC
    LIMIT ${L}
    OFFSET ${O}
  `;

  const params = q ? [`%${q}%`] : [];
  const rows = await query(sql, params);
  return rows.map((r: any) => r.subject_name);
}

export async function getAuthors(
  q?: string,
  limit?: number,
  offset?: number
): Promise<string[]> {
  const L = clampInt(limit, 50, 1, 200);
  const O = clampInt(offset, 0, 0, 1_000_000);

  const where = q ? "WHERE name LIKE ?" : "";
  const sql = `
    SELECT DISTINCT name
    FROM Authors
    ${where}
    ORDER BY name ASC
    LIMIT ${L}
    OFFSET ${O}
  `;

  const params = q ? [`%${q}%`] : [];
  const rows = await query(sql, params);
  return rows.map((r: any) => r.name);
}

export async function getKeywords(
  q?: string,
  limit?: number,
  offset?: number
): Promise<string[]> {
  const L = clampInt(limit, 50, 1, 200);
  const O = clampInt(offset, 0, 0, 1_000_000);

  const where = q ? "WHERE keyword LIKE ?" : "";
  const sql = `
    SELECT DISTINCT keyword
    FROM Keywords
    ${where}
    ORDER BY keyword ASC
    LIMIT ${L}
    OFFSET ${O}
  `;

  const params = q ? [`%${q}%`] : [];
  const rows = await query(sql, params);
  return rows.map((r: any) => r.keyword);
}
