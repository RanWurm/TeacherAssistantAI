import { z } from "zod";

export const sourceSearchSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  publisher: z.string().optional(),
  minImpactFactor: z.number().optional(),
  maxImpactFactor: z.number().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});