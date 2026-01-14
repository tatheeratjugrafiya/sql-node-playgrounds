import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgot-password").post(authController.forgotPassword);

export { router as authRouter };
