import FAQ from "../models/faq.models"
import { askGroq } from "../service/askGroq.service"

export const chatWithBot = (async, (req, res) => {
    try {
        const { message } = req.body;

        const faqs = await FAQ.find({
            question: { $regex: message, $options: "i" }
        })

        const context = faqs
            .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
            .join("\n\n");

        const responseFromAi = await askGroq(question, context)

        res.status(200).json({
            success: true,
            reply: responseFromAi
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }


})