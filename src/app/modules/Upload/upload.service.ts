/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { JwtPayload } from "../../interface/global";
import { User } from "../User/user.model";
import { IFile } from "./upload.interface";
import mongoose, { Types } from "mongoose";
import { UploadModel } from "./upload.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const fileTypes = ["pdf", "note", "image"];

const uploadFile = async (user: JwtPayload, file: any, payload: IFile) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  if (!fileTypes.includes(payload.type)) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "The file type is missing or invalid",
    );
  }

  const totalStorage = isUserExist.totalStorage;
  const presentStorage = isUserExist.usedStorage;

  const isImage = payload.type === "image";
  if (file) {
    payload.user = new Types.ObjectId(user.user);
    const newDate = new Date();
    payload.uploadDate = newDate.toISOString().split("T")[0];
    payload.parentId = payload.parentId ? payload.parentId : null;
    payload.folderName = file.originalname;
    payload.size = file.size;

    if (isImage) {
      const imageName = file.originalname;
      const imageFile = await sendImageToCloudinary(imageName, file.buffer);
      payload.live_link = imageFile.secure_url as string;
    } else {
      const newFileName = file.originalname;
      const fileDetails = await sendImageToCloudinary(newFileName, file.buffer);
      payload.live_link = fileDetails.secure_url as string;
    }

    const trackPresentStorage = presentStorage + file.size;
    if (totalStorage < file.size) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Not enough storage");
    }
    if (trackPresentStorage > totalStorage) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Not enough storage");
    }

    await User.findByIdAndUpdate(
      user.user,
      {
        $inc: { usedStorage: file.size },
      },
      { new: true },
    );

    const result = await UploadModel.create(payload);
    return result;
  } else {
    throw new AppError(HttpStatus.BAD_REQUEST, "Please provide a valid file");
  }
};

const getMyUploads = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const userId = new Types.ObjectId(user.user);
  const uploadQuery = new QueryBuilder(
    UploadModel.find({ user: userId, isPrivate: false, isDeleted: false }),
    query,
  ).filter();
  const meta = await uploadQuery.countTotal();
  const result = await uploadQuery.modelQuery;

  return { meta, result };
};

const getMyPrivateUploads = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }

  const uploadQuery = new QueryBuilder(
    UploadModel.find({ user: user.user, isPrivate: true, isDeleted: false }),
    query,
  ).filter();
  const meta = await uploadQuery.countTotal();
  const result = await uploadQuery.modelQuery;

  return { meta, result };
};

const openSpeceficFile = async (id: string, user: JwtPayload) => {
  const isFileExist = await UploadModel.findById(id);
  if (!isFileExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The file is not exist");
  }
  const userId = isFileExist?.user.toString();
  if (userId !== user.user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This file is not belong to you");
  }

  const fileName = isFileExist.folderName;
  const liveLink = isFileExist.live_link;
  return { fileName, liveLink };
};

const addToFavourite = async (id: string) => {
  const isUploadExist = await UploadModel.findById(id);
  if (!isUploadExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "Something went wrong");
  }
  if (isUploadExist.isPrivate) {
    throw new AppError(HttpStatus.BAD_REQUEST, "This is a private file");
  }

  const result = await UploadModel.findByIdAndUpdate(
    id,
    {
      isFavourite: true,
    },
    { new: true },
  );
  return result;
};

const unFavourite = async (id: string) => {
  const isUploadExist = await UploadModel.findById(id);
  if (!isUploadExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "Something went wrong");
  }

  const result = await UploadModel.findByIdAndUpdate(
    id,
    {
      isFavourite: false,
    },
    { new: true },
  );
  return result;
};

const getFavourites = async (user: JwtPayload) => {
  const result = await UploadModel.find({
    user: user.user,
    isPrivate: false,
    isFavourite: true,
  });
  return result;
};

const renameFile = async (id: string, payload: Partial<IFile>) => {
  const isUploadExist = await UploadModel.findById(id);
  if (!isUploadExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The file not found");
  }

  // Extract extension from the current name
  const currentName = isUploadExist?.folderName; // e.g., 'hello.pdf'
  const ext = currentName?.substring(currentName?.lastIndexOf(".")); // -> '.pdf'

  const newName = payload.folderName ? payload.folderName + ext : currentName;
  // Update in DB
  const result = await UploadModel.findByIdAndUpdate(
    id,
    { folderName: newName },
    { new: true },
  );
  return result;
};

