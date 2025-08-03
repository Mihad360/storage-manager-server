import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/Auth/auth.route";
import { uploadRoutes } from "../modules/Upload/upload.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/students", StudentRoutes);
// router.use("/users", UserRoutes);

export default router;
