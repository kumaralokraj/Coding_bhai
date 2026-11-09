import {
  createSubmission,
  getJudgeLanguages,
  getSubmission,
} from "./judge0Service.js";

export const getLanguages = getJudgeLanguages;

export function executeCode(languageId, sourceCode, stdin = "") {
  return createSubmission({ languageId, sourceCode, stdin });
}

export const getExecutionResult = getSubmission;
