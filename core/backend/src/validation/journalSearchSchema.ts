import { z } from "zod";

export const journalSearchSchema = z.object({
  name: z.string().optional(),
  publisher: z.string().optional(),
  minImpactFactor: z.number().optional(),
  maxImpactFactor: z.number().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});
