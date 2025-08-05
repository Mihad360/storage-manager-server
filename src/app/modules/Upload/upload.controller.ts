import HttpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadServices } from "./upload.service";
import { JwtPayload } from "../../interface/global";

const uploadFile = catchAsync(async (req, res) => {
  const file = req.file;
  const user = req.user as JwtPayload;
  const result = await uploadServices.uploadFile(user, file, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

const getMyUploads = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await uploadServices.getMyUploads(req.query, user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Files retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getMyPrivateUploads = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await uploadServices.getMyPrivateUploads(req.query, user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Private files retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const openSpeceficFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = req.user as JwtPayload;
  const result = await uploadServices.openSpeceficFile(id, user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File accessed successfully",
    data: result,
  });
});

const addToFavourite = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.addToFavourite(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File added to favorites successfully",
    data: result,
  });
});

const unFavourite = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.unFavourite(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File removed from favorites successfully",
    data: result,
  });
});

const getFavourites = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await uploadServices.getFavourites(user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Favorite files retrieved successfully",
    data: result,
  });
});

const renameFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.renameFile(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File renamed successfully",
    data: result,
  });
});

const duplicateFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.duplicateFile(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File duplicated successfully",
    data: result,
  });
});

const shareFileLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.shareFileLink(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File sharing link generated successfully",
    data: result,
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.deleteFile(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File deleted successfully",
    data: result,
  });
});

const uploadPrivateFile = catchAsync(async (req, res) => {
  const file = req.file;
  const user = req.user as JwtPayload;
  const result = await uploadServices.uploadPrivateFile(user, file, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Private file uploaded successfully",
    data: result,
  });
});

const copyFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.copyFile(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File copied successfully",
    data: result,
  });
});

export const uploadControllers = {
  uploadFile,
  getMyUploads,
  openSpeceficFile,
  addToFavourite,
  unFavourite,
  getFavourites,
  renameFile,
  duplicateFile,
  deleteFile,
  shareFileLink,
  uploadPrivateFile,
  getMyPrivateUploads,
  copyFile,
};
