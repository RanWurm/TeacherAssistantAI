import { Request, Response } from "express";
import { subjectSearchSchema } from "../validation/subjectSearchSchema";
import { searchSubjects } from "../services/subjectsService";

export async function subjectsSearchHandler(req: Request, res: Response) {
  try {
    const filters = subjectSearchSchema.parse(req.body);
    const data = await searchSubjects(filters);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid filters" });
  }
}
