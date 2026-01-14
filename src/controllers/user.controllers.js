import { ROLES } from "../constants/roles.constants.js";
import { ApiResponse } from "../utils/api-response.js";
class UserController {
  getAllRoles(req, res, next) {
    return res
      .status(200)
      .json(new ApiResponse(200, ROLES, "Roles fetched successfully."));
  }
}
const userController = new UserController();

export default userController;
