import { Worker } from "bullmq";

import redis from "../config/redis.js";
import { runCodeInDocker } from "../services/codeRunner.js";

const worker = new Worker(
  "code-execution",

  async (job) => {
    console.log("=================================");
    console.log("New Judge Job:", job.id);
    console.log("Language:", job.data.language);
    console.log("=================================");

    const {
      language,
      code,
      input = "",
    } = job.data;

    const result = await runCodeInDocker({
      language,
      code,
      input,
    });

    console.log("Judge Result:", result);

    return result;
  },

  {
    connection: redis,
    concurrency: 2,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error
  );
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

console.log("🚀 CodingBhai Judge Worker started...");