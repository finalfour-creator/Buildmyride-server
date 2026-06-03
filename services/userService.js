import bcrypt from "bcryptjs";
import createError from "http-errors";
import User from "../models/User.js";

export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select("name email password");
  if (!user) return null;
  return { id: user._id.toString(), email: user.email, password: user.password, name: user.name };
};

export const getUserById = async (id) => User.findById(id).select("-password");

export const getUsers = async () => User.find().select("-password");

export const createUser = async (data) => User.create(data);

export const updateUser = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

export const deleteUser = async (id) => User.findByIdAndDelete(id);

export const updateUserName = async (userId, name) => {
  if (!name || name.trim().length < 2) {
    throw createError(400, "Name must be at least 2 characters");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { name: name.trim() },
    { new: true }
  ).select("-password");
  if (!user) throw createError(404, "User not found");
  return user;
};

export const updateUserEmail = async (userId, email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw createError(400, "Invalid email format");
  }
  const existing = await User.findOne({ email });
  if (existing && existing._id.toString() !== userId) {
    throw createError(409, "Email already in use");
  }
  const user = await User.findByIdAndUpdate(userId, { email }, { new: true }).select("-password");
  if (!user) throw createError(404, "User not found");
  return user;
};

const PASSWORD_REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  digit: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw createError(401, "Current password is incorrect");

  if (!newPassword || newPassword.length < 8) throw createError(400, "Password must be at least 8 characters");
  if (!PASSWORD_REGEX.upper.test(newPassword)) throw createError(400, "Password must contain at least 1 uppercase letter");
  if (!PASSWORD_REGEX.lower.test(newPassword)) throw createError(400, "Password must contain at least 1 lowercase letter");
  if (!PASSWORD_REGEX.digit.test(newPassword)) throw createError(400, "Password must contain at least 1 number");
  if (!PASSWORD_REGEX.special.test(newPassword)) throw createError(400, "Password must contain at least 1 special character");

  const hash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hash });
};
