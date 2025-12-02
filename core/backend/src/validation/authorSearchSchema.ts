import { z } from "zod";

export const authorSearchSchema = z.object({
  name: z.string().optional(),
  affiliation: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});
