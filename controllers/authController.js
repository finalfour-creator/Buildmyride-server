import crypto from "crypto";
import bcrypt from "bcryptjs";
import { login as loginService, createUser, createToken } from "../services/authService.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";
import { getUserByEmail } from "../services/userService.js";
import { sendPasswordResetEmail } from "../services/emailService.js";
import User from "../models/User.js";

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ field: "email", message: "Invalid email format" });
  }

  const { email, password } = parsed.data;
  const result = await loginService(email, password);

  if (result === null) {
    return res.status(401).json({ field: "email", message: "Incorrect email" });
  }
  if (result.wrongPassword) {
    return res.status(401).json({ field: "password", message: "Incorrect password" });
  }

  const token = createToken({ sub: result.id, email: result.email });
  res.status(200).json({ user: { id: result.id, email: result.email, name: result.name }, token });
}

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return res.status(400).json({ message: firstError.message });
  }

  const { name, email, password } = parsed.data;
  const user = await createUser(name, email, password);

  if (!user) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const token = createToken({ sub: user.id, email: user.email });
  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
}

export function me(req, res) {
  res.status(200).json({ user: req.user });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  try {
    const user = await getUserByEmail(email);
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await User.findByIdAndUpdate(user.id, { resetToken, resetTokenExpiry });
      await sendPasswordResetEmail(email, resetToken);
    }
    // Always return 200 — never reveal whether the email exists
    return res.status(200).json({
      message: "If that email is registered, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("[forgotPassword]", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  // Password strength validation
  if (newPassword.length < 8)
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  if (!/[A-Z]/.test(newPassword))
    return res.status(400).json({ message: "Password needs 1 uppercase letter (A-Z)." });
  if (!/[a-z]/.test(newPassword))
    return res.status(400).json({ message: "Password needs 1 lowercase letter (a-z)." });
  if (!/[0-9]/.test(newPassword))
    return res.status(400).json({ message: "Password needs 1 number (0-9)." });
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword))
    return res.status(400).json({ message: "Password needs 1 special character." });

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, {
      password: hash,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return res.status(200).json({ message: "Password reset successful. You can now sign in." });
  } catch (err) {
    console.error("[resetPassword]", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
