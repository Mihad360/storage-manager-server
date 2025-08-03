import { Types } from "mongoose";

export interface IFolder {
  name: string;
  user?: Types.ObjectId;
  path: string; // for breadcrumb or tree structure
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
