
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const signupUser = async (name, email, password) => {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, hashedPassword]
  );

  return result.rows[0];
};

export const loginUser = async (email, password) => {
  const result = await pool.query(
    `SELECT id, name, email, password, role, is_active, token_version
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (!result.rows.length) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error("Your account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      tokenVersion: user.token_version,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
export const googleLoginUser = async (credential) => {
  // 1. Verify the Google ID token
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true
  ) {
    throw new Error("Verified Google account required");
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = payload.name || email.split("@")[0];
  const avatar = payload.picture || null;

  // 2. Look for an account already linked to this Google ID
  const googleUser = await pool.query(
    `SELECT id, name, email, role, is_active, token_version
     FROM users
     WHERE google_id = $1`,
    [googleId]
  );

  let user;

  if (googleUser.rows.length > 0) {
    user = googleUser.rows[0];

    if (!user.is_active) {
      throw new Error("Your account is inactive");
    }

    await pool.query(
      `UPDATE users SET avatar = $1 WHERE id = $2`,
      [avatar, user.id]
    );
  } else {
    // 3. Do not silently link an existing password account
    const existingEmail = await pool.query(
      `SELECT id FROM users WHERE LOWER(email) = $1`,
      [email]
    );

    if (existingEmail.rows.length > 0) {
      throw new Error(
        "An account already exists with this email. Sign in with your existing method first."
      );
    }

    // Generate an unusable random password for the existing
    // schema, where users.password is used for password login.
    const randomPassword = crypto.randomBytes(48).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const created = await pool.query(
      `INSERT INTO users
         (name, email, password, google_id, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, is_active, token_version`,
      [name, email, hashedPassword, googleId, avatar]
    );

    user = created.rows[0];
  }

  // 4. Issue the same JWT structure as normal login
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      tokenVersion: user.token_version,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 5. Return a response compatible with loginUser
  return {
    message: "Google login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar,
    },
  };
};

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const result = await pool.query(
    `SELECT password
     FROM users
     WHERE id = $1 AND is_active = TRUE`,
    [userId]
  );

  if (!result.rows.length) {
    throw new Error("Account not found or inactive");
  }

  const isValid = await bcrypt.compare(
    currentPassword,
    result.rows[0].password
  );

  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password must differ from current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users
     SET password = $1,
         token_version = token_version + 1
     WHERE id = $2`,
    [hashedPassword, userId]
  );

  return {
    success: true,
    message: "Password changed. Please log in again.",
  };
};
