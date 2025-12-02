import { Request, Response } from "express";
import { keywordSearchSchema } from "../validation/keywordSearchSchema";
import { searchKeywords } from "../services/keywordsService";

export async function keywordsSearchHandler(req: Request, res: Response) {
  try {
    const filters = keywordSearchSchema.parse(req.body);
    const data = await searchKeywords(filters);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid filters" });
  }
}
