// backend/src/db.ts
import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Loads .env from project root

export const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "",
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  console.log("SQL:", sql);
  console.log("Params:", params);
  try {
    // Execute the main query as before
    const [rows] = await pool.execute(sql, params);

    // Also execute EXPLAIN ANALYZE for the query to get query plan and performance info
    try {
      // For EXPLAIN ANALYZE, no LIMIT/OFFSET, but let's just prefix for now
      const explainSql = `EXPLAIN ANALYZE ${sql}`;
      const [explainRows] = await pool.execute(explainSql, params);
      console.log("EXPLAIN ANALYZE output:", explainRows);
    } catch (exErr) {
      console.warn("EXPLAIN ANALYZE failed:", exErr);
    }

    // In some cases, mysql2 returns RowDataPacket[] or OkPacket[]
    if (Array.isArray(rows)) {
      return rows as T[];
    }
    return [];
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}
