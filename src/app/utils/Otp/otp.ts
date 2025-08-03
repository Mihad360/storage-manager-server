import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { User } from "../../modules/User/user.model";

export const checkOtp = async (email: string, otp: string) => {
  const otpUser = await User.findOne({ email: email });
  if (otpUser && otpUser.otp !== otp) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The otp is invalid!");
  }
  const updateUser = await User.findOneAndUpdate(
    { email: email },
    {
      otp: null,
      expiresAt: null,
      isVerified: true,
    },
    { new: true },
  );
  return updateUser;
};
