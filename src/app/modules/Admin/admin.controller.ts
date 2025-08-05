import HttpStatus from "http-status";
import { JwtPayload } from "../../interface/global";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const allUser = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await adminServices.allUser(user, req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const allFolders = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await adminServices.allFolders(user, req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Folders retrieved successfully",
    data: result,
  });
});

const allUploads = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await adminServices.allUploads(user, req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Uploads retrieved successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const id = req.params.id;
  const result = await adminServices.deleteUser(user, id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const deleteFolder = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const id = req.params.id;
  const result = await adminServices.deleteFolder(user, id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Folder deleted successfully",
    data: result,
  });
});

const deleteUpload = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const id = req.params.id;
  const result = await adminServices.deleteUpload(user, id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Upload deleted successfully",
    data: result,
  });
});

export const adminControllers = {
  allUser,
  allUploads,
  allFolders,
  deleteUser,
  deleteUpload,
  deleteFolder,
};
