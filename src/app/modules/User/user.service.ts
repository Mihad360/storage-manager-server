/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { JwtPayload } from "../../interface/global";
import config from "../../config";
import { createToken } from "../../utils/jwt";
import { Types } from "mongoose";
import { formatUserStorage } from "../../utils/FormatBytes/FormatBytes";

const createUser = async (file: any, payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload?.email });
  if (isUserExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The User already exists");
  }

  if (file) {
    const imageName = `${payload.name}`;
    const profileImg = await sendImageToCloudinary(imageName, file.buffer);
    payload.profileImage = profileImg?.secure_url as string | undefined;
  }
  payload.role = "user";

  const result = await User.create(payload);
  if (result) {
    const jwtPayload: JwtPayload = {
      user: result._id,
      name: result.name,
      email: result.email,
      role: result.role,
      profileImage: result.profileImage,
      isDeleted: result.isDeleted,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return {
      accessToken,
    };
  }
};

const getMe = async (user: JwtPayload) => {
  const userId = new Types.ObjectId(user.user);
  const isUserExist = await User.findById(userId).select(
    "-password -privatePin",
  );
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is blocked");
  }

  const formattedUser = formatUserStorage(isUserExist) as IUser;
  return formattedUser;
};

const setPrivatePin = async (user: JwtPayload, payload: Partial<IUser>) => {
  const userId = new Types.ObjectId(user.user);
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is blocked");
  }

  const pin = payload.privatePin?.toString();
  if (pin) {
    if (pin.length < 4 || pin.length > 4) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Pin must be 4 character");
    }
    const hashedPin = await bcrypt.hash(pin, 12);
    const result = await User.findByIdAndUpdate(
      isUserExist._id,
      {
        privatePin: hashedPin,
        isPrivatePinSet: true,
      },
      { new: true },
    );
    return result;
  } else {
    throw new AppError(HttpStatus.BAD_REQUEST, "Something went wrong!");
  }
};

const verifyPrivatePin = async (user: JwtPayload, payload: Partial<IUser>) => {
  const userId = new Types.ObjectId(user.user);
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not exist");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is blocked");
  }
  if (!isUserExist.privatePin) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Private pin not set");
  }

  const pin = payload.privatePin?.toString();
  if (pin) {
    const isMatch = await bcrypt.compare(pin, isUserExist.privatePin);
    if (!isMatch) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid Pin");
    }
    return { message: "PIN verified" };
  } else {
    throw new AppError(HttpStatus.BAD_REQUEST, "Something went wrong!");
  }
};

const editUserProfile = async (
  id: string,
  file: Express.Multer.File | undefined,
  payload: Partial<IUser>,
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user does not exist");
  }
  if (user.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "The user is blocked");
  }

  const updateData: Partial<IUser> = {};

  if (payload.name) {
    updateData.name = payload.name;
  }
  if (file) {
    const imageInfo = await sendImageToCloudinary(
      file.originalname,
      file.buffer,
    );
    updateData.profileImage = imageInfo.secure_url;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(HttpStatus.BAD_REQUEST, "No data to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true },
  );
  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError(HttpStatus.BAD_REQUEST, "User already deleted");
  }

  const result = await User.findByIdAndUpdate(
    user._id,
    {
      isDeleted: true,
    },
    { new: true },
  );
  return result;
};

export const userServices = {
  createUser,
  getMe,
  setPrivatePin,
  verifyPrivatePin,
  editUserProfile,
  deleteUser,
};
