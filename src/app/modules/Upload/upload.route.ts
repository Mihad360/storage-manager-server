import express, { NextFunction, Request, Response } from "express";
import { uploadControllers } from "./upload.controller";
import validateRequest from "../../middlewares/validateRequest";
import { uploadValidations } from "./upload.validation";
import { upload } from "../../utils/sendImageToCloudinary";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/file-upload",
  auth("admin", "user"),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(uploadValidations.uploadFileValidation),
  uploadControllers.uploadFile,
);

export const uploadRoutes = router;
