// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import Sidebar from "../components/layout/Sidebar";
// import MobileSidebar from "../components/layout/MobileSidebar";

// function Settings() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navigate = useNavigate();

//   // ================= SETTINGS STATE =================

//   const [settings, setSettings] = useState({
//     emailNotifications: true,
//     contestNotifications: true,
//     dailyReminder: true,
//     autoSave: true,
//     wordWrap: true,
//   });

//   const [fontSize, setFontSize] = useState("14");

//   // ================= USER =================

//   const storedUser = localStorage.getItem("user");

//   const user = storedUser
//     ? JSON.parse(storedUser)
//     : null;

//   // ================= TOGGLE =================

//   const handleToggle = (setting) => {
//     setSettings((prev) => ({
//       ...prev,
//       [setting]: !prev[setting],
//     }));
//   };

//   // ================= LOGOUT =================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">

//       {/* ================= SIDEBAR ================= */}

//       <Sidebar />

//       {/* ================= MOBILE SIDEBAR ================= */}

//       <MobileSidebar
//         isOpen={isMobileMenuOpen}
//         onClose={() => setIsMobileMenuOpen(false)}
//       />

//       {/* ================= MOBILE HEADER ================= */}

//       <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 px-5 backdrop-blur lg:hidden">

//         <button
//           onClick={() => setIsMobileMenuOpen(true)}
//           className="rounded-lg border border-slate-700 px-3 py-1.5 text-xl"
//         >
//           ☰
//         </button>

//         <Link
//           to="/"
//           className="ml-3 text-xl font-bold"
//         >
//           Coding<span className="text-cyan-400">
//             Bhai
//           </span>
//         </Link>

//       </header>

//       {/* ================= MAIN ================= */}

//       <main className="min-h-screen lg:ml-64">

//         <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">

//           {/* ================= HEADER ================= */}

//           <div className="mb-8">

//             <p className="text-sm text-cyan-400">
//               CodingBhai
//             </p>

//             <h1 className="mt-1 text-3xl font-bold">
//               Settings
//             </h1>

//             <p className="mt-2 text-slate-400">
//               Manage your account and coding preferences.
//             </p>

//           </div>

//           {/* ================================================= */}
//           {/* ACCOUNT SETTINGS                                  */}
//           {/* ================================================= */}

//           <section className="mb-6">

//             <h2 className="mb-4 text-xl font-bold">
//               Account
//             </h2>

//             <div className="rounded-2xl border border-slate-800 bg-slate-900">

//               {/* Profile */}

//               <Link
//                 to="/profile"
//                 className="flex items-center justify-between border-b border-slate-800 p-5 transition hover:bg-slate-800/50"
//               >

//                 <div className="flex items-center gap-4">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
//                     👤
//                   </div>

//                   <div>

//                     <h3 className="font-semibold">
//                       Profile
//                     </h3>

//                     <p className="mt-1 text-sm text-slate-500">
//                       {user?.name || "Manage your profile"}
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-slate-500">
//                   →
//                 </span>

//               </Link>

//               {/* Email */}

//               <div className="flex items-center justify-between p-5">

//                 <div className="flex items-center gap-4">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
//                     ✉️
//                   </div>

//                   <div>

//                     <h3 className="font-semibold">
//                       Email Address
//                     </h3>

//                     <p className="mt-1 text-sm text-slate-500">
//                       {user?.email || "No email available"}
//                     </p>

//                   </div>

//                 </div>

//               </div>

//             </div>

//           </section>

//           {/* ================================================= */}
//           {/* NOTIFICATIONS                                     */}
//           {/* ================================================= */}

//           <section className="mb-6">

//             <h2 className="mb-4 text-xl font-bold">
//               Notifications
//             </h2>

//             <div className="rounded-2xl border border-slate-800 bg-slate-900">

//               <SettingToggle
//                 title="Email Notifications"
//                 description="Receive important updates through email."
//                 enabled={settings.emailNotifications}
//                 onClick={() =>
//                   handleToggle("emailNotifications")
//                 }
//               />

//               <SettingToggle
//                 title="Contest Notifications"
//                 description="Get notified about upcoming contests."
//                 enabled={settings.contestNotifications}
//                 onClick={() =>
//                   handleToggle("contestNotifications")
//                 }
//               />

//               <SettingToggle
//                 title="Daily Coding Reminder"
//                 description="Receive a reminder to practice coding."
//                 enabled={settings.dailyReminder}
//                 onClick={() =>
//                   handleToggle("dailyReminder")
//                 }
//                 last
//               />

//             </div>

//           </section>

//           {/* ================================================= */}
//           {/* EDITOR SETTINGS                                   */}
//           {/* ================================================= */}

//           <section className="mb-6">

//             <h2 className="mb-4 text-xl font-bold">
//               Code Editor
//             </h2>

