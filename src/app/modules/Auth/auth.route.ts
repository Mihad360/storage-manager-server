import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authControllers } from "./auth.controller";
import { authValidations } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/login-user",
  validateRequest(authValidations.loginUserValidation),
  authControllers.loginUser,
);
router.post("/forget-password", authControllers.forgetPassword);
router.post("/reset-password", authControllers.resetPassword);
router.post("/verify-otp", authControllers.verifyOtp);
router.post(
  "/change-password",
  auth("admin", "user"),
  authControllers.changePassword,
);

export const authRoutes = router;
