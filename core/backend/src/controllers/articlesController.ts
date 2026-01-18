import { Request, Response } from "express";
import { searchArticles } from "../services/articlesService";
import { articleSearchSchema } from "../validation/articleSearchSchema";

export async function searchArticlesHandler(req: Request, res: Response) {
  try {
    // Validate filters
    const filters = articleSearchSchema.parse(req.body);

    // Call service function for searching articles
    const results = await searchArticles(filters);

    // Return search results JSON
    res.status(200).json(results);
  } catch (err: any) {

    if (err.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid request format for article search",
        details: err.errors,
      });
    }

    res.status(500).json({ error: "Error performing article search" });
  }
}
