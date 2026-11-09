
import { useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";

// Judge0 language names -> Monaco language IDs
const LANGUAGE_MAP = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  cpp: "cpp",
  c: "c",
  java: "java",
  csharp: "csharp",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  kotlin: "kotlin",
  swift: "swift",
  sql: "sql",
  shell: "shell",
  bash: "shell",
  r: "r",
  html: "html",
  css: "css",
  json: "json",
  xml: "xml",
  markdown: "markdown",
  perl: "perl",
  lua: "lua",
  scala: "scala",
  dart: "dart",
  plaintext: "plaintext",
};

export default function IDEEditor({
  language = "javascript",
  monacoLanguage,
  code = "",
  onChange = () => {},
  theme = "dark",
  fontSize = 14,
  readOnly = false,
  onRun,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const runRef = useRef(onRun);

  // Keep latest Run handler available to keyboard shortcut
  runRef.current = onRun;

  const resolvedLanguage =
    LANGUAGE_MAP[monacoLanguage] ||
    LANGUAGE_MAP[language] ||
    monacoLanguage ||
    language ||
    "plaintext";

  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Ctrl + Enter / Cmd + Enter = Run Code
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        runRef.current?.();
      }
    );

    editor.focus();
  }, []);

  const handleEditorChange = useCallback(
    (value) => {
      onChange(value ?? "");
    },
    [onChange]
  );

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-xl border border-slate-700 bg-[#1e1e1e]">
      <Editor
        height="100%"
        width="100%"
        language={resolvedLanguage}
        value={code}
        theme={theme === "dark" ? "vs-dark" : "light"}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        loading={
          <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-400">
            Loading CodingBhai Editor...
          </div>
        }
        options={{
          // Appearance
          fontSize,
          fontFamily:
            "'Fira Code', Consolas, Monaco, monospace",
          fontLigatures: true,
          lineHeight: 24,
          letterSpacing: 0.3,

          // Layout
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          wordWrapColumn: 100,
          padding: {
            top: 16,
            bottom: 16,
          },

          // Line numbers and guides
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: true,
          folding: true,
          foldingStrategy: "auto",
          renderLineHighlight: "all",
          renderWhitespace: "selection",
          guides: {
            indentation: true,
            bracketPairs: true,
          },

          // Editing
          tabSize: 2,
          insertSpaces: true,
          autoIndent: "full",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoSurround: "languageDefined",
          formatOnPaste: true,
          formatOnType: true,
          readOnly,

          // Suggestions
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          parameterHints: {
            enabled: true,
          },
          snippetSuggestions: "inline",
          wordBasedSuggestions: "currentDocument",

          // Navigation
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          cursorStyle: "line",
          mouseWheelZoom: true,
          multiCursorModifier: "alt",

          // Accessibility
          accessibilitySupport: "auto",
          ariaLabel: "CodingBhai Online Code Editor",

          // Miscellaneous
          contextmenu: true,
          links: true,
          dragAndDrop: true,
          copyWithSyntaxHighlighting: true,
          occurrencesHighlight: "singleFile",
          selectionHighlight: true,
          matchBrackets: "always",
          stickyScroll: {
            enabled: false,
          },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
