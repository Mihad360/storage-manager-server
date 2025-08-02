import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    email: z.string(),
    password: z.string().min(6),
    usedStorage: z.number().optional(),
    name: z.string(),
    profileImage: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const userValidations = {
  createUserValidation,
};
