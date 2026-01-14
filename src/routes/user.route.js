import express from "express";
//controllers
import userController from "../controllers/user.controllers.js";
const router = express.Router();

router.route("/all-roles").get(userController.getAllRoles);

export { router as userRouter };
