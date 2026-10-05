import axios from "axios";

const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://ce.judge0.com";


// CodingBhai language -> Judge0 language ID
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};


export const executeCode = async ({
  language,
  code,
  input = "",
}) => {

  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error("Unsupported programming language");
  }


  const response = await axios.post(
    `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=true`,
    {
      source_code: code,
      language_id: languageId,
      stdin: input,
      cpu_time_limit: 2,
      wall_time_limit: 5,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );


  return response.data;
};