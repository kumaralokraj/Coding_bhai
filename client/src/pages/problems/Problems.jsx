import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../../services/problemService";

const difficultyOptions = ["All", "Easy", "Medium", "Hard"];

function Problems() {
  const [problems, setProblems] = useState([]);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH PROBLEMS =================

  useEffect(() => {
    fetchProblems();
  }, [page, difficulty]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProblems({
        page,
        limit: 20,
        difficulty: difficulty === "All" ? "" : difficulty,
        search,
      });

      console.log("Problems API:", data);

      setProblems(data.problems || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Problems Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load problems"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  // ================= RESET =================

  const handleReset = () => {
    setSearch("");
    setDifficulty("All");
    setPage(1);
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-slate-400">
            Loading problems...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">

            <h2 className="text-xl font-bold text-red-400">
              Failed to load problems
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>

            <button
              onClick={fetchProblems}
              className="mt-6 rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ================= STATS =================

  const totalProblems = pagination?.total || 0;

  const solvedProblems = problems.filter(
    (problem) => problem.solved
  ).length;

  const easyProblems = problems.filter(
    (problem) => problem.difficulty === "Easy"
  ).length;

  const mediumProblems = problems.filter(
    (problem) => problem.difficulty === "Medium"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-800">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <h1 className="text-3xl font-bold">
            Coding Problems
          </h1>

          <p className="mt-2 text-slate-400">
            Practice DSA problems, improve your skills and prepare
            for interviews.
          </p>

        </div>

      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* ================= STATS ================= */}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">

          <StatCard
            title="Total Problems"
            value={totalProblems}
          />

          <StatCard
            title="Solved"
            value={solvedProblems}
          />

          <StatCard
            title="Easy"
            value={easyProblems}
          />

          <StatCard
            title="Medium"
            value={mediumProblems}
          />

        </div>

        {/* ================= FILTERS ================= */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-4 lg:flex-row"
          >

            {/* Search */}

            <div className="flex-1">

              <input
                type="text"
                placeholder="Search problems or topics..."
                value={search}
                onChange={handleSearch}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />

            </div>

            {/* Difficulty */}

            <div className="flex flex-wrap gap-2">

              {difficultyOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => {
                    setDifficulty(option);
                    setPage(1);
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    difficulty === option
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}

            </div>

            {/* Search Button */}

            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Search
            </button>

            {/* Reset */}

            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
            >
              Reset
            </button>

          </form>

        </div>

        {/* ================= RESULTS INFO ================= */}

        <div className="mb-4 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="text-slate-300">
              {problems.length}
            </span>{" "}
            problems
          </p>

          {pagination && (
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="text-slate-300">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="text-slate-300">
                {pagination.totalPages}
              </span>
            </p>
          )}

        </div>

        {/* ================= PROBLEMS TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          {/* Table Header */}

          <div className="hidden grid-cols-12 border-b border-slate-800 px-6 py-4 text-sm font-medium text-slate-500 md:grid">

            <div className="col-span-1">
              #
            </div>

            <div className="col-span-4">
              Problem
            </div>

            <div className="col-span-2">
              Difficulty
            </div>

            <div className="col-span-3">
              Topics
            </div>

            <div className="col-span-2">
              Status
            </div>

          </div>

          {/* Rows */}

          {problems.length > 0 ? (
            problems.map((problem, index) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                index={
                  (pagination?.page - 1 || 0) *
                    (pagination?.limit || 20) +
                  index +
                  1
                }
              />
            ))
          ) : (
            <div className="px-6 py-16 text-center">

              <div className="text-4xl">
                🔍
              </div>

              <p className="mt-4 text-lg text-slate-400">
                No problems found
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Try another search or difficulty.
              </p>

              <button
                onClick={handleReset}
                className="mt-5 rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950"
              >
                Clear Filters
              </button>

            </div>
          )}

        </div>

        {/* ================= PAGINATION ================= */}

        {pagination &&
          pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">

              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <div className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm text-slate-300">
                {pagination.page} /{" "}
                {pagination.totalPages}
              </div>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>

            </div>
          )}

      </main>
    </div>
  );
}


// =====================================================
// PROBLEM ROW
// =====================================================

function ProblemRow({ problem, index }) {
  const topics =
    problem.tags ||
    problem.topics ||
    [];

  return (
    <Link
      to={`/problems/${problem.id}`}
      className="grid grid-cols-1 gap-3 border-b border-slate-800 px-6 py-5 transition last:border-0 hover:bg-slate-800/50 md:grid-cols-12 md:items-center"
    >

      {/* Number */}

      <div className="hidden text-sm text-slate-500 md:col-span-1 md:block">
        {index}
      </div>

      {/* Problem */}

      <div className="md:col-span-4">

        <h3 className="font-medium text-white">
          {problem.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
          {problem.description}
        </p>

        {/* Mobile Topics */}

        <div className="mt-2 flex flex-wrap gap-2 md:hidden">

          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400"
            >
              {topic}
            </span>
          ))}

        </div>

      </div>

      {/* Difficulty */}

      <div className="md:col-span-2">

        <DifficultyBadge
          difficulty={problem.difficulty}
        />

      </div>

      {/* Topics */}

      <div className="hidden gap-2 md:col-span-3 md:flex md:flex-wrap">

        {topics.map((topic) => (
          <span
            key={topic}
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400"
          >
            {topic}
          </span>
        ))}

      </div>

      {/* Status */}

      <div className="md:col-span-2">

        {problem.solved ? (
          <span className="text-sm font-medium text-emerald-400">
            ✓ Solved
          </span>
        ) : (
          <span className="text-sm text-slate-500">
            Unsolved
          </span>
        )}

      </div>

    </Link>
  );
}


// =====================================================
// DIFFICULTY BADGE
// =====================================================

function DifficultyBadge({ difficulty }) {
  const classes = {
    Easy: "bg-emerald-500/10 text-emerald-400",
    Medium: "bg-yellow-500/10 text-yellow-400",
    Hard: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-block rounded-md px-3 py-1 text-xs font-medium ${
        classes[difficulty] ||
        "bg-slate-800 text-slate-400"
      }`}
    >
      {difficulty}
    </span>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}

export default Problems;