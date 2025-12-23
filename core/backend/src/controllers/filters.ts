// controllers/filters.ts
import { Request, Response } from "express";
import { getSubjects, getAuthors, getKeywords } from "../services/filters";
import {
  subjectsFilterSchema,
  authorsFilterSchema,
  keywordsFilterSchema,
} from "../validation/filtersSchemas";

export async function getSubjectsHandler(req: Request, res: Response) {
  try {
    const parsed = subjectsFilterSchema.parse(req.query);
    const result = await getSubjects(parsed.q, parsed.limit, parsed.offset);
    res.json(result);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid query params", details: err.errors });
    }
    console.error("filters/subjects error:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
}

export async function getAuthorsHandler(req: Request, res: Response) {
  try {
    const parsed = authorsFilterSchema.parse(req.query);
    const result = await getAuthors(parsed.q, parsed.limit, parsed.offset);
    res.json(result);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid query params", details: err.errors });
    }
    console.error("filters/authors error:", err);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
}

export async function getKeywordsHandler(req: Request, res: Response) {
  try {
    const parsed = keywordsFilterSchema.parse(req.query);
    const result = await getKeywords(parsed.q, parsed.limit, parsed.offset);
    res.json(result);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid query params", details: err.errors });
    }
    console.error("filters/keywords error:", err);
    res.status(500).json({ error: "Failed to fetch keywords" });
  }
}
