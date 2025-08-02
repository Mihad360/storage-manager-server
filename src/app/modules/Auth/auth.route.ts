import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authControllers } from "./auth.controller";
import { authValidations } from "./auth.validation";

const router = express.Router();

router.post(
  "/login-user",
  validateRequest(authValidations.loginUserValidation),
  authControllers.loginUser,
);
router.post("/forget-password", authControllers.forgetPassword);
router.post("/reset-password", authControllers.resetPassword);
router.post("/verify-otp", authControllers.verifyOtp);

export const authRoutes = router;
