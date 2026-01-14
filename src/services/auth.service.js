import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import ApiError from "../utils/api-error.js";
import { TOKEN_TYPES } from "../config/tokens.js";
import * as tokenService from "./token.service.js";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  //   return { ...userBody };
  const [user] = await db
    .insert(users)
    .values({ ...userBody, password: hashedPassword })
    .returning();
  return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Check if email is taken
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email) => {
  const user = await getUserByEmail(email);
  return !!user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      TOKEN_TYPES.REFRESH
    );
    const user = await getUserById(refreshTokenDoc.sub);
    if (!user) {
      throw new Error();
    }
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

export {
  createUser,
  loginUserWithEmailAndPassword,
  getUserByEmail,
  refreshAuth,
};
