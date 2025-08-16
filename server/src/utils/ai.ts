import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`;

interface AISummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: string;
}

export const generateAISummary = async (
  transcript: string
): Promise<AISummary | null> => {
  const prompt = `
  You are a highly skilled sales and marketing assistant for a trade show booth exhibitor. Your task is to analyze a conversation transcript from a visitor and provide a concise, structured summary. The output must be a single JSON object.

  Here is the conversation transcript:
  "${transcript}"

  Format: JSON object with the following keys:
  {
    "summary": "A concise summary of the conversation.",
    "keyPoints": [
      "Key takeaways or main topics discussed.",
      "Another key point.",
      "etc."
    ],
    "actionItems": [
      "Specific follow-up tasks (e.g., 'Send pricing info', 'Schedule a demo').",
      "Another action item.",
      "etc."
    ],
    "sentiment": "Overall sentiment of the visitor towards our product/service. (e.g., 'Very Positive', 'Neutral', 'Negative')."
  }
  `;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API call failed:", errorData);
      throw new Error("Failed to get a response from Gemini API.");
    }

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Gemini API response did not contain text.");
    }

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const jsonString = rawText.slice(jsonStart, jsonEnd);

    let parsedSummary: AISummary;

    try {
      parsedSummary = JSON.parse(jsonString);
    } catch (jsonError) {
      console.error("Failed to parse Gemini API response as JSON:", jsonString);
      return null;
    }

    // Validate the structure before returning
    if (
      typeof parsedSummary.summary === "string" &&
      Array.isArray(parsedSummary.keyPoints) &&
      Array.isArray(parsedSummary.actionItems) &&
      typeof parsedSummary.sentiment === "string"
    ) {
      return parsedSummary;
    } else {
      console.error(
        "Parsed response is missing required fields:",
        parsedSummary
      );
      return null;
    }
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return null;
  }
};
