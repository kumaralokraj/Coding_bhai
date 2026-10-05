import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProblemById } from "../../services/problemService";
import { runCode } from "../../services/code";

function ProblemSolve() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(`function solution() {
  // Write your solution here
}
`);

  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState("normal");

  // ================= FETCH PROBLEM =================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProblemById(id);

        console.log("Problem response:", response);

        const problemData = response?.problem || response?.data?.problem;

        if (!problemData) {
          throw new Error("Problem not found");
        }

        setProblem(problemData);
      } catch (err) {
        console.error("Problem fetch error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load problem"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  // ================= LANGUAGE CHANGE =================

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);

    // Default starter code
    const starterCode = {
      javascript: `function solution() {
  // Write your solution here
}
`,

      python: `def solution():
    # Write your solution here
    pass
`,

      java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}
`,

      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}
`,
    };

    setCode(starterCode[selectedLanguage]);
    setOutput("");
  };

  // ================= RUN CODE =================

  const handleRun = async () => {
  try {
    setOutput("Submitting code...");

    const response = await runCode({
      language,
      code,
    });

    setOutput(
      `Code submitted successfully.\nJob ID: ${response.jobId}`
    );

  } catch (error) {
    console.error("Run Code Error:", error);

    setOutput(
      error.response?.data?.message ||
      "Failed to run code"
    );
  }
};

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="text-cyan-400">
            Loading problem...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error || !problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <div className="mb-4 text-4xl">
            ⚠️
          </div>

          <h2 className="text-xl font-bold">
            Problem Not Found
          </h2>

          <p className="mt-3 text-sm text-red-400">
            {error || "Unable to load this problem."}
          </p>

          <Link
            to="/problems"
            className="mt-6 inline-block rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  // ================= TAGS =================

  let tags = problem.tags || [];

  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= TOP BAR ================= */}

      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="flex h-16 items-center justify-between px-5">

          {/* Left */}

          <div className="flex min-w-0 items-center gap-4">

            <Link
              to={`/problems/${id}`}
              className="shrink-0 text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← Problem
            </Link>

            <div className="hidden h-6 w-px bg-slate-800 sm:block" />

            <h1 className="truncate text-lg font-bold">
              {problem.title}
            </h1>

          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            <select
              value={language}
              onChange={handleLanguageChange}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="javascript">
                JavaScript
              </option>

              <option value="python">
                Python
              </option>

              <option value="java">
                Java
              </option>

              <option value="cpp">
                C++
              </option>
            </select>

            <button
              onClick={handleRun}
              disabled={running}
              className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? "Running..." : "▶ Run"}
            </button>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">

        {/* ================= PROBLEM PANEL ================= */}

        <section className="overflow-y-auto border-b border-slate-800 lg:border-b-0 lg:border-r">

          <div className="p-6 lg:p-8">

            {/* Title */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold">
                  {problem.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Problem #{problem.id}
                </p>

              </div>

              {/* Difficulty */}

              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {problem.difficulty}
              </span>

            </div>

            {/* Description */}

            <div className="mt-8">

              <h3 className="text-lg font-semibold">
                Description
              </h3>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                {problem.description}
              </p>

            </div>

            {/* Category */}

            {problem.category && (
              <div className="mt-8">

                <h3 className="text-sm font-semibold text-slate-300">
                  Category
                </h3>

                <span className="mt-3 inline-block rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                  {problem.category}
                </span>

              </div>
            )}

            {/* Tags */}

            {tags.length > 0 && (
              <div className="mt-8">

                <h3 className="text-sm font-semibold text-slate-300">
                  Topics
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Companies */}

            {problem.companies?.length > 0 && (
              <div className="mt-8">

                <h3 className="text-sm font-semibold text-slate-300">
                  Asked By
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {problem.companies.map((company, index) => (
                    <span
                      key={`${company}-${index}`}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400"
                    >
                      {company}
                    </span>
                  ))}

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ================= EDITOR PANEL ================= */}

        <section className="flex min-h-[600px] flex-col bg-[#0b1120]">

          {/* Editor Header */}

          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">

            <div className="flex items-center gap-3">

              <span className="text-xs uppercase tracking-wider text-slate-500">
                Editor
              </span>

              <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                {language}
              </span>

            </div>

            <button
              onClick={() => setCode("")}
              className="text-xs text-slate-500 transition hover:text-red-400"
            >
              Clear
            </button>

          </div>

          {/* Code Editor */}

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="min-h-[450px] flex-1 resize-none bg-[#0b1120] p-5 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700"
            placeholder="Write your code here..."
          />

          {/* Output */}

          <div className="min-h-[180px] border-t border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">

              <h3 className="text-sm font-semibold">
                Output
              </h3>

              {output && (
                <button
                  onClick={() => setOutput("")}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Clear
                </button>
              )}

            </div>

            <div className="min-h-[120px] overflow-auto p-5">

              {running ? (

                <div className="flex items-center gap-3 text-sm text-cyan-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
                  Executing your code...
                </div>

              ) : output ? (

                <pre
                  className={`whitespace-pre-wrap text-sm ${
                    outputType === "error"
                      ? "text-red-400"
                      : outputType === "success"
                      ? "text-green-400"
                      : "text-slate-300"
                  }`}
                >
                  {output}
                </pre>

              ) : (

                <p className="text-sm text-slate-600">
                  Run your code to see output.
                </p>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProblemSolve;