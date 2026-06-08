import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./src/config/db.js"
import chatRoutes from "./src/route/chat.route.js"
import faqRoutes from "./src/route/faq.route.js"
import cors from "cors"


dotenv.config();

const app = express();
app.use(express.json());

// DB connection 
connectDB()

// cors 

app.use(cors({
  origin:"http://localhost:5173"
}))
// routes 

app.use("/api/chat",chatRoutes)
app.use("/api/faq",faqRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});