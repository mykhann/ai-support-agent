import FAQ from "../models/faq.models.js"
import Chat from "../models/chat.model.js"
import { askGroq } from "../service/askGroq.service.js"



export const chatWithBot = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = await Chat.create({ sessionId, messages: [] });
    }

    chat.messages.push({
      role: "user",
      content: message,
      createdAt: new Date()
    });

    const faqs = await FAQ.find({
      question: { $regex: message, $options: "i" },
    }).limit(5);

    const context =
      faqs.length > 0
        ? faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
        : "";

    const aiResponse = await askGroq(message, context);

    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await chat.save();

    return res.status(200).json({
      success: true,
      reply: aiResponse,
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