//             <div className="rounded-2xl border border-slate-800 bg-slate-900">

//               {/* Auto Save */}

//               <SettingToggle
//                 title="Auto Save"
//                 description="Automatically save your code while working."
//                 enabled={settings.autoSave}
//                 onClick={() =>
//                   handleToggle("autoSave")
//                 }
//               />

//               {/* Word Wrap */}

//               <SettingToggle
//                 title="Word Wrap"
//                 description="Wrap long lines inside the code editor."
//                 enabled={settings.wordWrap}
//                 onClick={() =>
//                   handleToggle("wordWrap")
//                 }
//               />

//               {/* Font Size */}

//               <div className="flex items-center justify-between gap-5 p-5">

//                 <div>

//                   <h3 className="font-semibold">
//                     Editor Font Size
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Choose the font size for the code editor.
//                   </p>

//                 </div>

//                 <select
//                   value={fontSize}
//                   onChange={(e) =>
//                     setFontSize(e.target.value)
//                   }
//                   className="
//                     rounded-xl
//                     border border-slate-700
//                     bg-slate-950
//                     px-4 py-2
//                     text-sm
//                     text-white
//                     outline-none
//                     focus:border-cyan-500
//                   "
//                 >
//                   <option value="12">12px</option>
//                   <option value="14">14px</option>
//                   <option value="16">16px</option>
//                   <option value="18">18px</option>
//                   <option value="20">20px</option>
//                 </select>

//               </div>

//             </div>

//           </section>

//           {/* ================================================= */}
//           {/* APPEARANCE                                        */}
//           {/* ================================================= */}

//           <section className="mb-6">

//             <h2 className="mb-4 text-xl font-bold">
//               Appearance
//             </h2>

//             <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

//               <div className="flex items-center justify-between">

//                 <div>

//                   <h3 className="font-semibold">
//                     Theme
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500">
//                     CodingBhai currently uses dark mode.
//                   </p>

//                 </div>

//                 <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
//                   🌙 Dark
//                 </div>

//               </div>

//             </div>

//           </section>

//           {/* ================================================= */}
//           {/* SECURITY                                          */}
//           {/* ================================================= */}

//           <section className="mb-6">

//             <h2 className="mb-4 text-xl font-bold">
//               Security
//             </h2>

//             <div className="rounded-2xl border border-slate-800 bg-slate-900">

//               <button
//                 onClick={() =>
//                   alert(
//                     "Change password feature will be added next."
//                   )
//                 }
//                 className="
//                   flex w-full
//                   items-center justify-between
//                   p-5
//                   text-left
//                   transition
//                   hover:bg-slate-800/50
//                 "
//               >

//                 <div className="flex items-center gap-4">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
//                     🔐
//                   </div>

//                   <div>

//                     <h3 className="font-semibold">
//                       Change Password
//                     </h3>

//                     <p className="mt-1 text-sm text-slate-500">
//                       Update your account password.
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-slate-500">
//                   →
//                 </span>

//               </button>

//             </div>

//           </section>

//           {/* ================================================= */}
//           {/* LOGOUT                                            */}
//           {/* ================================================= */}

//           <section className="mb-6">

//             <button
//               onClick={handleLogout}
//               className="
//                 flex w-full
//                 items-center justify-between
//                 rounded-2xl
//                 border border-red-500/20
//                 bg-red-500/5
//                 p-5
//                 text-left
//                 transition
//                 hover:bg-red-500/10
//               "
//             >

//               <div className="flex items-center gap-4">

//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-xl">
//                   🚪
//                 </div>

//                 <div>

//                   <h3 className="font-semibold text-red-400">
//                     Logout
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Sign out from your CodingBhai account.
//                   </p>

//                 </div>

//               </div>

//               <span className="text-red-400">
//                 →
//               </span>

//             </button>

//           </section>

//           {/* ================================================= */}
//           {/* DANGER ZONE                                       */}
//           {/* ================================================= */}

//           <section>

//             <h2 className="mb-4 text-xl font-bold text-red-400">
//               Danger Zone
//             </h2>

//             <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

//               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//                 <div>

//                   <h3 className="font-semibold">
//                     Delete Account
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Permanently delete your CodingBhai account
//                     and associated data.
//                   </p>

//                 </div>

//                 <button
//                   onClick={() =>
//                     alert(
//                       "Account deletion will be implemented later."
//                     )
//                   }
//                   className="
//                     rounded-xl
//                     border border-red-500/40
//                     px-5 py-2.5
//                     text-sm font-semibold
//                     text-red-400
//                     transition
//                     hover:bg-red-500/10
//                   "
//                 >
//                   Delete Account
//                 </button>

//               </div>

//             </div>

//           </section>

//         </div>

//       </main>

