import { z } from "zod";

export const articleSearchSchema = z.object({
  subject: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  keyword: z.string().min(1).optional(),
  language: z.string().min(1).optional(),
  type: z.string().min(1).optional(),

  fromYear: z.number().int().min(0).optional(),
  toYear: z.number().int().min(0).optional(),

  limit: z.number().int().min(1).max(1000).optional(),
  offset: z.number().int().min(0).optional(),
});
