import { model, Schema } from "mongoose";
import { IFile } from "./upload.interface";

const FileSchema = new Schema<IFile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    filename: { type: String },
    size: { type: Number },
    type: {
      type: String,
      enum: ["pdf", "note", "image", "folder"],
      required: true,
    },
    path: { type: String },
    folderName: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "Upload", default: null },
    uploadDate: { type: String },
    isFavourite: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UploadModel = model<IFile>("Upload", FileSchema);
