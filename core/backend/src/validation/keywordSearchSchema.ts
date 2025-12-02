import { z } from "zod";

export const keywordSearchSchema = z.object({
  keyword: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});
