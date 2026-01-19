import { Request, Response } from "express";
import { sourceSearchSchema } from "../validation/sourceSearchSchema";
import { searchSources } from "../services/sourceService";

export async function sourcesSearchHandler(req: Request, res: Response) {
  try {
    const filters = sourceSearchSchema.parse(req.body);
    const data = await searchSources(filters);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid filters" });
  }
}