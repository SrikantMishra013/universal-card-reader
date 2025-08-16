import dotenv from "dotenv";
dotenv.config();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`;

interface FollowUpInput {
  name: string;
  position: string;
  email: string;
  phone: string;
  company: string;
  domain: string;
  transcript: string;
}

export const followUpEmail = async ({
  name,
  position,
  email,
  phone,
  company,
  domain,
  transcript,
}: FollowUpInput): Promise<{ subject: string; body: string }> => {
  try {
    const prompt = `
Write a professional follow-up email for the following visitor based on the information provided:

Name: ${name}
Position: ${position}
Email: ${email}
Phone: ${phone}
Company: ${company}
Domain: ${domain}
Transcript: ${transcript}

Tone: Friendly and professional.
Format: JSON object with the following keys:
{
  "subject": "Follow-up email subject",
  "body": "Follow-up email body in HTML format with proper tags like <p>, <br>, <strong> etc."
}
Do not use placeholders like [Your Company Name] or [Your Name/Your Team]. Instead, use appropriate dummy values. Ensure the body is valid HTML, not plain text.
`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Gemini returned no content");

    // Parse JSON part from the result string
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonString);

    return {
      subject: parsed.subject || "Follow-up",
      body: parsed.body || "<p></p>",
    };
  } catch (err) {
    console.error("Error generating follow-up email:", err);
    return { subject: "", body: "<p></p>" };
  }
};
