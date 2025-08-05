import { Document, Types } from "mongoose";
import { IUser } from "../../modules/User/user.interface";
import { UploadModel } from "../../modules/Upload/upload.model";

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
export const formatUserStorage = async (user: IUserDoc) => {
  const userData = user.toObject();
  const pdfSize = await getTotalSizeByType("pdf", user?._id);
  const noteSize = await getTotalSizeByType("note", user?._id);
  const imageSize = await getTotalSizeByType("image", user?._id);
   const available = user.totalStorage - user.usedStorage;
  return {
    ...userData, // converts Mongoose doc to plain object
    totalStorage: formatBytes(user.totalStorage),
    usedStorage: formatBytes(user.usedStorage),
    availableStorage: formatBytes(available),
    pdfStorageSize: formatBytes(pdfSize),
    noteStorageSize: formatBytes(noteSize),
    imageStorageSize: formatBytes(imageSize),
  };
};

export const getTotalSizeByType = async (
  type: string,
  userId: string | Types.ObjectId,
): Promise<number> => {
  const result = await UploadModel.aggregate([
    {
      $match: {
        user: userId,
        type,
        isDeleted: { $ne: true }, // ignore deleted files
      },
    },
    {
      $group: {
        _id: null,
        totalSize: { $sum: "$size" },
      },
    },
  ]);
  // console.log(result);
  return result.length > 0 ? Number(result[0].totalSize) : 0;
};
