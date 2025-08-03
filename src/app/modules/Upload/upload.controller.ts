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

const openSpeceficFile = catchAsync(async (req, res) => {
  const filename = req.params.filename;
  const result = await uploadServices.openSpeceficFile(filename);

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
  const result = await uploadServices.getFavourites();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "File retrieved succesfully",
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
};
