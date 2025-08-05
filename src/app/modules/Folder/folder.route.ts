import express from "express";
import { folderControllers } from "./folder.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-folder",
  auth("admin", "user"),
  folderControllers.createFolder,
);
router.get(
  "/my-folders",
  auth("admin", "user"),
  folderControllers.getMyFolders,
);
router.get(
  "/my-folder-files/:id",
  auth("admin", "user"),
  folderControllers.getSpeceficFoldersFile,
);
router.delete(
  "/delete-folder/:id",
  auth("admin", "user"),
  folderControllers.deleteFolder,
);

export const folderRoutes = router;
