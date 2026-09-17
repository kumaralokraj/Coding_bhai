import pool from "../config/db.js";
import bcrypt from "bcrypt";


// ================= GET SETTINGS =================

export const getUserSettings = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      email_notifications,
      contest_notifications,
      daily_reminder,
      auto_save,
      word_wrap,
      editor_font_size
    FROM user_settings
    WHERE user_id = $1
    `,
    [userId]
  );

  // Create default settings if user doesn't have a row
  if (result.rows.length === 0) {
    const newSettings = await pool.query(
      `
      INSERT INTO user_settings (user_id)
      VALUES ($1)
      RETURNING
        email_notifications,
        contest_notifications,
        daily_reminder,
        auto_save,
        word_wrap,
        editor_font_size
      `,
      [userId]
    );

    return formatSettings(newSettings.rows[0]);
  }

  return formatSettings(result.rows[0]);
};


// ================= UPDATE SETTINGS =================

export const updateUserSettings = async (
  userId,
  {
    emailNotifications,
    contestNotifications,
    dailyReminder,
    autoSave,
    wordWrap,
    editorFontSize,
  }
) => {

  const result = await pool.query(
    `
    INSERT INTO user_settings (
      user_id,
      email_notifications,
      contest_notifications,
      daily_reminder,
      auto_save,
      word_wrap,
      editor_font_size
    )

    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
    )

    ON CONFLICT (user_id)

    DO UPDATE SET
      email_notifications = EXCLUDED.email_notifications,
      contest_notifications = EXCLUDED.contest_notifications,
      daily_reminder = EXCLUDED.daily_reminder,
      auto_save = EXCLUDED.auto_save,
      word_wrap = EXCLUDED.word_wrap,
      editor_font_size = EXCLUDED.editor_font_size,
      updated_at = CURRENT_TIMESTAMP

    RETURNING
      email_notifications,
      contest_notifications,
      daily_reminder,
      auto_save,
      word_wrap,
      editor_font_size
    `,
    [
      userId,
      emailNotifications,
      contestNotifications,
      dailyReminder,
      autoSave,
      wordWrap,
      editorFontSize,
    ]
  );

  return formatSettings(result.rows[0]);
};


// ================= FORMAT RESPONSE =================

const formatSettings = (settings) => {
  return {
    emailNotifications: settings.email_notifications,
    contestNotifications: settings.contest_notifications,
    dailyReminder: settings.daily_reminder,

    autoSave: settings.auto_save,
    wordWrap: settings.word_wrap,

    fontSize: settings.editor_font_size,
  };
};
export const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  // 1. Get current password hash
  const result = await pool.query(
    `
    SELECT password
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  // 2. Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // 3. Don't allow same password
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

  // 5. Update password
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