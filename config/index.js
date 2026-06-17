import dotenv from "dotenv";

dotenv.config();

/**
 * Application config from env. Replace placeholder auth with DB when ready.
 * @typedef {Object} Config
 * @property {number} PORT
 * @property {string} NODE_ENV
 * @property {string} JWT_SECRET
 * @property {string} JWT_EXPIRES_IN
 * @property {string} AUTH_PLACEHOLDER_EMAIL
 * @property {string} AUTH_PLACEHOLDER_PASSWORD_HASH
 * @property {string} [CLIENT_ORIGIN]
 */

/** @type {Config} */
const config = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  AUTH_PLACEHOLDER_EMAIL: process.env.AUTH_PLACEHOLDER_EMAIL || "admin@example.com",
  AUTH_PLACEHOLDER_PASSWORD_HASH: process.env.AUTH_PLACEHOLDER_PASSWORD_HASH || "",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "BuildMyRide <onboarding@resend.dev>",
};

export default config;