//     </div>
//   );
// }


// /* ================================================= */
// /*                SETTING TOGGLE                     */
// /* ================================================= */

// function SettingToggle({
//   title,
//   description,
//   enabled,
//   onClick,
//   last = false,
// }) {
//   return (
//     <div
//       className={`flex items-center justify-between gap-5 p-5 ${
//         !last ? "border-b border-slate-800" : ""
//       }`}
//     >

//       <div>

//         <h3 className="font-semibold">
//           {title}
//         </h3>

//         <p className="mt-1 text-sm text-slate-500">
//           {description}
//         </p>

//       </div>

//       <button
//         onClick={onClick}
//         className={`
//           relative
//           h-6
//           w-11
//           shrink-0
//           rounded-full
//           transition
//           ${
//             enabled
//               ? "bg-cyan-500"
//               : "bg-slate-700"
//           }
//         `}
//       >

//         <span
//           className={`
//             absolute
//             top-1
//             h-4
//             w-4
//             rounded-full
//             bg-white
//             transition
//             ${
//               enabled
//                 ? "left-6"
//                 : "left-1"
//             }
//           `}
//         />

//       </button>

//     </div>
//   );
// }

// export default Settings;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import api from "../services/api";

function Settings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] =
  useState(false);

const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [passwordLoading, setPasswordLoading] =
  useState(false);

const [passwordError, setPasswordError] =
  useState("");

const [passwordSuccess, setPasswordSuccess] =
  useState("");

  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    contestNotifications: true,
    dailyReminder: true,
    autoSave: true,
    wordWrap: true,
    fontSize: 14,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH SETTINGS =================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSettings(response.data.settings);

      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load settings"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);


  // ================= UPDATE SETTING =================

  const updateSetting = async (name, value) => {

    const updatedSettings = {
      ...settings,
      [name]: value,
    };

    // Optimistic UI
    setSettings(updatedSettings);

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/settings",
        updatedSettings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(response.data.settings);

    } catch (error) {

      console.error(error);

      // Reload old database value
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSettings(response.data.settings);

      } catch {
        console.error("Failed to restore settings");
      }

      alert(
        error.response?.data?.message ||
          "Failed to save setting"
      );

    } finally {
      setSaving(false);
    }
  };


  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-cyan-400">
          Loading settings...
        </p>
      </div>
    );
  }

