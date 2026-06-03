import createError from "http-errors";
import * as userService from "../services/userService.js";

export const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const getUsers = async (req, res) => {
  const users = await userService.getUsers();
  res.status(200).json(users);
};

export const updateUser = async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) return next(createError(404, "User not found"));
  res.status(200).json(user);
};

export const deleteUser = async (req, res, next) => {
  const deleted = await userService.deleteUser(req.params.id);
  if (!deleted) return next(createError(404, "User not found"));
  res.status(200).json({ message: "User deleted" });
};

export const updateName = async (req, res) => {
  const user = await userService.updateUserName(req.user.id, req.body.name);
  res.status(200).json({
    success: true,
    message: "Name updated successfully",
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const updateEmail = async (req, res) => {
  const user = await userService.updateUserEmail(req.user.id, req.body.email);
  res.status(200).json({
    success: true,
    message: "Email updated successfully",
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.updateUserPassword(req.user.id, currentPassword, newPassword);
  res.status(200).json({ success: true, message: "Password updated successfully" });
};
