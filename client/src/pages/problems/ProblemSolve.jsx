import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const problems = {
  1: {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",

    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
    },
  },

  2: {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",

    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    // Write your solution here
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
      python: `def isValid(s):
    # Write your solution here
    pass`,
    },
  },
};

const languages = {
  javascript: {
    label: "JavaScript",
    monaco: "javascript",
  },
  cpp: {
    label: "C++",
    monaco: "cpp",
  },
  java: {
    label: "Java",
    monaco: "java",
  },
  python: {
    label: "Python",
    monaco: "python",
  },
};

function ProblemSolve() {
  const { id } = useParams();

  const problem = problems[id];

  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(
    problem?.starterCode?.javascript || ""
  );

  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");

  const [status, setStatus] = useState("idle");

  const [isRunning, setIsRunning] = useState(false);

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Problem Not Found
          </h1>

          <Link
            to="/problems"
            className="mt-4 inline-block text-cyan-400"
          >
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);

    setCode(
      problem.starterCode[newLanguage]
    );

    setOutput("");
    setStatus("idle");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setStatus("running");
    setOutput("");

    /*
      Abhi real Docker execution nahi hai.

      Backend execution API banne ke baad:
      
      await api.post("/execute", {
        language,
        code,
        input
      });
    */

    setTimeout(() => {
      setOutput(
        "Code execution engine will run your code here."
      );

      setStatus("success");
      setIsRunning(false);
    }, 800);
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setStatus("submitting");
    setOutput("");

    /*
      Future API:

      await api.post("/submissions", {
        problemId: id,
        language,
        code
      });
    */

    setTimeout(() => {
      setOutput(
        "Submission sent to CodingBhai Judge."
      );

      setStatus("success");
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">

      {/* TOP BAR */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-5">

        <div className="flex items-center gap-4">

          <Link
            to={`/problems/${id}`}
            className="text-slate-400 hover:text-white"
          >
            ←
          </Link>

          <div>
            <h1 className="font-semibold">
              {problem.title}
            </h1>

            <span className="text-xs text-emerald-400">
              {problem.difficulty}
            </span>
          </div>

        </div>

        <div className="flex items-center gap-3">

          {/* Language */}
          <select
            value={language}
            onChange={(e) =>
              handleLanguageChange(e.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-cyan-500"
          >
            {Object.entries(languages).map(
              ([key, value]) => (
                <option
                  key={key}
                  value={key}
                >
                  {value.label}
                </option>
              )
            )}
          </select>

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ▶ Run
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isRunning}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit
          </button>

        </div>

      </header>

      {/* MAIN */}
      <main className="flex min-h-0 flex-1">

        {/* PROBLEM PANEL */}
        <section className="w-[38%] min-w-[320px] overflow-y-auto border-r border-slate-800 bg-slate-950">

          <div className="p-6">

            <h2 className="mb-5 text-xl font-bold">
              {problem.title}
            </h2>

            <p className="leading-7 text-slate-300">
              {problem.description}
            </p>

            {/* Example */}
            <div className="mt-8">

              <h3 className="mb-3 font-semibold">
                Example
              </h3>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                <p className="text-sm text-slate-400">
                  Input
                </p>

                <pre className="mt-2 text-cyan-300">
                  nums = [2,7,11,15]
                  {"\n"}
                  target = 9
                </pre>

                <p className="mt-4 text-sm text-slate-400">
                  Output
                </p>

                <pre className="mt-2 text-emerald-400">
                  [0,1]
                </pre>

              </div>

            </div>

            {/* Constraints */}
            <div className="mt-8">

              <h3 className="mb-3 font-semibold">
                Constraints
              </h3>

              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 2 ≤ nums.length ≤ 10⁴</li>
                <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>• -10⁹ ≤ target ≤ 10⁹</li>
                <li>• Only one valid answer exists.</li>
              </ul>

            </div>

          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* EDITOR */}
          <div className="min-h-0 flex-1">

            <Editor
              height="100%"
              language={languages[language].monaco}
              value={code}
              onChange={(value) =>
                setCode(value || "")
              }
              theme="vs-dark"
              options={{
                fontSize: 15,
                minimap: {
                  enabled: false,
                },
                automaticLayout: true,
                padding: {
                  top: 15,
                },
                scrollBeyondLastLine: false,
              }}
            />

          </div>

          {/* INPUT / OUTPUT */}
          <div className="h-[260px] border-t border-slate-800 bg-slate-900">

            <div className="flex h-full">

              {/* INPUT */}
              <div className="w-1/2 border-r border-slate-800">

                <div className="border-b border-slate-800 px-4 py-3">
                  <span className="text-sm font-medium">
                    Custom Input
                  </span>
                </div>

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  placeholder="Enter your input..."
                  className="h-[210px] w-full resize-none bg-slate-900 p-4 font-mono text-sm text-slate-300 outline-none placeholder:text-slate-600"
                />

              </div>

              {/* OUTPUT */}
              <div className="w-1/2">

                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">

                  <span className="text-sm font-medium">
                    Output
                  </span>

                  {status === "success" && (
                    <span className="text-xs text-emerald-400">
                      ✓ Success
                    </span>
                  )}

                  {status === "running" && (
                    <span className="text-xs text-yellow-400">
                      Running...
                    </span>
                  )}

                  {status === "submitting" && (
                    <span className="text-xs text-yellow-400">
                      Submitting...
                    </span>
                  )}

                </div>

                <pre className="h-[210px] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm text-slate-300">
                  {output || "Run your code to see output..."}
                </pre>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProblemSolve;