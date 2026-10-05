import api from "./api";

export const sendMessageToAI = async (
  message,
  history = []
) => {
  const response = await api.post("/ai/chat", {
    message,
    history,
  });

  return response.data;
};