import express from "express";
import authController from "../controllers/auth.controller.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import {
  insertUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
} from "../db/users.schema.js";

const router = express.Router();

router
  .route("/signup")
  .post(validateMiddleware(insertUserSchema), authController.signup);
router
  .route("/login")
  .post(validateMiddleware(loginUserSchema), authController.login);
router
  .route("/forgot-password")
  .post(
    validateMiddleware(forgotPasswordSchema),
    authController.forgotPassword
  );

export { router as authRouter };
