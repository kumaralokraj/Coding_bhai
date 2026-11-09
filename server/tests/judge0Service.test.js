import assert from "node:assert/strict";
import { after, test } from "node:test";

import {
  createSubmission,
  getJudgeLanguages,
  getSubmission,
} from "../src/services/judge0Service.js";

const originalUrl = process.env.JUDGE0_URL;
const originalToken = process.env.JUDGE0_AUTH_TOKEN;
const originalFetch = globalThis.fetch;

after(() => {
  if (originalUrl === undefined) {
    delete process.env.JUDGE0_URL;
  } else {
    process.env.JUDGE0_URL = originalUrl;
  }

  if (originalToken === undefined) {
    delete process.env.JUDGE0_AUTH_TOKEN;
  } else {
    process.env.JUDGE0_AUTH_TOKEN = originalToken;
  }

  globalThis.fetch = originalFetch;
});

test("reports missing Judge0 configuration without making a request", async () => {
  delete process.env.JUDGE0_URL;
  let requestMade = false;
  globalThis.fetch = async () => {
    requestMade = true;
    throw new Error("Unexpected network request");
  };

  await assert.rejects(getJudgeLanguages(), {
    code: "JUDGE0_NOT_CONFIGURED",
    statusCode: 503,
  });
  assert.equal(requestMade, false);
});

test("loads languages, submits bounded code, and retrieves results", async () => {
  process.env.JUDGE0_URL = "http://judge0.test/prefix/";
  process.env.JUDGE0_AUTH_TOKEN = "test-token";
  const requests = [];
  const responses = [
    new Response(JSON.stringify([{ id: 71, name: "Python (3.12)" }])),
    new Response(JSON.stringify({ token: "submission-token" })),
    new Response(JSON.stringify({
      token: "submission-token",
      stdout: "hello\n",
      status: { id: 3, description: "Accepted" },
    })),
  ];
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), options });
    const response = responses.shift();
    assert.ok(response, "Unexpected Judge0 request");
    return response;
  };

  const languages = await getJudgeLanguages();
  assert.deepEqual(languages, [{ id: 71, name: "Python (3.12)" }]);
  assert.deepEqual(await getJudgeLanguages(), languages);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "http://judge0.test/prefix/languages/");
  assert.equal(requests[0].options.headers["X-Auth-Token"], "test-token");

  const submission = await createSubmission({
    languageId: 71,
    sourceCode: 'print("hello")',
  });
  assert.deepEqual(submission, { token: "submission-token" });
  assert.equal(
    requests[1].url,
    "http://judge0.test/prefix/submissions/?base64_encoded=false&wait=false"
  );
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    language_id: 71,
    source_code: 'print("hello")',
    stdin: "",
    cpu_time_limit: 2,
    wall_time_limit: 5,
    memory_limit: 128000,
  });

  const result = await getSubmission("submission-token");
  assert.equal(result.stdout, "hello\n");
  assert.match(requests[2].url, /fields=token,stdout,stderr,compile_output,message,status,time,memory$/);
});

test("rejects unsupported languages without submitting code", async () => {
  process.env.JUDGE0_URL = "http://judge0.test";
  globalThis.fetch = async () =>
    new Response(JSON.stringify([{ id: 71, name: "Python" }]));

  await assert.rejects(
    createSubmission({
      languageId: 999,
      sourceCode: "print('not submitted')",
    }),
    {
      code: "JUDGE0_UNSUPPORTED_LANGUAGE",
      statusCode: 400,
    }
  );
});

test("rejects oversized submissions before sending them to Judge0", async () => {
  let requestMade = false;
  globalThis.fetch = async () => {
    requestMade = true;
    throw new Error("Oversized submission should not be sent");
  };

  await assert.rejects(
    createSubmission({
      languageId: 71,
      sourceCode: "é".repeat(25001),
    }),
    {
      code: "JUDGE0_SUBMISSION_TOO_LARGE",
      statusCode: 413,
    }
  );
  assert.equal(requestMade, false);
});

test("translates Judge0 submission errors to a client-safe error", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "internal detail" }), {
      status: 422,
    });

  await assert.rejects(
    createSubmission({
      languageId: 71,
      sourceCode: 'print("hello")',
    }),
    {
      code: "JUDGE0_INVALID_SUBMISSION",
      statusCode: 400,
      publicMessage:
        "Judge0 rejected the submission. Check the language, code, and execution limits.",
    }
  );
});

test("uses the local runtime when Judge0 is unavailable", async () => {
  process.env.JUDGE0_URL = "http://judge0.test";
  globalThis.fetch = async () => {
    throw new Error("Judge0 is offline");
  };

  const languages = await getJudgeLanguages();
  assert.ok(languages.some((language) => language.id === 71));

  const submission = await createSubmission({
    languageId: 71,
    sourceCode: 'print("hello from local fallback")',
  });
  assert.match(submission.token, /^local-/);

  const result = await getSubmission(submission.token);
  assert.equal(result.stdout, "hello from local fallback\n");
  assert.equal(result.status.id, 3);
});

test("returns a timeout error when Judge0 does not respond in time", async () => {
  globalThis.fetch = async () => {
    const error = new Error("timeout");
    error.name = "TimeoutError";
    throw error;
  };

  await assert.rejects(getSubmission("submission-token"), {
    code: "JUDGE0_TIMEOUT",
    statusCode: 504,
  });
});
