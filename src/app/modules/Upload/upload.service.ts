/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { JwtPayload } from "../../interface/global";
import { User } from "../User/user.model";
import { IFile } from "./upload.interface";
import { Types } from "mongoose";
import { UploadModel } from "./upload.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

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
  const isImage = payload.type === "image";
  if (file) {
    console.log(file);
    payload.user = new Types.ObjectId(user.user);
    const newDate = new Date();
    payload.uploadDate = newDate.toISOString().split("T")[0];
    payload.parentId = payload.parentId ? payload.parentId : null;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    payload.folderName = file.originalname;
    payload.size = file.size;

    if (isImage) {
      const { path } = file;
      const imageName = baseName;
      const imageFile = await sendImageToCloudinary(imageName, path);
      payload.filename = imageFile.original_filename as string;
      payload.path = imageFile.secure_url as string;
      // console.log(imageFile);
    } else {
      const fileName = file.filename;
      payload.filename = fileName;
      payload.path = file.path;
    }
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

const getMyUploads = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const isUserExist = await User.findById(user.user);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }

  const uploadQuery = new QueryBuilder(
    UploadModel.find({ user: user.user }),
    query,
  ).filter();
  const meta = await uploadQuery.countTotal();
  const result = await uploadQuery.modelQuery;

  return { meta, result };
};

const openSpeceficFile = async (filename: string) => {
  const isFileExist = await UploadModel.findOne({ filename: filename });
  if (!isFileExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The file is not exist");
  }
  let fileUrl = "";

  const fileType = isFileExist.type;

  if (fileType === "image") {
    // Serve from cloudinary or wherever the image is hosted
    fileUrl = isFileExist.path as string;
  } else if (fileType === "pdf" || fileType === "note") {
    // Viewable inline link for PDF or TXT
    fileUrl = `http://localhost:5000/view-file/${filename}`;
  } else {
    // Default download link (static serving)
    fileUrl = `http://localhost:5000/uploads/${filename}`;
  }

  return fileUrl;
};

const addToFavourite = async (id: string) => {
  const isUploadExist = await UploadModel.findById(id);
  if (!isUploadExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "Something went wrong");
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

const getFavourites = async () => {
  const result = await UploadModel.find({ isFavourite: true });
  return result;
};

export const uploadServices = {
  uploadFile,
  getMyUploads,
  openSpeceficFile,
  addToFavourite,
  unFavourite,
  getFavourites,
};
