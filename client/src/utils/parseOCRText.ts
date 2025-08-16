export interface ParsedVisitor {
  name: string;
  email: string;
  company: string;
  mobile: string;
  raw: string;
}

export function parseOCRText(text: string): ParsedVisitor {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const email = lines.find((line) => emailRegex.test(line)) || "";
  const emailMatch = email.match(emailRegex);
  const finalEmail = emailMatch ? emailMatch[0] : "";

  const name = lines[0] || "Unknown";
  const mobile =
    lines.find((line) => line === line.toUpperCase() && line !== finalEmail) ||
    lines[1] ||
    "Unknown";
  const company =
    lines.find(
      (line) => line !== mobile && line !== name && line !== finalEmail
    ) || "Unknown";

  return {
    name,
    email: finalEmail,
    company,
    mobile,
    raw: text,
  };
}
