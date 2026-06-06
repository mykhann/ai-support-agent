import { Router } from "express";
import { chatWithBot } from "../controller/chat.controller.js";
import { chatLimiter } from "../middleware/rateLimit.middleware.js";

const router=Router()

router.post("/",chatLimiter,chatWithBot)


export default router;