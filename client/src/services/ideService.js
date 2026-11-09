
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/api/execute${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function getLanguages() {
  const result = await request("/languages");
  return result.data;
}

export async function runCode({
  languageId,
  sourceCode,
  stdin = "",
}) {
  return request("", {
    method: "POST",
    body: JSON.stringify({
      languageId,
      sourceCode,
      stdin,
    }),
  });
}

export async function getExecutionResult(token) {
  const result = await request(`/${encodeURIComponent(token)}`);
  return result.data;
}

export const fetchLanguages = getLanguages;

export async function submitCode(submission) {
  const result = await runCode(submission);

  if (!result.token) {
    throw new Error("Execution service did not return a submission token.");
  }

  return result.token;
}

export async function waitForResult(token) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const result = await getExecutionResult(token);

    if (![1, 2].includes(result.status?.id)) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("Code execution timed out.");
}
