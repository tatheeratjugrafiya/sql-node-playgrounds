import { sql } from "drizzle-orm";
import { text, timestamp, pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ROLES } from "../constants/roles.constants.js";
import { z } from "zod";
export const userRoleEnum = pgEnum("user_role", Object.values(ROLES || {}));
export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: userRoleEnum("role")
    .notNull()
    .default(
      Object.values(ROLES || {})[Object.values(ROLES || {})?.length - 1]
    ),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

const validPassword = z
  .string()
  .min(6, "Password must have 6 characters")
  .refine(
    (value) => /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
    "Password must contain atleast one special character"
  )
  .refine(
    (value) => /[A-Z]/.test(value),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (value) => /[0-9]/.test(value),
    "Password must contain at least one number"
  )
  .refine(
    (value) => /[a-z]/.test(value),
    "Password must contain at least one lowercase letter"
  );

export const insertUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: validPassword,
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z
      .enum(Object.values(ROLES || {}))
      .optional()
      .default("user"),
    image: z.string().optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    password: validPassword,
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});
