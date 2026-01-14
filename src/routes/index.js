import { Router } from "express";
import { userRouter } from "./user.route.js";
import { authRouter } from "./auth.route.js";

// import { userRoutes } from "./user.route.js";
// import { authRoutes } from "./auth.route.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// // auth routes
// router.use("/auth", authRoutes);

// // user routes
// router.use("/users", authMiddleware, userRoutes);
router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
