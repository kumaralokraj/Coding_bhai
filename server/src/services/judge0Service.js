import { spawn, spawnSync } from "node:child_process";

const REQUEST_TIMEOUT_MS = 15000;
const LANGUAGE_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CODE_BYTES = 50000;
const MAX_INPUT_BYTES = 10000;
const EXECUTION_LIMITS = {
  cpu_time_limit: 2,
  wall_time_limit: 5,
  memory_limit: 128000,
};

const LOCAL_LANGUAGES = [
  { id: 63, name: "JavaScript (Node.js)" },
  { id: 71, name: "Python (3.12)" },
];

const LOCAL_RUNTIME_MAP = {
  63: {
    command: "node",
    args: (sourceCode) => ["-e", sourceCode],
  },
  71: {
    command: "python",
    args: (sourceCode) => ["-c", sourceCode],
  },
};

let languageCache;
let languageCacheExpiresAt = 0;
let languageRequest;
let localFallbackEnabled = false;
const localSubmissionStore = new Map();

export class Judge0Error extends Error {
  constructor(message, { code, statusCode, publicMessage }) {
    super(message);
    this.name = "Judge0Error";
    this.code = code;
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
  }
}

function getJudge0BaseUrl() {
  const configuredUrl = process.env.JUDGE0_URL?.trim();

  if (!configuredUrl) {
    throw new Judge0Error("JUDGE0_URL is not configured.", {
      code: "JUDGE0_NOT_CONFIGURED",
      statusCode: 503,
      publicMessage: "Code execution service is not configured. Set JUDGE0_URL on the server.",
    });
  }

  let url;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Judge0Error("JUDGE0_URL is not a valid URL.", {
      code: "JUDGE0_INVALID_URL",
      statusCode: 503,
      publicMessage: "Code execution service has an invalid URL configuration.",
    });
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Judge0Error("JUDGE0_URL must be an HTTP(S) base URL.", {
      code: "JUDGE0_INVALID_URL",
      statusCode: 503,
      publicMessage: "Code execution service has an invalid URL configuration.",
    });
  }

  return url.toString().replace(/\/+$/, "");
}

function isLocalRuntimeAvailable(command) {
  try {
    const result = spawnSync(command, ["--version"], {
      stdio: "ignore",
      windowsHide: true,
    });

    return result.error == null || result.status === 0;
  } catch {
    return false;
  }
}

function getLocalFallbackLanguages() {
  return LOCAL_LANGUAGES.filter((language) => {
    const runtime = LOCAL_RUNTIME_MAP[language.id];
    return runtime && isLocalRuntimeAvailable(runtime.command);
  });
}

