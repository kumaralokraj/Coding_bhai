
import { changeUserPassword } from "../services/authService.js";

import crypto from "node:crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import pool from "../config/db.js";


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const result = await changeUserPassword(
      req.userId,
      currentPassword,
      newPassword
    );

    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 465),
    secure: Number(process.env.EMAIL_PORT || 465) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const forgotPassword = async (req, res) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email address.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, email
       FROM users
       WHERE LOWER(email) = $1 AND is_active = TRUE`,
      [email]
    );

    // Do not reveal whether an account exists.
    if (!result.rows.length) {
      return res.json({
        success: true,
        message:
          "If an active account exists for this email, reset instructions will be sent.",
      });
    }

    const user = result.rows[0];

    // Generate a random token; store only its SHA-256 hash.
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO password_reset_tokens
         (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/reset-password?token=${token}`;

    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your CodingBhai password",
        text: [
          "We received a request to reset your CodingBhai password.",
          "",
          `Open this link to reset your password: ${resetUrl}`,
          "",
          "This link expires in 15 minutes and can only be used once.",
          "If you did not request this, you can ignore this email.",
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Reset your CodingBhai password</h2>
            <p>Click the button below to choose a new password.</p>
            <p>
              <a href="${resetUrl}"
                 style="display:inline-block;padding:12px 20px;
                        background:#06b6d4;color:#082f49;
                        text-decoration:none;border-radius:8px">
                Reset Password
              </a>
            </p>
            <p>This link expires in 15 minutes and works only once.</p>
            <p>If you did not request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      // Do not leave an active token if delivery failed.
      await pool.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE token_hash = $1 AND used_at IS NULL`,
        [tokenHash]
      );

      console.error("Password reset email delivery failed:", emailError.message);

      return res.status(503).json({
        success: false,
        message: "Unable to send the reset email right now. Please try again later.",
      });
    }

    return res.json({
      success: true,
      message:
        "If an active account exists for this email, reset instructions will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process your request right now.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/i.test(token) ||
    typeof newPassword !== "string" ||
    newPassword.length < 8 ||
    newPassword.length > 128
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid reset token and password of 8–128 characters are required.",
    });
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT prt.id, prt.user_id
       FROM password_reset_tokens prt
       JOIN users u ON u.id = prt.user_id
       WHERE prt.token_hash = $1
         AND prt.used_at IS NULL
         AND prt.expires_at > NOW()
         AND u.is_active = TRUE
       FOR UPDATE OF prt`,
      [tokenHash]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Reset link is invalid, expired, or already used. Please request a new one.",
      });
    }

    const resetRecord = result.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query(
      `UPDATE users
       SET password = $1,
           token_version = token_version + 1
       WHERE id = $2 AND is_active = TRUE`,
      [hashedPassword, resetRecord.user_id]
    );

    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL`,
      [resetRecord.user_id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password right now.",
    });
  } finally {
    client?.release();
  }
};
