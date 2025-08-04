import { z } from "zod";

const uploadFileValidation = z.object({
  body: z.object({
    filename: z.string().optional(),
    type: z
      .enum(["pdf", "note", "image"], {
        message: "The type is missing or invalid",
      })
      .optional(),
    folderName: z.string().optional(),
    parentId: z.string().optional().nullable(),
    size: z.number().optional(),
    path: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const uploadValidations = {
  uploadFileValidation,
};
