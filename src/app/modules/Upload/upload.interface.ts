import { Types } from "mongoose";

export interface IFile {
  user: Types.ObjectId; // User ID (ref)
  filename?: string | undefined;
  size?: number; // Not needed for folders
  type: "pdf" | "note" | "image" // restrict allowed types
  path?: string; // Path or URL for the file, not needed for folders
  folderName?: string; // Only used if type is 'folder'
  live_link?: string;
  parentId?: string | null; // If nested inside a folder
  uploadDate?: string;
  isFavourite?: boolean;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
