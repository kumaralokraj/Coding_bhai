
import {
  getJudgeLanguages,
  createSubmission,
  getSubmission,
  Judge0Error,
} from "../services/judge0Service.js";

function sendError(res, error) {
  console.error("IDE error:", error.message);

  return res.status(
    error instanceof Judge0Error ? error.statusCode : 502
  ).json({
    message:
      error instanceof Judge0Error
        ? error.publicMessage
        : "Code execution service is temporarily unavailable.",
  });
}

export async function listLanguages(req, res) {
  try {
    res.json({ languages: await getJudgeLanguages() });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function submitCode(req, res) {
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
        message: "Valid language, code and input are required.",
      });
    }

    const submission = await createSubmission({
      languageId,
      sourceCode,
      stdin,
    });

    return res.status(202).json({ token: submission.token });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function submissionResult(req, res) {
  const { token } = req.params;

  if (
    !/^[0-9a-f-]{36}$/i.test(token)
  ) {
    return res.status(400).json({
      message: "Invalid submission token.",
    });
  }

  try {
    const result = await getSubmission(token);
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
}
