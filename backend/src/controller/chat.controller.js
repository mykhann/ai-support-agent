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

    // Get all FAQs for better matching
    const allFAQs = await FAQ.find();
    
    // Find the best matching FAQ
    let bestMatch = null;
    let bestScore = 0;
    const normalizedMessage = message.toLowerCase().trim();
    
    allFAQs.forEach(faq => {
      const questionLower = faq.question.toLowerCase();
      let score = 0;
      
      // 1. Exact match (highest priority)
      if (questionLower === normalizedMessage) {
        score = 100;
      }
      // 2. Question contains entire message
      else if (questionLower.includes(normalizedMessage)) {
        score = 80;
      }
      // 3. Message contains entire question
      else if (normalizedMessage.includes(questionLower)) {
        score = 70;
      }
      // 4. Keyword matching with weights
      else {
        const messageWords = normalizedMessage.split(' ');
        const questionWords = questionLower.split(' ');
        
        messageWords.forEach(word => {
          if (word.length > 2) { // Ignore short words
            if (questionLower.includes(word)) {
              score += 10; // Word found in question
            }
            // Check partial matches
            questionWords.forEach(qWord => {
              if (qWord.includes(word) || word.includes(qWord)) {
                score += 5;
              }
            });
          }
        });
        
        // Boost score for important technical terms
        const importantTerms = ['webhook', 'api', 'rate', 'limit', 'stalled', 'job', 'queue', 'retry', 'authenticate', 'security', 'reset', 'password'];
        importantTerms.forEach(term => {
          if (normalizedMessage.includes(term) && questionLower.includes(term)) {
            score += 15;
          }
        });
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    });
    
    let aiResponse;
    
    // If we found a good match (score >= 20)
    if (bestMatch && bestScore >= 20) {
      aiResponse = bestMatch.answer;
      console.log(` FAQ Match Found: "${bestMatch.question}" (Score: ${bestScore})`);
    } else {
      // Use Groq AI for fallback
      console.log("🤖 No FAQ match found, using Groq AI");
      
      // Get context from related FAQs
      const words = message.trim().split(/\s+/);
      const faqs = await FAQ.find({
        $or: words.flatMap(word => [
          { question: { $regex: word, $options: "i" } },
          { answer: { $regex: word, $options: "i" } }
        ])
      }).limit(5);
      
      const context = faqs.length > 0
        ? faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
        : "";
      
      aiResponse = await askGroq(message, context);
    }

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
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Interval Automation Error"
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