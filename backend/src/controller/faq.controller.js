import FAQ from "../models/faq.models.js"

export const addFaq=async(req,res)=>{
   try {
     const {question,answer}=req.body;
    if (!question || answer){
        res.status(400).json({
            success:false,
            message:"question and answer are required"
        })

    const addFAQ=await FAQ.create({
        question,
        answer
    })    

    res.status(200).json({
        success:true,
        message:"faq added successfully",
        data:addFaq
    })

    }
    
   } catch (error) {
    res.status(500).json(error.message)
    
   }
}