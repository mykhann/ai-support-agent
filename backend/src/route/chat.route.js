import { Router } from "express";
import { chatWithBot } from "../controller/chat.controller.js";

const router=Router()

router.route("/",chatWithBot)


export default router;