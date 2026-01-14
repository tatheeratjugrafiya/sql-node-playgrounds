import express from "express";
//controllers
import userController from "../controllers/user.controllers.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.constants.js";
const router = express.Router();

router.route("/all-roles").get(userController.getAllRoles);

router.route("/test-role").get(
  authenticateUser,
  // authorizeRole(ROLES.Client),
  userController.getAllRoles
);

export { router as userRouter };
