import { Model } from "mongoose";

export interface IUser {
  _id: string; // MongoDB ObjectId as string
  email: string;
  password: string;
  usedStorage: number; // in bytes or MB/GB based on your system
  name: string;
  profileImage?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExistByEmail(email: string): Promise<IUser>;
  compareUserPassword(
    payloadPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  newHashedPassword(newPassword: string): Promise<string>;
}
