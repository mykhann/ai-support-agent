import { Router } from "express";
import { chatWithBot } from "../controller/chat.controller";

const router=Router()

router.route("/chat",chatWithBot)


export default router;