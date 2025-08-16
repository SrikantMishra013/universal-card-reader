import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import visitorRoutes from "./routes/visitorRoutes";
import emailRoutes from "./routes/emailRoutes";

dotenv.config();
const app = express();
app.use(cors({ origin: "https://universal-card-reader.vercel.app" }));
app.use(express.json());

app.use("/api/visitor", visitorRoutes);
app.use("/api/visitor", emailRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
