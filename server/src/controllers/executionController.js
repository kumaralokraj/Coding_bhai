
import {
  executeCode,
  getLanguages,
  getExecutionResult,
} from "../services/executionService.js";
import { Judge0Error } from "../services/judge0Service.js";

export async function runCode(req, res) {
  try {
    const { languageId, sourceCode, stdin = "" } = req.body ?? {};

    if (
      !Number.isInteger(languageId) ||
      languageId <= 0 ||
      typeof sourceCode !== "string" ||
      !sourceCode.trim() ||
      typeof stdin !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid language, source code, or input",
      });
    }

    const result = await executeCode(languageId, sourceCode, stdin);

    return res.status(202).json({
      success: true,
      token: result.token,
      status: "queued",
    });
  } catch (error) {
    console.error("Execution submission failed:", error.message);

    return res.status(
      error instanceof Judge0Error ? error.statusCode : 502
    ).json({
      success: false,
      message:
        error instanceof Judge0Error
          ? error.publicMessage
          : "Execution service unavailable.",
    });
  }
}

export async function fetchExecutionResult(req, res) {
  try {
    const { token } = req.params;

    if (!/^[0-9a-fA-F-]{36}$/.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission token",
      });
    }

    const result = await getExecutionResult(token);

    return res.json({
      success: true,
      data: {
        stdout: result.stdout,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        message: result.message,
        status: result.status,
        time: result.time,
        memory: result.memory,
      },
    });
  } catch (error) {
    console.error("Execution result fetch failed:", error.message);

    return res.status(
      error instanceof Judge0Error ? error.statusCode : 502
    ).json({
      success: false,
      message:
        error instanceof Judge0Error
          ? error.publicMessage
          : "Unable to retrieve execution result.",
    });
  }
}

export async function fetchLanguages(req, res) {
  try {
    const languages = await getLanguages();

    return res.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error("Language fetch failed:", error.message);

    return res.status(
      error instanceof Judge0Error ? error.statusCode : 502
    ).json({
      success: false,
      message:
        error instanceof Judge0Error
          ? error.publicMessage
          : "Unable to fetch languages.",
    });
  }
}
