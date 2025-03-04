import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    username: z.string().min(1).max(100),
  });

  static readonly ADDMEMBER: ZodType = z.object({
    name: z.string().min(1).max(100),
    username: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
}
