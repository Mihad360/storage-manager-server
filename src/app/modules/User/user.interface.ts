import { Model } from "mongoose";

export interface IUser {
  _id: string; // MongoDB ObjectId as string
  email: string;
  password: string;
  totalStorage: number;
  availableStorage?: string;
  pdfStorageSize?: string;
  noteStorageSize?: string;
  imageStorageSize?: string;
  usedStorage: number; // in bytes or MB/GB based on your system
  name: string;
  profileImage?: string;
  role?: string;
  otp?: string;
  isPrivatePinSet?: boolean;
  privatePin?: string;
  expiresAt?: Date;
  isVerified?: boolean;
  passwordChangedAt?: Date;
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
  isOldTokenValid: (
    passwordChangedTime: Date,
    jwtIssuedTime: number,
  ) => Promise<boolean>;
}
