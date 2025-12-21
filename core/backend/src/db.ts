// backend/src/db.ts
import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Loads .env from project root

export const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
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
    const [rows] = await pool.execute(sql, params);
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
