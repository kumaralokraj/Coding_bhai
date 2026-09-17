import {
  getUserSettings,
  updateUserSettings,
  changePassword
} from "../services/setting.js";


// ================= GET SETTINGS =================

export const getSettings = async (req, res) => {
  try {

    const settings = await getUserSettings(
      req.userId
    );

    res.status(200).json({
      settings,
    });

  } catch (error) {

    console.error("Get Settings Error:", error);

    res.status(500).json({
      message: "Failed to load settings",
    });
  }
};


// ================= UPDATE SETTINGS =================

export const updateSettings = async (req, res) => {
  try {

    const {
      emailNotifications,
      contestNotifications,
      dailyReminder,
      autoSave,
      wordWrap,
      fontSize,
    } = req.body;


    // ================= VALIDATION =================

    if (
      typeof emailNotifications !== "boolean" ||
      typeof contestNotifications !== "boolean" ||
      typeof dailyReminder !== "boolean" ||
      typeof autoSave !== "boolean" ||
      typeof wordWrap !== "boolean"
    ) {
      return res.status(400).json({
        message: "Invalid settings data",
      });
    }


    const parsedFontSize = Number(fontSize);


    if (
      !Number.isInteger(parsedFontSize) ||
      parsedFontSize < 10 ||
      parsedFontSize > 24
    ) {
      return res.status(400).json({
        message: "Font size must be between 10 and 24",
      });
    }


    // ================= UPDATE =================

    const settings = await updateUserSettings(
      req.userId,
      {
        emailNotifications,
        contestNotifications,
        dailyReminder,
        autoSave,
        wordWrap,
        editorFontSize: parsedFontSize,
      }
    );


    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });

  } catch (error) {

    console.error("Update Settings Error:", error);

    res.status(500).json({
      message: "Failed to update settings",
    });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    await changePassword(
      req.userId,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};