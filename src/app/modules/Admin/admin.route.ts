import express from "express";
import { adminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/users", auth("admin"), adminControllers.allUser);
router.get("/folders", auth("admin"), adminControllers.allFolders);
router.get("/uploads", auth("admin"), adminControllers.allUploads);
router.patch("/delete-user/:id", auth("admin"), adminControllers.deleteUser);
router.patch(
  "/delete-folder/:id",
  auth("admin"),
  adminControllers.deleteFolder,
);
router.patch(
  "/delete-upload/:id",
  auth("admin"),
  adminControllers.deleteUpload,
);

export const adminRoutes = router;
