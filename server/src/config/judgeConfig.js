export const JUDGE_CONFIG = {
  javascript: {
    image: "node:22-alpine",
    fileName: "solution.js",
    command: ["node", "/app/solution.js"],

    timeLimit: 2000,
    memoryLimit: "128m",
    cpus: "0.5",
    pidsLimit: 64,
  },

  python: {
    image: "python:3.12-alpine",
    fileName: "solution.py",
    command: ["python", "/app/solution.py"],

    timeLimit: 2000,
    memoryLimit: "128m",
    cpus: "0.5",
    pidsLimit: 64,
  },

  java: {
    image: "eclipse-temurin:21-jdk-alpine",
    fileName: "Main.java",
    command: [
      "sh",
      "-c",
      "javac /app/Main.java && java -cp /app Main",
    ],

    timeLimit: 3000,
    memoryLimit: "256m",
    cpus: "0.5",
    pidsLimit: 64,
  },

  cpp: {
    image: "gcc:14",
    fileName: "main.cpp",
    command: [
      "sh",
      "-c",
      "g++ /app/main.cpp -O2 -o /tmp/main && /tmp/main",
    ],

    timeLimit: 3000,
    memoryLimit: "256m",
    cpus: "0.5",
    pidsLimit: 64,
  },
};