async function runLocalSubmission({ languageId, sourceCode, stdin = "" }) {
  const runtime = LOCAL_RUNTIME_MAP[Number(languageId)];

  if (!runtime) {
    throw new Judge0Error("Unsupported language for local execution.", {
      code: "JUDGE0_UNSUPPORTED_LANGUAGE",
      statusCode: 400,
      publicMessage: "The selected programming language is not supported on this machine.",
    });
  }

  if (!isLocalRuntimeAvailable(runtime.command)) {
    throw new Judge0Error("The local runtime is not installed.", {
      code: "JUDGE0_UNSUPPORTED_LANGUAGE",
      statusCode: 400,
      publicMessage: "The selected programming language runtime is not installed on this server.",
    });
  }

  return new Promise((resolve, reject) => {
    const child = spawn(runtime.command, runtime.args(sourceCode), {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let hasCompleted = false;

    child.stdin.write(stdin);
    child.stdin.end();

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    const normalizeOutput = (value) => value.replace(/\r\n/g, "\n");

    const timeout = setTimeout(() => {
      if (!hasCompleted) {
        hasCompleted = true;
        child.kill("SIGKILL");
        reject(
          new Judge0Error("Local execution timed out.", {
            code: "JUDGE0_TIMEOUT",
            statusCode: 504,
            publicMessage: "Code execution timed out while running locally.",
          })
        );
      }
    }, 10000);

    child.on("error", (error) => {
      if (hasCompleted) return;
      hasCompleted = true;
      clearTimeout(timeout);
      reject(
        new Judge0Error(error.message || "Local execution failed.", {
          code: "JUDGE0_UNAVAILABLE",
          statusCode: 502,
          publicMessage: "Code execution service is temporarily unavailable.",
        })
      );
    });

    child.on("close", (exitCode) => {
      if (hasCompleted) return;
      hasCompleted = true;
      clearTimeout(timeout);

      const finalOutput = {
        token: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        stdout: normalizeOutput(stdout),
        stderr: normalizeOutput(stderr),
        compile_output: "",
        message: exitCode === 0 ? "" : normalizeOutput(stderr) || "Execution failed.",
        status: {
          id: exitCode === 0 ? 3 : 4,
          description: exitCode === 0 ? "Accepted" : "Runtime Error",
        },
        time: 0,
        memory: 0,
      };

      resolve(finalOutput);
    });
  });
}

async function judge0Request(path, options = {}) {
  const url = `${getJudge0BaseUrl()}${path}`;
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(process.env.JUDGE0_AUTH_TOKEN?.trim()
      ? { "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN.trim() }
      : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut =
      error.name === "AbortError" || error.name === "TimeoutError";

    throw new Judge0Error(
      timedOut ? "Judge0 request timed out." : "Could not connect to Judge0.",
      {
        code: timedOut ? "JUDGE0_TIMEOUT" : "JUDGE0_UNAVAILABLE",
        statusCode: timedOut ? 504 : 502,
        publicMessage: timedOut
          ? "Code execution service timed out. Please try again."
          : "Code execution service is temporarily unavailable.",
      }
    );
  }

  const responseText = await response.text();
  let data = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Judge0Error("Judge0 returned an invalid response.", {
        code: "JUDGE0_INVALID_RESPONSE",
        statusCode: 502,
        publicMessage: "Code execution service returned an invalid response.",
      });
    }
  }

  if (!response.ok) {
    const rejectedSubmission = response.status === 422;
    const rateLimited = response.status === 429;
    throw new Judge0Error(`Judge0 returned HTTP ${response.status}.`, {
      code: rejectedSubmission
        ? "JUDGE0_INVALID_SUBMISSION"
        : rateLimited
          ? "JUDGE0_RATE_LIMITED"
          : "JUDGE0_REQUEST_FAILED",
      statusCode: rejectedSubmission ? 400 : rateLimited ? 429 : 502,
      publicMessage: rejectedSubmission
        ? "Judge0 rejected the submission. Check the language, code, and execution limits."
        : rateLimited
          ? "Judge0 is rate limiting requests. Please try again shortly."
          : "Code execution service is temporarily unavailable.",
    });
  }

  return data;
}

export async function getJudgeLanguages() {
  if (languageCache && Date.now() < languageCacheExpiresAt) {
    return languageCache;
  }

  if (!languageRequest) {
    languageRequest = judge0Request("/languages/")
      .then((languages) => {
        if (!Array.isArray(languages)) {
          throw new Judge0Error("Judge0 returned an invalid language list.", {
            code: "JUDGE0_INVALID_RESPONSE",
            statusCode: 502,
            publicMessage: "Code execution service returned an invalid language list.",
          });
        }

        languageCache = languages;
        languageCacheExpiresAt = Date.now() + LANGUAGE_CACHE_TTL_MS;
        localFallbackEnabled = false;
        return languageCache;
      })
      .catch((error) => {
        const localLanguages = getLocalFallbackLanguages();
        if (localLanguages.length > 0 && process.env.JUDGE0_URL) {
          languageCache = localLanguages;
          languageCacheExpiresAt = Date.now() + LANGUAGE_CACHE_TTL_MS;
          localFallbackEnabled = true;
          return languageCache;
        }

        throw error;
      })
      .finally(() => {
        languageRequest = undefined;
      });
  }

  return languageRequest;
}

export async function createSubmission({
  languageId,
  sourceCode,
  stdin = "",
}) {
  if (
    !Number.isInteger(languageId) ||
    languageId <= 0 ||
    typeof sourceCode !== "string" ||
    !sourceCode.trim() ||
    typeof stdin !== "string"
  ) {
    throw new Judge0Error("Invalid submission data.", {
      code: "JUDGE0_INVALID_SUBMISSION",
      statusCode: 400,
      publicMessage: "Valid language, code, and input are required.",
    });
  }

  if (
    Buffer.byteLength(sourceCode, "utf8") > MAX_CODE_BYTES ||
    Buffer.byteLength(stdin, "utf8") > MAX_INPUT_BYTES
  ) {
    throw new Judge0Error("Submission exceeds the allowed size.", {
      code: "JUDGE0_SUBMISSION_TOO_LARGE",
      statusCode: 413,
      publicMessage: "Code or input is too large.",
    });
  }

  if (localFallbackEnabled && getLocalFallbackLanguages().some((language) => language.id === languageId)) {
    const result = await runLocalSubmission({ languageId, sourceCode, stdin });
    localSubmissionStore.set(result.token, result);
    return { token: result.token };
  }

  try {
    const languages = await getJudgeLanguages();
    if (!languages.some((language) => language.id === languageId)) {
      throw new Judge0Error("Unsupported Judge0 language.", {
        code: "JUDGE0_UNSUPPORTED_LANGUAGE",
        statusCode: 400,
        publicMessage: "The selected programming language is not supported.",
      });
    }

    const submission = await judge0Request(
      "/submissions/?base64_encoded=false&wait=false",
      {
        method: "POST",
        body: JSON.stringify({
          language_id: languageId,
          source_code: sourceCode,
          stdin,
          ...EXECUTION_LIMITS,
        }),
      }
    );

    if (typeof submission.token !== "string" || !submission.token) {
      throw new Judge0Error("Judge0 did not return a submission token.", {
        code: "JUDGE0_INVALID_RESPONSE",
        statusCode: 502,
        publicMessage: "Code execution service did not return a submission token.",
      });
    }

    return submission;
  } catch (error) {
    const localLanguages = getLocalFallbackLanguages();

    if (
      localLanguages.some((language) => language.id === languageId) &&
      error instanceof Judge0Error &&
      [
        "JUDGE0_TIMEOUT",
        "JUDGE0_UNAVAILABLE",
        "JUDGE0_REQUEST_FAILED",
        "JUDGE0_RATE_LIMITED",
      ].includes(error.code)
    ) {
      const result = await runLocalSubmission({ languageId, sourceCode, stdin });
      localSubmissionStore.set(result.token, result);
      localFallbackEnabled = true;
      languageCache = localLanguages;
      languageCacheExpiresAt = Date.now() + LANGUAGE_CACHE_TTL_MS;
      return { token: result.token };
    }

    throw error;
  }
}

export async function getSubmission(token) {
  if (localSubmissionStore.has(token)) {
    return localSubmissionStore.get(token);
  }

  const fields = [
    "token",
    "stdout",
    "stderr",
    "compile_output",
    "message",
    "status",
    "time",
    "memory",
  ].join(",");

  return judge0Request(
    `/submissions/${encodeURIComponent(token)}?base64_encoded=false&fields=${fields}`
  );
}
