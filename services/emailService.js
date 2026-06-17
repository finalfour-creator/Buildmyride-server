import nodemailer from "nodemailer";
import config from "../config/index.js";

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT === 465,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${config.CLIENT_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: config.EMAIL_FROM,
    to: toEmail,
    subject: "BuildMyRide — Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f1923; color: #ffffff; border-radius: 12px; overflow: hidden;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding: 36px 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
            BUILD<span style="color: #22a7f0;">MY</span>RIDE
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px;">
          <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
          <p style="margin: 0 0 24px; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6;">
            We received a request to reset the password for your BuildMyRide account.
            Click the button below to choose a new password. This link expires in <strong style="color: #fff;">1 hour</strong>.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
               style="display: inline-block; background: #22a7f0; color: #ffffff; text-decoration: none;
                      font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
                      padding: 14px 36px; border-radius: 8px;">
              Reset Password
            </a>
          </div>

          <p style="margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.4);">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="margin: 0 0 24px; font-size: 11px; word-break: break-all; color: #22a7f0;">
            ${resetUrl}
          </p>

          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.35);">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will remain unchanged.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 40px; text-align: center; background: rgba(0,0,0,0.2);">
          <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.25);">
            © ${new Date().getFullYear()} BuildMyRide. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
};
