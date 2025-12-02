import { Request, Response } from "express";
import { searchArticles } from "../services/articlesService";
import { articleSearchSchema } from "../validation/articleSearchSchema";

export async function searchArticlesHandler(req: Request, res: Response) {
  try {
    const filters = articleSearchSchema.parse(req.body);  // VALIDATION

    const results = await searchArticles(filters);
    res.json(results);

  } catch (err: any) {
    console.error("validation/search error:", err);

    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid filter format",
        details: err.errors,
      });
    }

    res.status(500).json({ error: "Search failed" });
  }
}
