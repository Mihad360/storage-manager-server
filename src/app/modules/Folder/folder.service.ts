import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { JwtPayload } from "../../interface/global";
import { User } from "../User/user.model";
import { IFolder } from "./folder.interface";
import { FolderModel } from "./folder.model";
import { Types } from "mongoose";
import { UploadModel } from "../Upload/upload.model";

const createFolder = async (user: JwtPayload, payload: IFolder) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user does not exist");
  }

  // Check if a folder with the same name already exists for this user
  const sameFolder = await FolderModel.findOne({
    name: payload.name,
    user: user.user,
  });

  if (sameFolder) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Folder already exists");
  }

  // Set root-level path as just the folder name
  payload.path = payload.name;
  payload.user = new Types.ObjectId(user.user);

  const result = await FolderModel.create(payload);
  return result;
};

const getMyFolders = async (user: JwtPayload) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user does not exist");
  }

  const result = await FolderModel.find({ user: isUserExist._id });
  return result;
};

const getSpeceficFoldersFile = async (user: JwtPayload, id: string) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user does not exist");
  }
  const isFolderExist = await FolderModel.findById(id);
  if (!isFolderExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The folder does not exist");
  }

  const folderFiles = await UploadModel.find({
    parentId: isFolderExist._id,
    user: isUserExist._id,
  });
  return folderFiles;
};

export const folderServices = {
  createFolder,
  getMyFolders,
  getSpeceficFoldersFile,
};
