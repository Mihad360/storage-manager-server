import { Types } from "mongoose";

export interface IFile {
  user: Types.ObjectId; // User ID (ref)
  filename?: string;
  size?: number; // Not needed for folders
  type: "pdf" | "note" | "image" | "folder"; // restrict allowed types
  path?: string; // Path or URL for the file, not needed for folders
  folderName?: string; // Only used if type is 'folder'
  parentId?: string | null; // If nested inside a folder
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
