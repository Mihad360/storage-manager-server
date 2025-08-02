/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { JwtPayload } from "../../interface/global";
import config from "../../config";
import { createToken } from "../../utils/jwt";

const createUser = async (file: any, payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload?.email });
  if (isUserExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The User already exists");
  }

  if (file) {
    const { path } = file;
    const imageName = `${payload.name}`;
    const profileImg = await sendImageToCloudinary(
      imageName,
      path,
      //   file.buffer,
      //   file.mimetype,
    );
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

export const userServices = {
  createUser,
};
