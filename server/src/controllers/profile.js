import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/profile.js";


// ================= GET PROFILE =================

export const profile = async (req, res) => {
  try {

    const profileData = await getProfile(req.userId);

    res.status(200).json(profileData);

  } catch (error) {

    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= UPDATE PROFILE =================

export const editProfile = async (req, res) => {
  try {

    const { name, email } = req.body;


    // Validation
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }


    const updatedUser = await updateProfile(
      req.userId,
      name,
      email
    );


    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {

    console.error("Update Profile Error:", error);


    res.status(400).json({
      message: error.message,
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

    console.log("Password request user:", req.userId);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    await changePassword(
      req.userId,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};