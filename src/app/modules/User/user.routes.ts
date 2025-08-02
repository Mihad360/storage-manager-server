import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import { upload } from "../../utils/sendImageToCloudinary";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";

const router = express.Router();

router.post(
  "/create-user",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidations.createUserValidation),
  userControllers.createUser,
);

export const userRoutes = router;
