import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    totalStorage: z.number().optional(),
    usedStorage: z.number().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    profileImage: z.string().optional(),
    role: z.enum(["user", "admin"]).optional(),
    otp: z.string().optional(),
    expiresAt: z.coerce.date().optional(),
    isVerified: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const userValidations = {
  createUserValidation,
};
