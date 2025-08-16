import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  summary: string;
  name: string;
  company: string;
}

export const sendEmail = async ({
  to,
  subject,
  body,
  attachments = [],
}: {
  to: string;
  subject: string;
  body?: string;
  attachments?: any[];
}) => {
  await transporter.sendMail({
    from: `"Universal Card Reader" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
    attachments,
  });
};
