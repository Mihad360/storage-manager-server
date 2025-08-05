import { Types } from "mongoose";

export interface IFolder {
  name: string;
  user?: Types.ObjectId;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
