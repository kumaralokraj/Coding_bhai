
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
