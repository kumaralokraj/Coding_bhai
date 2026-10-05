import { execFile } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

const LANGUAGE_CONFIG = {
  javascript: {
    image: "node:22-alpine",
    fileName: "solution.js",
    command: ["node", "/app/solution.js"],
  },

  python: {
    image: "python:3.12-alpine",
    fileName: "solution.py",
    command: ["python", "/app/solution.py"],
  },
};

const execDocker = (args, options = {}) => {
  return new Promise((resolve, reject) => {
    execFile(
      "docker",
      args,
      {
        timeout: options.timeout || 5000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject({
            error,
            stdout,
            stderr,
          });
          return;
        }

        resolve({
          stdout,
          stderr,
        });
      }
    );
  });
};

export const runCodeInDocker = async ({
  language,
  code,
  input = "",
}) => {
  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const jobId = crypto.randomUUID();

  const tempDir = path.join(
    os.tmpdir(),
    `codingbhai-${jobId}`
  );

  try {
    await fs.mkdir(tempDir, { recursive: true });

    const filePath = path.join(
      tempDir,
      config.fileName
    );

    await fs.writeFile(filePath, code, "utf8");

    const dockerArgs = [
      "run",
      "--rm",

      // Security
      "--network",
      "none",

      "--read-only",

      "--cap-drop",
      "ALL",

      "--security-opt",
      "no-new-privileges",

      // Resource limits
      "--memory",
      "128m",

      "--cpus",
      "0.5",

      "--pids-limit",
      "64",

      // Mount code
      "-v",
      `${tempDir}:/app:ro`,

      config.image,

      ...config.command,
    ];

    const result = await execDocker(dockerArgs, {
      timeout: 5000,
    });

    return {
      status: "success",
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (err) {
    if (err.error?.killed) {
      return {
        status: "timeout",
        stdout: err.stdout || "",
        stderr: "Execution timed out.",
      };
    }

    return {
      status: "error",
      stdout: err.stdout || "",
      stderr:
        err.stderr ||
        err.error?.message ||
        "Execution failed",
    };
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
};