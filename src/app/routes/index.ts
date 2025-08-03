import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/Auth/auth.route";
import { uploadRoutes } from "../modules/Upload/upload.route";
import { folderRoutes } from "../modules/Folder/folder.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/upload",
    route: uploadRoutes,
  },
  {
    path: "/folder",
    route: folderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/students", StudentRoutes);
// router.use("/users", UserRoutes);

export default router;
