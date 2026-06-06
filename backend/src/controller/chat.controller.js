import FAQ from "../models/faq.models.js"
import { askGroq } from "../service/askGroq.service.js"

export const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message){
            return res.status(400).json({
                success:false,
                message:"message is required"
            })
        }

        const faqs = await FAQ.find({
            question: { $regex: message, $options: "i" }
        })

        const context =
            faqs.length > 0
                ? faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
                : "No relevant FAQ found. Use general knowledge.";

        const responseFromAi = await askGroq(message, context)

        res.status(200).json({
            success: true,
            reply: responseFromAi
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }


}