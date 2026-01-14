import httpStatus from "http-status";
import { ApiResponse } from "../utils/api-response.js";
import { authService, tokenService } from "../services/index.js";
import { asyncHandler as catchAsync } from "../utils/async-handler.js";

class AuthController {
  signup = catchAsync(async (req, res) => {
    const user = await authService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    delete user["password"];
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          { user, tokens },
          "Signup successful."
        )
      );
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );
    const tokens = await tokenService.generateAuthTokens(user);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, { user, tokens }, "Login successful.")
      );
  });

  forgotPassword = catchAsync(async (req, res) => {
    // Implementation for forgot password
    res.status(httpStatus.NO_CONTENT).send();
  });

  refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  });
}

const authController = new AuthController();
export default authController;
