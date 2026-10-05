import { askMistral } from "../services/aiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const answer = await askMistral(
      message,
      history
    );

    res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("MISTRAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI response failed",
      error: error.message,
    });
  }
};