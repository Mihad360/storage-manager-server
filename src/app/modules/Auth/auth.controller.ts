import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { accessToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 365 * 60 * 60 * 7,
  });

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Login succesfully",
    data: {
      accessToken,
    },
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPassword(req.body.email);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "forget password succesfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const result = await authServices.verifyOtp(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Otp verified succesfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await authServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "reset password succesfully",
    data: result,
  });
});

export const authControllers = {
  loginUser,
  forgetPassword,
  resetPassword,
  verifyOtp,
};
