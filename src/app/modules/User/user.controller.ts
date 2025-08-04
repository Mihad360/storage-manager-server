import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";
import { JwtPayload } from "../../interface/global";

const createUser = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await userServices.createUser(file, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await userServices.getMe(user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

const setPrivatePin = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await userServices.setPrivatePin(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

const verifyPrivatePin = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await userServices.verifyPrivatePin(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

const editUserProfile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const file = req.file;
  const result = await userServices.editUserProfile(id, file, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userServices.deleteUser(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User created succesfully",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getMe,
  setPrivatePin,
  verifyPrivatePin,
  editUserProfile,
  deleteUser,
};
