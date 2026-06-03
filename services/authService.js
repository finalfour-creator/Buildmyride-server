import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { getUserByEmail } from "./userService.js";
import User from "../models/User.js";

/**
 * Returns user object on success, null if email not found,
 * or { wrongPassword: true } if password does not match.
 */
export const login = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { wrongPassword: true };

  return { id: user.id, email: user.email, name: user.name };
};

export const createUser = async (name, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) return null;

  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hashedPassword });
};

export const createToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
};
