
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play, Download, Copy, Save,
  RotateCcw, Code2, Terminal,
} from "lucide-react";

import {
  fetchLanguages,
  submitCode,
  waitForResult,
} from "../../services/ideService";

const starterCode = {
  python: 'print("Hello, CodingBhai!")',
  javascript: 'console.log("Hello, CodingBhai!");',
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CodingBhai!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, CodingBhai!\\n");
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodingBhai!");
    }
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, CodingBhai!")
}`,
  rust: `fn main() {
    println!("Hello, CodingBhai!");
}`,
};

function detectLanguage(name) {
  const value = name.toLowerCase();

  if (value.includes("typescript")) return "typescript";
  if (value.includes("javascript")) return "javascript";
  if (value.includes("python")) return "python";
  if (value.includes("c++")) return "cpp";
  if (/^c\s*\(/i.test(name) || value === "c") return "c";
  if (value.includes("c#")) return "csharp";
  if (value.includes("java")) return "java";
  if (value.includes("golang") || value.startsWith("go ("))
    return "go";
  if (value.includes("rust")) return "rust";
  if (value.includes("php")) return "php";
  if (value.includes("ruby")) return "ruby";
  if (value.includes("kotlin")) return "kotlin";
  if (value.includes("swift")) return "swift";
  if (value.includes("sql")) return "sql";
  if (value.includes("bash")) return "shell";
  if (value.includes("r (")) return "r";

  return "plaintext";
}

const extensionMap = {
  python: "py",
  javascript: "js",
  typescript: "ts",
  cpp: "cpp",
  c: "c",
  csharp: "cs",
  java: "java",
  go: "go",
  rust: "rs",
  php: "php",
  ruby: "rb",
  kotlin: "kt",
  swift: "swift",
  sql: "sql",
  shell: "sh",
};

export default function OnlineIDE() {
  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState("");
  const [codes, setCodes] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("codingbhai_ide_codes_v2") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [theme, setTheme] = useState("dark");

  const selectedLanguage = languages.find(
    (item) => String(item.id) === languageId
  );

  const editorLanguage = detectLanguage(
    selectedLanguage?.name || ""
  );

  const code =
    codes[languageId] ??
    starterCode[editorLanguage] ??
    `// Start coding in ${selectedLanguage?.name || "your language"}`;

  useEffect(() => {
    document.title = "Online IDE | CodingBhai";

    let active = true;

    async function loadLanguages() {
      try {
        const list = await fetchLanguages();

        if (!active) return;

        setLanguages(list);

        const preferred =
          list.find((lang) =>
            lang.name.toLowerCase().includes("python")
          ) || list[0];

        if (preferred) {
          setLanguageId(String(preferred.id));
        }
      } catch (error) {
        if (active) {
          setOutput(
            error.response?.data?.message ||
            "Could not load programming languages."
          );
        }
      } finally {
        if (active) setLoadingLanguages(false);
      }
    }

    loadLanguages();

    return () => {
      active = false;
    };
  }, []);

  const updateCode = (value) => {
    setCodes((previous) => ({
      ...previous,
      [languageId]: value,
    }));
  };

  const handleRun = async () => {
    if (running || !languageId) return;

    if (!code.trim()) {
      setOutput("Please write code first.");
      return;
    }

    setRunning(true);
    setOutput("");
    setStatus("Submitting");

    try {
      const token = await submitCode({
        languageId: Number(languageId),
        sourceCode: code,
        stdin,
      });

      setStatus("Running");

      const result = await waitForResult(token);

      setStatus(result.status?.description || "Finished");

      setOutput(
        [
          result.stdout,
          result.compileOutput,
          result.stderr,
          result.message,
        ]
          .filter(Boolean)
          .join("\n") ||
          "Program completed without output."
      );
    } catch (error) {
      setStatus("Error");
      setOutput(
        error.response?.data?.message ||
        error.message ||
        "Execution failed."
      );
    } finally {
      setRunning(false);
    }
  };

  const saveCode = () => {
    try {
      localStorage.setItem(
        "codingbhai_ide_codes_v2",
        JSON.stringify(codes)
      );
      setStatus("Saved locally");
    } catch {
      setStatus("Could not save code");
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `main.${
      extensionMap[editorLanguage] || "txt"
    }`;

    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    updateCode(
      starterCode[editorLanguage] || ""
    );
    setOutput("");
    setStatus("Reset");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3">
              <Code2 size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                CodingBhai IDE
              </h1>
              <p className="text-sm text-slate-400">
                Online multi-language compiler
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setTheme((current) =>
                current === "dark" ? "light" : "dark"
              )
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm"
          >
            Editor: {theme}
          </button>
        </header>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
          <select
            value={languageId}
            onChange={(event) => {
              setLanguageId(event.target.value);
              setOutput("");
              setStatus("");
            }}
            disabled={loadingLanguages || running}
            className="max-w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
          >
            {loadingLanguages && (
              <option value="">Loading languages...</option>
            )}

            {languages.map((lang) => (
              <option key={lang.id} value={String(lang.id)}>
                {lang.name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={resetCode}
              className="rounded-lg bg-slate-800 p-2.5"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="rounded-lg bg-slate-800 p-2.5"
              title="Copy"
            >
              <Copy size={18} />
            </button>

            <button
              onClick={saveCode}
              className="rounded-lg bg-slate-800 p-2.5"
              title="Save"
            >
              <Save size={18} />
            </button>

            <button
              onClick={downloadCode}
              className="rounded-lg bg-slate-800 p-2.5"
              title="Download"
            >
              <Download size={18} />
            </button>

            <button
              onClick={handleRun}
              disabled={running || !languageId}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              <Play size={17} />
              {running ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:h-[calc(100vh-245px)] lg:min-h-[500px] lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
          <section className="min-w-0">
            <div className="mb-2 text-sm text-slate-400">
              main.{extensionMap[editorLanguage] || "txt"}
            </div>

            <div className="h-[440px] overflow-hidden rounded-xl border border-slate-700 lg:h-[calc(100%-28px)]">
              <Editor
                height="100%"
                language={editorLanguage}
                theme={theme === "dark" ? "vs-dark" : "light"}
                value={code}
                onChange={(value) =>
                  updateCode(value ?? "")
                }
                options={{
                  fontSize: 14,
                  automaticLayout: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </section>

          <section className="flex min-h-[350px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#0b1220]">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-green-400" />
                <span className="font-semibold">Terminal</span>
              </div>

              <span className="text-xs text-slate-400">
                {status || "Ready"}
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 flex-col border-b border-slate-700">
                <label className="p-3 text-xs font-semibold uppercase text-slate-400">
                  Standard Input
                </label>

                <textarea
                  value={stdin}
                  onChange={(event) =>
                    setStdin(event.target.value)
                  }
                  placeholder="Enter input here..."
                  className="min-h-[100px] flex-1 resize-none bg-transparent px-4 pb-4 font-mono text-sm outline-none"
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="p-3 text-xs font-semibold uppercase text-slate-400">
                  Output
                </div>

                <pre
                  aria-live="polite"
                  className="min-h-[160px] flex-1 overflow-auto whitespace-pre-wrap break-words px-4 pb-4 font-mono text-sm text-green-400"
                >
                  {running
                    ? "Compiling / executing..."
                    : output || "Ready to run code."}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
