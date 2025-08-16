import mongoose from "mongoose";

const EnrichedDataSchema = new mongoose.Schema(
  {
    keyPoints: { type: [String], default: [] },
    actionItems: { type: [String], default: [] },
    sentiment: { type: String, default: "" },
  },
  { _id: false } // prevent automatic `_id` for subdocs
);

const VisitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    phone: { type: String },
    position: { type: String },
    domain: { type: String },
    transcript: { type: String },
    aiSummary: { type: String, default: "" },
    enrichedData: { type: EnrichedDataSchema, default: {} },
    audio: { type: Buffer },
    audioMimeType: { type: String },
    subject: { type: String },
    body: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Visitor = mongoose.model("Visitor", VisitorSchema);
