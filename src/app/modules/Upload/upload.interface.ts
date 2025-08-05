import { Types } from "mongoose";

export interface IFile {
  user: Types.ObjectId;
  size?: number;
  type: "pdf" | "note" | "image" 
  folderName?: string;
  live_link?: string;
  parentId?: string | null;
  uploadDate?: string;
  isFavourite?: boolean;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
