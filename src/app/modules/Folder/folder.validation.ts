import { z } from "zod";

export const createFolderZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Folder name is required"),
  }),
});