const handleChangePassword = async (e) => {
  e.preventDefault();

  setPasswordError("");
  setPasswordSuccess("");

  if (
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword
  ) {
    setPasswordError(
      "All password fields are required"
    );
    return;
  }

  if (
    passwordForm.newPassword !==
    passwordForm.confirmPassword
  ) {
    setPasswordError(
      "New passwords do not match"
    );
    return;
  }

  if (passwordForm.newPassword.length < 8) {
    setPasswordError(
      "Password must be at least 8 characters"
    );
    return;
  }

  try {
    setPasswordLoading(true);

    const token = localStorage.getItem("token");

    const response = await api.put(
      "/profile/password",
      passwordForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPasswordSuccess(response.data.message);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    setPasswordError(
      error.response?.data?.message ||
      "Failed to change password"
    );
  } finally {
    setPasswordLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}

      <Sidebar />


      {/* Mobile Sidebar */}

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />


      {/* Mobile Header */}

      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 px-5 backdrop-blur lg:hidden">

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xl"
        >
          ☰
        </button>

        <Link
          to="/"
          className="ml-3 text-xl font-bold"
        >
          Coding<span className="text-cyan-400">
            Bhai
          </span>
        </Link>

      </header>


      {/* Main */}

      <main className="min-h-screen lg:ml-64">

        <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">

          {/* Header */}

          <div className="mb-8">

            <p className="text-sm text-cyan-400">
              CodingBhai
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Settings
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your account and coding preferences.
            </p>

            {saving && (
              <p className="mt-2 text-xs text-cyan-400">
                Saving changes...
              </p>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-400">
                {error}
              </p>
            )}

          </div>


          {/* ================= ACCOUNT ================= */}

          <section className="mb-8">

            <h2 className="mb-4 text-xl font-bold">
              Account
            </h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

              <Link
                to="/profile"
                className="flex items-center justify-between border-b border-slate-800 p-5 transition hover:bg-slate-800/50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
                    👤
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Profile
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your personal information
                    </p>
                  </div>

                </div>

                <span className="text-slate-500">
                  →
                </span>

              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-between p-5 transition hover:bg-slate-800/50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                    ✉️
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Account Information
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      View and edit your account details
                    </p>
                  </div>

                </div>

                <span className="text-slate-500">
                  →
                </span>

              </Link>

            </div>

          </section>


          {/* ================= NOTIFICATIONS ================= */}

          <section className="mb-8">

            <h2 className="mb-4 text-xl font-bold">
              Notifications
            </h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

              <SettingToggle
                title="Email Notifications"
                description="Receive important updates through email."
                enabled={settings.emailNotifications}
                onClick={() =>
                  updateSetting(
                    "emailNotifications",
                    !settings.emailNotifications
                  )
                }
              />

              <SettingToggle
                title="Contest Notifications"
                description="Get notified about upcoming contests."
                enabled={settings.contestNotifications}
                onClick={() =>
                  updateSetting(
                    "contestNotifications",
                    !settings.contestNotifications
                  )
                }
              />

              <SettingToggle
                title="Daily Coding Reminder"
                description="Receive a reminder to practice coding."
                enabled={settings.dailyReminder}
                onClick={() =>
                  updateSetting(
                    "dailyReminder",
                    !settings.dailyReminder
                  )
                }
                last
              />

            </div>

          </section>


          {/* ================= CODE EDITOR ================= */}

          <section className="mb-8">

            <h2 className="mb-4 text-xl font-bold">
              Code Editor
            </h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

              <SettingToggle
                title="Auto Save"
                description="Automatically save your code while working."
                enabled={settings.autoSave}
                onClick={() =>
                  updateSetting(
                    "autoSave",
                    !settings.autoSave
                  )
                }
              />

              <SettingToggle
                title="Word Wrap"
                description="Wrap long lines inside the code editor."
                enabled={settings.wordWrap}
                onClick={() =>
                  updateSetting(
                    "wordWrap",
                    !settings.wordWrap
                  )
                }
              />

              {/* Font Size */}

              <div className="flex items-center justify-between gap-5 p-5">

                <div>

                  <h3 className="font-semibold">
                    Editor Font Size
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the font size for the code editor.
                  </p>

                </div>

                <select
                  value={settings.fontSize}
                  onChange={(e) =>
                    updateSetting(
                      "fontSize",
                      Number(e.target.value)
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
                >
                  <option value={10}>10px</option>
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                  <option value={20}>20px</option>
                  <option value={22}>22px</option>
                  <option value={24}>24px</option>
                </select>

              </div>

            </div>

          </section>


          {/* ================= APPEARANCE ================= */}

          <section className="mb-8">

            <h2 className="mb-4 text-xl font-bold">
              Appearance
            </h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Theme
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    CodingBhai uses dark mode for the coding experience.
                  </p>

                </div>

                <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
                  🌙 Dark
                </div>

              </div>

            </div>

          </section>


          {/* ================= SECURITY ================= */}

          <section className="mb-8">

            <h2 className="mb-4 text-xl font-bold">
              Security
            </h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

              <button
                 onClick={() => {
    setShowPasswordModal(true);
    setPasswordError("");
    setPasswordSuccess("");
  }}
                className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-800/50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
                    🔐
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Change Password
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Update your account password securely.
                    </p>

                  </div>

                </div>

                <span className="text-slate-500">
                  →
                </span>

              </button>

            </div>

          </section>


          {/* ================= LOGOUT ================= */}

          <section className="mb-8">

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-left transition hover:bg-red-500/10"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-xl">
                  🚪
                </div>

                <div>

                  <h3 className="font-semibold text-red-400">
                    Logout
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Sign out from your CodingBhai account.
                  </p>

                </div>

              </div>

              <span className="text-red-400">
                →
              </span>

            </button>

          </section>


          {/* ================= DANGER ZONE ================= */}

          <section>

            <h2 className="mb-4 text-xl font-bold text-red-400">
              Danger Zone
            </h2>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h3 className="font-semibold">
                    Delete Account
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Permanently delete your CodingBhai account.
                  </p>

                </div>

                <button
                  onClick={() =>
                    alert(
                      "Account deletion will be implemented with confirmation and secure cleanup."
                    )
                  }
                  className="rounded-xl border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  Delete Account
                </button>

              </div>

            </div>

          </section>

        </div>

           </main>

      {/* ================= CHANGE PASSWORD MODAL ================= */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            {/* Header */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-white">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your CodingBhai account password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleChangePassword}
              className="space-y-4"
            >

              {/* Current Password */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>


              {/* New Password */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>


              {/* Confirm Password */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>


              {/* Error */}

              {passwordError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {passwordError}
                </div>
              )}


              {/* Success */}

              {passwordSuccess && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {passwordSuccess}
                </div>
              )}


              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passwordLoading
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}


// ================= TOGGLE COMPONENT =================

function SettingToggle({
  title,
  description,
  enabled,
  onClick,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-5 p-5 ${
        !last ? "border-b border-slate-800" : ""
      }`}
    >

      <div>

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

      <button
        onClick={onClick}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-cyan-500"
            : "bg-slate-700"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>
      

    </div>
  );
}

export default Settings;