import HttpStatus from "http-status";
import AppError from "../../erros/AppError";
import { OtpModel } from "../../modules/Otp/otp.model";

export const checkOtp = async (email: string, otp: string) => {
  const otpUser = await OtpModel.findOne({ email: email });
  if (otpUser && otpUser.otp !== otp) {
    throw new AppError(HttpStatus.BAD_REQUEST, "The otp is invalid!");
  }
  const deleteOtp = await OtpModel.findOneAndDelete({ email: email });
  return deleteOtp;
};
