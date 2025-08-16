// backend/src/routes/emailRoutes.ts
import express from "express";
import multer from "multer";
import { sendFollowUpEmail } from "../controllers/emailController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/:id/email", upload.array("attachments"), sendFollowUpEmail);

export default router;
