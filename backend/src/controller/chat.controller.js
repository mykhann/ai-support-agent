import FAQ from "../models/faq.models.js"
import { askGroq } from "../service/askGroq.service.js"



export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const faqs = await FAQ.find({
      question: { $regex: message, $options: "i" },
    }).limit(5);

    const context =
      faqs.length > 0
        ? faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
        : "";

    const responseFromAi = await askGroq(message, context);

    return res.status(200).json({
      success: true,
      reply: responseFromAi,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({ sessionId });

    return res.status(200).json({
      success: true,
      messages: chat?.messages || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};