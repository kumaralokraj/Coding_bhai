import { Queue } from "bullmq";
import redis from "../utils/redis.js";

export const submissionQueue = new Queue("code-submissions", {
  connection: redis,

  defaultJobOptions: {
    attempts: 2,

    backoff: {
      type: "exponential",
      delay: 2000,
    },

    removeOnComplete: {
      age: 3600,
      count: 1000,
    },

    removeOnFail: {
      age: 86400,
    },
  },
});