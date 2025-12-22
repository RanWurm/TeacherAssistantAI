import { z } from "zod";

const base = {
  q: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
};

export const subjectsFilterSchema = z.object(base);
export const authorsFilterSchema = z.object(base);
export const keywordsFilterSchema = z.object(base);
