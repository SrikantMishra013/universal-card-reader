import express from "express";
import multer from "multer";
import {
  createVisitor,
  getVisitorById,
  enrichVisitorAI,
  getAllVisitors,
} from "../controllers/visitorController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/visitors - Create a new visitor
router.post("/", upload.single("audio"), createVisitor);

// GET /api/visitors - Get all visitors
router.get("/", getAllVisitors);

// GET /api/visitors/:id - Get a visitor by ID
router.get("/:id", getVisitorById);

// POST /api/visitors/:id/enrich - Enrich visitor data with AI
router.post("/:id/enrich", enrichVisitorAI);

export default router;
