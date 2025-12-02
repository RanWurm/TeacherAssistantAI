import { Request, Response } from "express";
import { authorSearchSchema } from "../validation/authorSearchSchema";
import { searchAuthors } from "../services/authorsService";

export async function authorsSearchHandler(req: Request, res: Response) {
  try {
    const filters = authorSearchSchema.parse(req.body);
    const data = await searchAuthors(filters);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid filters" });
  }
}
