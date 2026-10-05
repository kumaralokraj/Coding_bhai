import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const codeQueue = new Queue("code-execution", {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,

    removeOnComplete: {
      age: 3600,
      count: 1000,
    },

    removeOnFail: {
      age: 86400,
      count: 1000,
    },
  },
});