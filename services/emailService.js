import config from "../config/index.js";

export const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${config.CLIENT_URL}/reset-password?token=${resetToken}`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": config.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "BuildMyRide", email: config.EMAIL_FROM_ADDRESS },
      to: [{ email: toEmail }],
      subject: "BuildMyRide — Password Reset Request",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f1923; color: #ffffff; border-radius: 12px; overflow: hidden;">

          <div style="background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding: 36px 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
              BUILD<span style="color: #22a7f0;">MY</span>RIDE
            </h1>
          </div>

          <div style="padding: 40px;">
            <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
            <p style="margin: 0 0 24px; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6;">
              We received a request to reset the password for your BuildMyRide account.
              Click the button below to choose a new password. This link expires in <strong style="color: #fff;">1 hour</strong>.
            </p>

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
            </p>
          </div>

          <div style="padding: 20px 40px; text-align: center; background: rgba(0,0,0,0.2);">
            <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.25);">
              © ${new Date().getFullYear()} BuildMyRide. All rights reserved.
            </p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Email send failed: ${JSON.stringify(err)}`);
  }
};
