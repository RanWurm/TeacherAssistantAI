import { Request, Response } from "express";
import { journalSearchSchema } from "../validation/journalSearchSchema";
import { searchJournals } from "../services/journalsService";

export async function journalsSearchHandler(req: Request, res: Response) {
  try {
    const filters = journalSearchSchema.parse(req.body);
    const data = await searchJournals(filters);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid filters" });
  }
}
