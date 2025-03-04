import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(100).email(),
  });

  static readonly ADDMEMBER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(100).email(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
}
