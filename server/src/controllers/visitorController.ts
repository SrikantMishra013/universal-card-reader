import { Request, Response } from "express";
import { generateAISummary } from "../utils/ai";
import { Visitor } from "../models/Visitor";
import { followUpEmail } from "../utils/followUp";

export const createVisitor = async (req: Request, res: Response) => {
  try {
    const { name, email, company, phone, position, domain, transcript } =
      req.body;

    const audio = req.file?.buffer || null;
    const audioMimeType = req.file?.mimetype || null;

    const { subject, body } = await followUpEmail({
      name,
      position,
      email,
      phone,
      company,
      domain,
      transcript,
    });

    // Create a new visitor document
    const newVisitor = new Visitor({
      name,
      email,
      company,
      phone,
      position,
      domain,
      transcript,
      audio,
      audioMimeType,
      subject,
      body,
    });

    const savedVisitor = await newVisitor.save();

    res.status(201).json({ _id: savedVisitor._id });
  } catch (error) {
    console.error("Error saving visitor:", error);
    res.status(500).json({ message: "Server error. Could not save visitor." });
  }
};

export const getVisitorById = async (req: Request, res: Response) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });
  res.json(visitor);
};

export const getAllVisitors = async (req: Request, res: Response) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to fetch visitors" });
  }
};

export const enrichVisitorAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const visitor = await Visitor.findById(id);
    if (!visitor) {
      res.status(404).json({ error: "Visitor not found" });
      return;
    }

    if (!visitor.transcript) {
      res.status(400).json({ error: "Visitor transcript is missing" });
      return;
    }

    const summaryData = await generateAISummary(visitor.transcript);

    if (!summaryData) {
      res.status(500).json({ error: "Failed to generate summary" });
      return;
    }

    const { summary, keyPoints, actionItems, sentiment } = summaryData;

    visitor.aiSummary = summary;
    visitor.enrichedData = {
      keyPoints,
      actionItems,
      sentiment,
    };

    await visitor.save();

    res.json({
      summary,
      keyPoints,
      actionItems,
      sentiment,
    });
  } catch (err) {
    console.error("Error in enrich route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
