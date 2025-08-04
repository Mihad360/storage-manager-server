import { Document } from "mongoose";
import { IUser } from "../../modules/User/user.interface";

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${size.toFixed(2)} ${sizes[i]}`;
};

type IUserDoc = IUser & Document;
export const formatUserStorage = (user: IUserDoc) => {
  const userData = user.toObject();
  return {
    ...userData, // converts Mongoose doc to plain object
    totalStorage: formatBytes(user.totalStorage),
    usedStorage: formatBytes(user.usedStorage),
  };
};
