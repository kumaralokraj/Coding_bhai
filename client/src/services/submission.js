import api from "./api";

export const submitCode = async ({
  problemId,
  language,
  code,
}) => {
  const response = await api.post("/submissions", {
    problemId,
    language,
    code,
  });

  return response.data;
};