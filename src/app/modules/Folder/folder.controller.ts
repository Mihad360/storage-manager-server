import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { folderServices } from "./folder.service";
import { JwtPayload } from "../../interface/global";

const createFolder = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await folderServices.createFolder(user, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "createFolder succesfully",
    data: result,
  });
});

const getMyFolders = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await folderServices.getMyFolders(user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "createFolder succesfully",
    data: result,
  });
});

const getSpeceficFoldersFile = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const id = req.params.id;
  const result = await folderServices.getSpeceficFoldersFile(user, id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "createFolder succesfully",
    data: result,
  });
});

const deleteFolder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await folderServices.deleteFolder(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "createFolder succesfully",
    data: result,
  });
});

export const folderControllers = {
  createFolder,
  getMyFolders,
  getSpeceficFoldersFile,
  deleteFolder,
};
