import HttpStatus from "http-status";
import config from "../../config";
import AppError from "../../erros/AppError";
import { User } from "../User/user.model";
import { IAuth } from "./auth.interface";
import { JwtPayload } from "../../interface/global";
import { createToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
import { OtpModel } from "../Otp/otp.model";
import { checkOtp } from "../../utils/Otp/otp";

const loginUser = async (payload: IAuth) => {
  const user = await User.findOne({
    email: payload.email,
  });
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user is not found");
  }
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The user is already Blocked");
  }
  if (!(await User.compareUserPassword(payload.password, user.password))) {
    throw new AppError(HttpStatus.FORBIDDEN, "Password did not matched");
  }

  const userId = user?._id;

  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const jwtPayload: JwtPayload = {
    user: userId,
    name: user.name,
    email: user?.email,
    role: user?.role,
    profileImage: user?.profileImage,
    isDeleted: user?.isDeleted,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }

  const userId = user?._id;
  if (!userId) {
    throw new AppError(HttpStatus.NOT_FOUND, "The user id is missing");
  }

  const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);
  const userInfo = {
    otp: generateOtp,
    expiresAt: expireAt,
    email: user.email,
  };
  const newUser = await OtpModel.findOneAndUpdate(
    { email: user.email },
    {
      ...userInfo,
    },
    { new: true, upsert: true },
  );
  if (newUser) {
    const subject = "Verification Code";
    const otp = newUser.otp;
    const html = `Here is your password changing Verification Code <br/> <h3>${otp}</h3>`;
    const mail = await sendEmail(user.email, subject, html);
    if (!mail.success) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Something went wrong!");
    }
    return mail;
  } else {
    throw new AppError(HttpStatus.BAD_REQUEST, "Something went wrong!");
  }
};

const verifyOtp = async (payload: { email: string; otp: string }) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }
  const isOtpExist = await OtpModel.findOne({ email: user.email });
  if (!isOtpExist) {
    throw new AppError(HttpStatus.NOT_FOUND, "The users Otp did not found");
  }
  if (new Date(isOtpExist.expiresAt) < new Date()) {
    await OtpModel.findOneAndDelete({ email: user.email });
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "The Otp has expired. Try again!",
    );
  }
  const check = await checkOtp(payload.email, payload.otp);
  return check;
};

const resetPassword = async (payload: {
  email: string;
  newPassword: string;
}) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
  }
  if (user?.isDeleted) {
    throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
  }

  const newHashedPassword = await User.newHashedPassword(payload.newPassword);
  const updateUser = await User.findOneAndUpdate(
    { email: user.email },
    {
      password: newHashedPassword,
    },
    { new: true },
  );
  return updateUser;
};

export const authServices = {
  loginUser,
  forgetPassword,
  resetPassword,
  verifyOtp,
};
