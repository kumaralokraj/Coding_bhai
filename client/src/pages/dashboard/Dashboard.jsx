import { useState,useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

import api from "../../services/api";
function Dashboard() {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
    
   useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);
if (loading) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p className="text-cyan-400">Loading dashboard...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );
}
  const { user, stats, progress } = dashboardData;
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <header className="flex h-16 items-center justify-between border-b border-slate-800 px-5 lg:hidden">
        <h1 className="text-xl font-bold">
          Coding<span className="text-cyan-400">Bhai</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-xl"
        >
          ☰
        </button>
      </header>

      <main className="px-4 py-8 lg:ml-64">
        <div className="mx-auto max-w-6xl">
         {/* Welcome */}
<div className="mb-8">
  <p className="mb-2 text-sm text-cyan-400">
    Welcome back, {user.name} 👋 👋
  </p>

  <h1 className="text-3xl font-bold sm:text-4xl">
    Your Coding Dashboard
  </h1>

  <p className="mt-2 text-slate-400">
    Track your progress, solve problems and become a better developer.
  </p>
</div>

{/* Stats */}
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">Problems Solved</p>
    <h2 className="mt-3 text-3xl font-bold">0</h2>
    <p className="mt-2 text-xs text-slate-500">
      Start solving problems
    </p>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">Current Streak</p>
    <h2 className="mt-3 text-3xl font-bold">0 🔥</h2>
    <p className="mt-2 text-xs text-slate-500">
      Keep your streak alive
    </p>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">Coding Score</p>
    <h2 className="mt-3 text-3xl font-bold">0</h2>
    <p className="mt-2 text-xs text-slate-500">
      Solve problems to increase
    </p>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">Global Rank</p>
    <h2 className="mt-3 text-3xl font-bold">—</h2>
    <p className="mt-2 text-xs text-slate-500">
      Start competing
    </p>
  </div>

</div>
        </div>
        {/* Learning Progress */}
<div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

  <div className="mb-6">
    <h2 className="text-xl font-bold text-white">
      Learning Progress
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Track your progress across different technologies.
    </p>
  </div>

  <div className="space-y-6">

    {/* DSA */}
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          DSA
        </span>

        <span className="text-sm text-cyan-400">
          70%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
    {/* Recent Problems + Quick Actions */}
<div className="mt-8 grid gap-6 lg:grid-cols-3">

  {/* Recent Problems */}
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white">
          Recent Problems
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Continue where you left off.
        </p>
      </div>

      <button className="text-sm text-cyan-400 hover:text-cyan-300">
        View All
      </button>
    </div>

    <div className="space-y-3">

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div>
          <h3 className="font-medium text-white">
            Two Sum
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Arrays • Easy
          </p>
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Solved
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div>
          <h3 className="font-medium text-white">
            Reverse Linked List
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Linked List • Easy
          </p>
        </div>

        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
          In Progress
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div>
          <h3 className="font-medium text-white">
            Valid Parentheses
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Stack • Easy
          </p>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
          Not Started
        </span>
      </div>

    </div>
  </div>


  {/* Quick Actions */}
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

    <h2 className="text-xl font-bold text-white">
      Quick Actions
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Start something new.
    </p>

    <div className="mt-6 space-y-3">

      <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-left font-medium text-slate-950 transition hover:bg-cyan-400">
        💻 Start Coding
      </button>

      <button className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left font-medium text-white transition hover:border-cyan-500">
        🧠 Solve Problems
      </button>

      <button className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left font-medium text-white transition hover:border-cyan-500">
        🤖 Ask AI Mentor
      </button>

      <button className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left font-medium text-white transition hover:border-cyan-500">
        🎯 Start Interview
      </button>

    </div>
  </div>

</div>

    {/* JavaScript */}
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          JavaScript
        </span>

        <span className="text-sm text-cyan-400">
          90%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: "90%" }}
        ></div>
      </div>
    </div>

    {/* React */}
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          React
        </span>

        <span className="text-sm text-cyan-400">
          60%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: "60%" }}
        ></div>
      </div>
    </div>

    {/* Backend */}
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          Backend
        </span>

        <span className="text-sm text-cyan-400">
          40%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: "40%" }}
        ></div>
      </div>
    </div>

  </div>
</div>
      </main>
    </div>
  );
}

export default Dashboard;
