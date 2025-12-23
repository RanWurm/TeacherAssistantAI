import { z } from "zod";

const nonEmptyTrimmed = z.string().trim().min(1);

export const articleSearchSchema = z.object({
  subjects: z.array(nonEmptyTrimmed).max(50).optional(),
  authors: z.array(nonEmptyTrimmed).max(50).optional(),
  keywords: z.array(nonEmptyTrimmed).max(50).optional(),

  language: nonEmptyTrimmed.optional(),
  type: nonEmptyTrimmed.optional(),

  fromYear: z.number().int().min(0).optional(),
  toYear: z.number().int().min(0).optional(),

  limit: z.number().int().min(1).max(1000).optional(),
  offset: z.number().int().min(0).optional(),

  sortBy: z.enum(["citations", "year", "impact"]).optional(),
});
