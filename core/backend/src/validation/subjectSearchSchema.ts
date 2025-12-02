import { z } from "zod";

export const subjectSearchSchema = z.object({
  subject_name: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});
