/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import { JwtPayload } from "../../interface/global";
import { User } from "../User/user.model";
import AppError from "../../erros/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { FolderModel } from "../Folder/folder.model";
import { UploadModel } from "../Upload/upload.model";

const allUser = async (user: JwtPayload, query: Record<string, unknown>) => {
  const userId = new Types.ObjectId(user.user);
  const isAdminExist = await User.findOne({ _id: userId, role: "admin" });
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const userQuery = new QueryBuilder(User.find(), query).filter();
  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;
  return { meta, result };
};

const allFolders = async (user: JwtPayload, query: Record<string, unknown>) => {
  const userId = new Types.ObjectId(user.user);
  const isAdminExist = await User.findOne({ _id: userId, role: "admin" });
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const userQuery = new QueryBuilder(FolderModel.find(), query).filter();
  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;
  return { meta, result };
};

const allUploads = async (user: JwtPayload, query: Record<string, unknown>) => {
  const userId = new Types.ObjectId(user.user);
  const isAdminExist = await User.findOne({ _id: userId, role: "admin" });
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const userQuery = new QueryBuilder(UploadModel.find(), query).filter();
  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;
  return { meta, result };
};

const deleteFolder = async (user: JwtPayload, id: string) => {
  const userId = new Types.ObjectId(user.user);
  const isAdminExist = await User.findOne({ _id: userId, role: "admin" });
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const result = await FolderModel.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true },
  );
  return result;
};
const deleteUpload = async (user: JwtPayload, id: string) => {
  const userId = new Types.ObjectId(user.user);
  const isAdminExist = await User.findOne({ _id: userId, role: "admin" });
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await UploadModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { session, new: true },
    );
    if (!result) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Delete fails");
    }
    const size = result.size as number;
    const updateUser = await User.findByIdAndUpdate(
      result.user,
      {
        $inc: { usedStorage: -size },
      },
      { session, new: true },
    );
    if (!updateUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Delete fails");
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(HttpStatus.BAD_REQUEST, error as any);
  }
};

const deleteUser = async (user: JwtPayload, id: string) => {
  const userId = new Types.ObjectId(user.user);
  const isAdminExist = await User.findOne({ _id: userId, role: "admin" });
  if (!isAdminExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  const result = await User.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true },
  );
  return result;
};

export const adminServices = {
  allUser,
  allUploads,
  allFolders,
  deleteUser,
  deleteFolder,
  deleteUpload,
};
