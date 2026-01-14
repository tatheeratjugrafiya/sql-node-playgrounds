import { ROLES } from "../constants/roles.constants.js";
import { ApiResponse } from "../utils/api-response.js";
import httpStatus from "http-status";
class UserController {
  getAllRoles(req, res, next) {
    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, ROLES, "Roles fetched successfully.")
      );
  }
}
const userController = new UserController();

export default userController;
