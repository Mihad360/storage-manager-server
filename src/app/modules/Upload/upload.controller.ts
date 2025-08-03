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
    message: "forget password succesfully",
    data: result,
  });
});

export const uploadControllers = {
  uploadFile,
};
