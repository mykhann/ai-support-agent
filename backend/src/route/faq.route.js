import { Router } from "express";
import { addFaq } from "../controller/faq.controller.js";
const router=Router();


router.post("/",addFaq)


export default router