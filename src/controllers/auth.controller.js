import { ApiResponse } from "../utils/api-response.js";
import httpStatus from "http-status";
class AuthController {
  signup(req, res, next) {
    return res
      .status(httpStatus.CREATED)
      .json(new ApiResponse(httpStatus.CREATED, {}, "Signup successful."));
  }

  login(req, res, next) {
    return res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, {}, "Login successful."));
  }

  forgotPassword(req, res, next) {
    return res
      .status(httpStatus.OK)
      .json(new ApiResponse(200, {}, "Forgot password email sent."));
  }
}

const authController = new AuthController();
export default authController;
