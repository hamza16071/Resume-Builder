import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoute from "./routes/resume.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use("/api/resume", resumeRoute);

app.get("/", (req, res) => res.send("Resume Builder PRO API running"));

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
