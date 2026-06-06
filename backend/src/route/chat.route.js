import { Router } from "express";
import { chatWithBot, getChatHistory } from "../controller/chat.controller.js";
import { chatLimiter } from "../middleware/rateLimit.middleware.js";

const router=Router()

router.post("/",chatLimiter,chatWithBot)
router.get("/:sessionId", getChatHistory);


export default router;