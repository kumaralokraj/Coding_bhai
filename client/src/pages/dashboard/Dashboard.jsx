import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import MobileSidebar from "../../components/layout/MobileSidebar";

import { getDashboard } from "../../services/dashboard";

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DASHBOARD =================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();

        console.log("Dashboard Data:", data);

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

          <p className="text-cyan-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <p className="text-red-400">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-cyan-500 px-5 py-2 font-medium text-slate-950"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ================= DATA =================

  const {
    user,
    stats,
    progress,
    recentProblems = [],
  } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}

      <Sidebar />

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Header */}

      <header className="flex h-16 items-center justify-between border-b border-slate-800 px-5 lg:hidden">

        <h1 className="text-xl font-bold">
          Coding<span className="text-cyan-400">Bhai</span>
        </h1>

        <button
          onClick={() =>
            setIsMobileMenuOpen(true)
          }
          className="rounded-lg border border-slate-700 px-3 py-2 text-xl"
        >
          ☰
        </button>

      </header>

      {/* Main */}

      <main className="px-4 py-8 lg:ml-64">

        <div className="mx-auto max-w-6xl">

          {/* ================= WELCOME ================= */}

          <div className="mb-8">

            <p className="mb-2 text-sm text-cyan-400">
              Welcome back, {user?.name || "Coder"} 👋
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Your Coding Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Track your progress, solve problems
              and become a better developer.
            </p>

          </div>

          {/* ================= STATS ================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Problems Solved */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Problems Solved
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {stats?.problemsSolved ?? 0}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Problems completed
              </p>

            </div>

            {/* Streak */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Current Streak
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {stats?.currentStreak ?? 0} 🔥
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Keep your streak alive
              </p>

            </div>

            {/* Coding Score */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Coding Score
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {stats?.codingScore ?? 0}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Your current coding score
              </p>

            </div>

            {/* Rank */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Global Rank
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {stats?.globalRank
                  ? `#${stats.globalRank}`
                  : "—"}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Keep solving to improve
              </p>

            </div>

          </div>

          {/* ================= LEARNING PROGRESS ================= */}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Learning Progress
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Track your progress across different
                technologies.
              </p>

            </div>

            <div className="space-y-6">

              {/* DSA */}

              <ProgressBar
                name="DSA"
                value={progress?.dsa ?? 0}
              />

              {/* JavaScript */}

              <ProgressBar
                name="JavaScript"
                value={progress?.javascript ?? 0}
              />

              {/* React */}

              <ProgressBar
                name="React"
                value={progress?.react ?? 0}
              />

              {/* Backend */}

              <ProgressBar
                name="Backend"
                value={progress?.backend ?? 0}
              />

            </div>

          </div>

          {/* ================= RECENT PROBLEMS ================= */}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* Recent Problems */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    Recent Problems
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Your recently attempted problems.
                  </p>

                </div>

                <a
                  href="/problems"
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All
                </a>

              </div>

              {/* Problems */}

              {recentProblems.length === 0 ? (

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center">

                  <p className="text-slate-400">
                    No problems attempted yet.
                  </p>

                  <a
                    href="/problems"
                    className="mt-3 inline-block text-sm text-cyan-400"
                  >
                    Start solving →
                  </a>

                </div>

              ) : (

                <div className="space-y-3">

                  {recentProblems.map((problem) => (

                    <div
                      key={problem.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >

                      <div>

                        <h3 className="font-medium text-white">
                          {problem.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {problem.topic || "DSA"} •{" "}
                          {problem.difficulty}
                        </p>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          problem.status === "Solved"
                            ? "bg-green-500/10 text-green-400"
                            : problem.status === "In Progress"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {problem.status || "Not Started"}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-bold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Start something new.
              </p>

              <div className="mt-6 space-y-3">

                <a
                  href="/problems"
                  className="block w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  💻 Start Coding
                </a>

                <a
                  href="/problems"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-medium text-white transition hover:border-cyan-500"
                >
                  🧠 Solve Problems
                </a>

                <a
                  href="/interview"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-medium text-white transition hover:border-cyan-500"
                >
                  🎯 Start Interview
                </a>

                <a
                  href="/learn"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-medium text-white transition hover:border-cyan-500"
                >
                  📚 Continue Learning
                </a>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


// ================= PROGRESS BAR =================

function ProgressBar({ name, value }) {

  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-300">
          {name}
        </span>

        <span className="text-sm text-cyan-400">
          {safeValue}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}


export default Dashboard;