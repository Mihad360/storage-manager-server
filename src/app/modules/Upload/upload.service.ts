import path from "path";
/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { JwtPayload } from "../../interface/global";
import { User } from "../User/user.model";
import { IFile } from "./upload.interface";
import { Types } from "mongoose";
import { UploadModel } from "./upload.model";

const fileTypes = ["pdf", "note", "image", "folder"];

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

  if (file) {
    payload.user = new Types.ObjectId(user.user);
    payload.filename = file.filename;
    payload.path = file.path;

    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    payload.folderName = baseName;
    payload.size = file.size;

    await User.findByIdAndUpdate(
      user.user,
      {
        $inc: { usedStorage: file.size },
      },
      { new: true },
    );
  }

  const result = await UploadModel.create(payload);
  return result;
};

export const uploadServices = {
  uploadFile,
};
