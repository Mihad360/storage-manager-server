import { z } from "zod";

const loginUserValidation = z.object({
  body: z.object({
    email: z.string(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
});

export const authValidations = {
  loginUserValidation,
};
