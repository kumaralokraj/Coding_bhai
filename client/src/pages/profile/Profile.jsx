import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";
import api from "../../services/api";

function Profile() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);

  // ================= FETCH PROFILE =================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your profile.");
          setLoading(false);
          return;
        }

        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Profile Error:", error);

        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= OPEN EDITOR =================

  const handleEditProfile = () => {
    setEditForm({
      name: profile.user.name,
      email: profile.user.email,
    });

    setIsEditing(true);
  };

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE PROFILE =================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.email) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/profile",
        {
          name: editForm.name,
          email: editForm.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update UI
      setProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: response.data.user.name,
          email: response.data.user.email,
        },
      }));

      // Update localStorage user
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsEditing(false);

      alert("Profile updated successfully 🎉");
    } catch (error) {
      console.error("Update Profile Error:", error);

      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-cyan-400">Loading profile...</p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="mb-4 text-red-400">{error}</p>

          <Link
            to="/login"
            className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const { user, stats, progress } = profile;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MOBILE SIDEBAR ================= */}

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* ================= MOBILE HEADER ================= */}

      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 px-5 backdrop-blur lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xl"
        >
          ☰
        </button>

        <Link to="/" className="ml-3 text-xl font-bold">
          Coding<span className="text-cyan-400">Bhai</span>
        </Link>
      </header>

      {/* ================= MAIN ================= */}

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
          {/* ================= PAGE HEADER ================= */}

          <div className="mb-8">
            <p className="text-sm text-cyan-400">CodingBhai</p>

            <h1 className="mt-1 text-3xl font-bold">My Profile</h1>

            <p className="mt-2 text-slate-400">
              Track your coding journey and progress.
            </p>
          </div>

          {/* ================= PROFILE CARD ================= */}

          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="h-28 bg-gradient-to-y from-cyan-500/20 via-blue-500/10 to-transparent" />

            <div className="px-6 pb-6">
              <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                {/* USER INFO */}

                <div className="flex items-end gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-900 bg-cyan-500 text-3xl font-bold text-slate-950">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="pb-1">
                    <h2 className="text-2xl font-bold">{user.name}</h2>

                    <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>

                {/* EDIT BUTTON */}

                <button
                  onClick={handleEditProfile}
                  className="
                    rounded-xl
                    border border-slate-700
                    px-5 py-2.5
                    text-sm font-medium
                    text-slate-300
                    transition
                    hover:border-cyan-500
                    hover:text-cyan-400
                  "
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* ================= STATS ================= */}

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Coding Stats</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Problems Solved"
                value={stats.problemsSolved}
                description="Keep solving 🚀"
              />

              <StatCard
                title="Current Streak"
                value={stats.currentStreak}
                description="Days 🔥"
              />

              <StatCard
                title="Coding Score"
                value={stats.codingScore}
                description="Overall score"
              />

              <StatCard
                title="Global Rank"
                value={stats.globalRank ? `#${stats.globalRank}` : "N/A"}
                description="Worldwide"
              />
            </div>
          </section>

          {/* ================= PROGRESS ================= */}

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Learning Progress</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <ProgressCard
                title="Data Structures & Algorithms"
                value={progress.dsa}
              />

              <ProgressCard title="JavaScript" value={progress.javascript} />

              <ProgressCard title="React" value={progress.react} />

              <ProgressCard
                title="Backend Development"
                value={progress.backend}
              />
            </div>
          </section>

          {/* ================= ACCOUNT ================= */}

          <section>
            <h2 className="mb-4 text-xl font-bold">Account Information</h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 p-5">
                <p className="text-sm text-slate-500">Full Name</p>

                <p className="mt-1 font-medium">{user.name}</p>
              </div>

              <div className="p-5">
                <p className="text-sm text-slate-500">Email Address</p>

                <p className="mt-1 font-medium">{user.email}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================================================= */}
      {/*                 EDIT PROFILE MODAL                */}
      {/* ================================================= */}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Edit Profile</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Update your account information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="
                    w-full
                    rounded-xl
                    border border-slate-700
                    bg-slate-950
                    px-4 py-3
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-cyan-500
                  "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-xl
                    border border-slate-700
                    bg-slate-950
                    px-4 py-3
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-cyan-500
                  "
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="
                    flex-1
                    rounded-xl
                    border border-slate-700
                    py-3
                    text-sm font-semibold
                    text-slate-300
                    transition
                    hover:bg-slate-800
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex-1
                    rounded-xl
                    bg-cyan-500
                    py-3
                    text-sm font-semibold
                    text-slate-950
                    transition
                    hover:bg-cyan-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/*                    STAT CARD                      */
/* ================================================= */

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-2 text-3xl font-bold text-cyan-400">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

/* ================================================= */
/*                 PROGRESS CARD                     */
/* ================================================= */

function ProgressCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-white">{title}</h3>

        <span className="text-sm font-semibold text-cyan-400">{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

export default Profile;
