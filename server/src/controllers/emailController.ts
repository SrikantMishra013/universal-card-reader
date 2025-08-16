import { Request, Response } from "express";
import { sendEmail } from "../utils/email";
import { Visitor } from "../models/Visitor";

export const sendFollowUpEmail = async (req: Request, res: Response) => {
  try {
    const visitorId = req.params.id;
    const files = req.files as Express.Multer.File[];

    const visitor = await Visitor.findById(visitorId);

    if (!visitor) return res.status(404).json({ error: "Visitor not found" });

    const subject = `${visitor.subject}, ${visitor.name}!`;
    const body = `${visitor.body}`;

    await sendEmail({
      to: visitor.email,
      subject,
      body,
      attachments: files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
      })),
    });

    return res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
