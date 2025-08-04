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
    message: "File upload succesfully",
    data: result,
  });
});

const getMyUploads = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await uploadServices.getMyUploads(req.query, user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
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
    message: "File retrieved succesfully",
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
    message: "File retrieved succesfully",
    data: result,
  });
});

const addToFavourite = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.addToFavourite(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
    data: result,
  });
});

const unFavourite = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.unFavourite(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
    data: result,
  });
});

const getFavourites = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await uploadServices.getFavourites(user);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
    data: result,
  });
});

const renameFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.renameFile(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
    data: result,
  });
});

const duplicateFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.duplicateFile(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
    data: result,
  });
});

const shareFileLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.shareFileLink(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
    data: result,
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await uploadServices.deleteFile(id);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
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
    message: "File upload succesfully",
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
};
