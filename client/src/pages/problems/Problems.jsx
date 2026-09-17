import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const problemsData = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Map"],
    solved: true,
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    solved: false,
  },
  {
    id: 3,
    title: "Binary Search",
    difficulty: "Easy",
    topics: ["Array", "Binary Search"],
    solved: false,
  },
  {
    id: 4,
    title: "Group Anagrams",
    difficulty: "Medium",
    topics: ["Array", "Hash Map", "String"],
    solved: true,
  },
  {
    id: 5,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["String", "Sliding Window"],
    solved: false,
  },
  {
    id: 6,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    topics: ["Linked List", "Heap"],
    solved: false,
  },
];

const difficultyOptions = ["All", "Easy", "Medium", "Hard"];

function Problems() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const filteredProblems = useMemo(() => {
    return problemsData.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.topics.some((topic) =>
          topic.toLowerCase().includes(search.toLowerCase())
        );

      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Header */}
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

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">

          <StatCard
            title="Total Problems"
            value={problemsData.length}
          />

          <StatCard
            title="Solved"
            value={problemsData.filter((p) => p.solved).length}
          />

          <StatCard
            title="Easy"
            value={
              problemsData.filter(
                (p) => p.difficulty === "Easy"
              ).length
            }
          />

          <StatCard
            title="Medium"
            value={
              problemsData.filter(
                (p) => p.difficulty === "Medium"
              ).length
            }
          />

        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">

          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search problems or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
          </div>

          {/* Difficulty */}
          <div className="flex gap-2">
            {difficultyOptions.map((option) => (
              <button
                key={option}
                onClick={() => setDifficulty(option)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  difficulty === option
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

        </div>

        {/* Problems */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          {/* Table Header */}
          <div className="hidden grid-cols-12 border-b border-slate-800 px-6 py-4 text-sm font-medium text-slate-500 md:grid">

            <div className="col-span-1">
              #
            </div>

            <div className="col-span-5">
              Problem
            </div>

            <div className="col-span-2">
              Difficulty
            </div>

            <div className="col-span-3">
              Topics
            </div>

            <div className="col-span-1">
              Status
            </div>

          </div>

          {/* Rows */}
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                index={index}
              />
            ))
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="text-lg text-slate-400">
                No problems found
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Try another search or difficulty.
              </p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

function ProblemRow({ problem, index }) {
  return (
    <Link
      to={`/problems/${problem.id}`}
      className="grid grid-cols-1 gap-3 border-b border-slate-800 px-6 py-5 transition hover:bg-slate-800/50 md:grid-cols-12 md:items-center"
    >
      
      {/* Number */}
      <div className="hidden text-sm text-slate-500 md:col-span-1 md:block">
        {index + 1}
      </div>

      {/* Problem */}
      <div className="md:col-span-5">
        <h3 className="font-medium text-white">
          {problem.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-2 md:hidden">
          {problem.topics.map((topic) => (
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
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* Topics */}
      <div className="hidden gap-2 md:col-span-3 md:flex md:flex-wrap">
        {problem.topics.map((topic) => (
          <span
            key={topic}
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Status */}
      <div className="md:col-span-1">
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

function DifficultyBadge({ difficulty }) {
  const classes = {
    Easy: "bg-emerald-500/10 text-emerald-400",
    Medium: "bg-yellow-500/10 text-yellow-400",
    Hard: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-block rounded-md px-3 py-1 text-xs font-medium ${classes[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

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