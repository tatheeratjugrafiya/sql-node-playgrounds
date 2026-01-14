import passport from "passport";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import ApiError from "../utils/api-error.js";
import env from "../config/config.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

// Original passport-based middleware (kept for compatibility if needed)
export function authMiddleware(req, res, next) {
  const authenticateOption = { session: false };

  passport.authenticate("jwt", authenticateOption, (err, user, info) => {
    if (err || info || !user) {
      next(
        new ApiError(httpStatus.UNAUTHORIZED, err || info || "no user found")
      );
    }
    req.user = user;
    next();
  })(req, res, next);
}

// 1. JWT Authentication Middleware (Manual)
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Please authenticate (Missing or invalid header)"
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, env.jwt.secret);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
};

// 2. Role-Based Authorization Middleware (Higher-Order Function)
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated")
      );
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden: You do not have the required role"
        )
      );
    }

    next();
  };
};
