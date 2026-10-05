import { runCodeInDocker } from "./services/codeRunner.js";

const main = async () => {
  const result = await runCodeInDocker({
    language: "javascript",

    code: `
console.log("Hello CodingBhai");

const a = 10;
const b = 20;

console.log(a + b);
`,
  });

  console.log(result);
};

main();