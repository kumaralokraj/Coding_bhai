import pool from "../config/db.js";
import bcrypt from "bcrypt";

// ================= GET PROFILE =================

export const getProfile = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.created_at,

      up.problems_solved,
      up.current_streak,
      up.coding_score,
      up.global_rank,

      up.dsa_progress,
      up.javascript_progress,
      up.react_progress,
      up.backend_progress

    FROM users u

    LEFT JOIN user_progress up
      ON u.id = up.user_id

    WHERE u.id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    },

    stats: {
      problemsSolved: user.problems_solved || 0,
      currentStreak: user.current_streak || 0,
      codingScore: user.coding_score || 0,
      globalRank: user.global_rank || null,
    },

    progress: {
      dsa: user.dsa_progress || 0,
      javascript: user.javascript_progress || 0,
      react: user.react_progress || 0,
      backend: user.backend_progress || 0,
    },
  };
};


// ================= UPDATE PROFILE =================

export const updateProfile = async (userId, name, email) => {

  // Check email already exists for another user
  const existingUser = await pool.query(
    `
    SELECT id
    FROM users
    WHERE email = $1
      AND id != $2
    `,
    [email, userId]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }


  // Update user
  const result = await pool.query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2
    WHERE id = $3

    RETURNING id, name, email, created_at
    `,
    [name, email, userId]
  );


  if (result.rows.length === 0) {
    throw new Error("User not found");
  }


  const user = result.rows[0];


  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  };
};


// ================= CHANGE PASSWORD =================

export const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {

  // 1. Get current hashed password
  const result = await pool.query(
    `
    SELECT password
    FROM users
    WHERE id = $1
    `,
    [userId]
  );


  // User doesn't exist
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }


  const user = result.rows[0];


  // 2. Compare current password with hashed password
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );


  if (!isPasswordCorrect) {
    throw new Error("Current password is incorrect");
  }


  // 3. Check new password is different
  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password
  );


  if (isSamePassword) {
    throw new Error(
      "New password must be different from current password"
    );
  }


  // 4. Hash new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );


  // 5. Update password in database
  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE id = $2
    `,
    [hashedPassword, userId]
  );


  return {
    message: "Password changed successfully",
  };
};