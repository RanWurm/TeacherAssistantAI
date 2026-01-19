import { Request, Response } from "express";
import { searchArticles, increaseViews } from "../services/articlesService";
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

export async function incrementArticleView(req: Request, res: Response) {
  const articleId = Number(req.params.articleId);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return res.status(400).json({ error: "Invalid articleId" });
  }

  try {
    await increaseViews(articleId);
    // No content needed, just acknowledge
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to increment article view" });
  }
}