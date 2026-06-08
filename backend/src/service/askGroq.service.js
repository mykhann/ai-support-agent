import axios from "axios"
import "dotenv/config"

export const askGroq = async (question, context) => {
    const groq_api_key = process.env.GROQ_API_KEY
    const groq_model = process.env.GROQ_MODEL
    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: process.env.GROQ_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are an automated Knowledge Base Assistant. Your task is to answer user inquiries strictly utilizing the verified context provided below. If the context does not contain the answer, politely state that you cannot find the requested information in the documentation.
    
    [VERIFIED CONTEXT]:
    ${context || "No matching internal documentation found."}`
                },
                {
                    role: "user",
                    content: question
                }

            ]
        },

        {
            headers: {
                Authorization: `Bearer ${groq_api_key}`,
                "Content-Type": "application/json"
            }
        }


    )
    const groq_response = response?.data?.choices[0]?.message?.content
    return groq_response;
}