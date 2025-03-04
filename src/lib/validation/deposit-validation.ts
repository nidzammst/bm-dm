import { z, ZodType } from "zod";

export class DepositeValidation {
  static readonly ADD: ZodType = z.object({
    amount: z.number().positive(),
    admin: z.string().min(1).max(100),
    description: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    username: z.string().min(1).max(100),
    amount: z.number().positive().optional(),
    description: z.string().optional(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.number().positive(),
    username: z.string().min(1).max(100),
  });
}