const duplicateFile = async (id: string) => {
  const isFileExist = await UploadModel.findById(id);
  if (!isFileExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The file not found");
  }
  const isUserExist = await User.findById(isFileExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const fileSize = isFileExist.size as number;
    const totalStorage = isUserExist.totalStorage;
    const presentStorage = isUserExist.usedStorage;
    const trackPresentStorage = presentStorage + fileSize;

    if (totalStorage < fileSize) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Not enough storage");
    }
    if (trackPresentStorage > totalStorage) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Not enough storage");
    }

    const newDate = new Date();
    const fileInfo = {
      user: isFileExist.user,
      type: isFileExist.type,
      live_link: isFileExist.live_link,
      folderName: isFileExist.folderName,
      size: isFileExist.size,
      uploadDate: newDate.toISOString().split("T")[0],
      parentId: isFileExist.parentId ? isFileExist.parentId : null,
    };
    const result = await UploadModel.create([fileInfo], { session });

    await User.findByIdAndUpdate(
      isUserExist._id,
      {
        $inc: { usedStorage: fileSize },
      },
      { session, new: true },
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};

const shareFileLink = async (id: string) => {
  const isFileExist = await UploadModel.findById(id);
  if (!isFileExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The file not found");
  }
  const liveLink = isFileExist.live_link;
  return liveLink;
};

const deleteFile = async (id: string) => {
  const isFileExist = await UploadModel.findById(id);
  if (!isFileExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The file not found");
  }
  const isUserExist = await User.findById(isFileExist?.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user not found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const fileSize = isFileExist.size as number;
    await User.findByIdAndUpdate(
      isUserExist._id,
      {
        $inc: { usedStorage: -fileSize },
      },
      { session, new: true },
    );

    const result = await UploadModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { session, new: true },
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};

const uploadPrivateFile = async (
  user: JwtPayload,
  file: any,
  payload: IFile,
) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  if (!fileTypes.includes(payload.type)) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "The file type is missing or invalid",
    );
  }

  const totalStorage = isUserExist.totalStorage;
  const presentStorage = isUserExist.usedStorage;

  const isImage = payload.type === "image";
  if (file) {
    // console.log(file);
    payload.user = new Types.ObjectId(user.user);
    payload.isPrivate = true;
    const newDate = new Date();
    payload.uploadDate = newDate.toISOString().split("T")[0];
    payload.parentId = payload.parentId ? payload.parentId : null;
    payload.folderName = file.originalname;
    payload.size = file.size;

    if (isImage) {
      const imageName = file.originalname;
      const imageFile = await sendImageToCloudinary(imageName, file.buffer);
      payload.live_link = imageFile.secure_url as string;
    } else {
      const newFileName = file.originalname;
      const fileDetails = await sendImageToCloudinary(newFileName, file.buffer);
      payload.live_link = fileDetails.secure_url as string;
    }

    const trackPresentStorage = presentStorage + file.size;
    if (totalStorage < file.size) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Not enough storage");
    }
    if (trackPresentStorage > totalStorage) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Not enough storage");
    }

    await User.findByIdAndUpdate(
      user.user,
      {
        $inc: { usedStorage: file.size },
      },
      { new: true },
    );

    const result = await UploadModel.create(payload);
    return result;
  } else {
    throw new AppError(HttpStatus.BAD_REQUEST, "Please provide a valid file");
  }
};

const copyFile = async (id: string) => {
  const isFileExist = await UploadModel.findById(id);
  if (!isFileExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "File is not exist");
  }
  const copyId = isFileExist._id;
  return copyId;
};

export const uploadServices = {
  uploadFile,
  getMyUploads,
  openSpeceficFile,
  addToFavourite,
  unFavourite,
  getFavourites,
  renameFile,
  duplicateFile,
  deleteFile,
  shareFileLink,
  uploadPrivateFile,
  getMyPrivateUploads,
  copyFile,
};
