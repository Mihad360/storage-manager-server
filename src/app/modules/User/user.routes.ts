import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import { upload } from "../../utils/sendImageToCloudinary";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.delete("/delete/:id", auth("admin", "user"), userControllers.deleteUser);
router.get("/me", auth("admin", "user"), userControllers.getMe);
router.patch(
  "/edit-user-profile/:id",
  auth("admin", "user"),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  userControllers.editUserProfile,
);
router.post(
  "/private-pin",
  auth("admin", "user"),
  userControllers.setPrivatePin,
);
router.post(
  "/verify-private-pin",
  auth("admin", "user"),
  userControllers.verifyPrivatePin,
);
router.patch(
  "/change-private-pin",
  auth("admin", "user"),
  userControllers.changePrivatePin,
);
router.post(
  "/reset-private-pin",
  auth("admin", "user"),
  userControllers.resetPrivatePin,
);
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
