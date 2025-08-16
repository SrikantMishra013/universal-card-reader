import { useEffect, useState, useRef } from "react"; // Import useRef
import { useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  Mail,
  Phone,
  Briefcase,
  Globe,
  User,
  Mic,
  Loader2,
  FileText,
  Send,
  ClipboardList,
  CheckCircle,
  Sparkles,
  Building,
  Paperclip,
  X,
} from "lucide-react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import DashboardLayout from "../dashboard/DashboardLayout";
import DetailRow from "../../components/DetailRow";

interface Visitor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  domain: string;
  transcript: string;
  audio: {
    type: string;
    data: number[];
  };
  audioMimeType?: string;
  createdAt?: string;
  subject?: string;
  body?: string;
  aiSummary?: string;
  enrichedData?: {
    keyPoints: string[];
    actionItems: string[];
    sentiment: string;
  };
}

interface AISummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeInOut" as any },
  },
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as any },
  },
};

// --- Skeleton Loading Component ---
const DetailPageSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12 animate-pulse">
    <header className="text-center">
      <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </header>
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-32 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-32 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

export default function VisitorDetailsPage() {
  const { id } = useParams();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const [summarizing, setSummarizing] = useState(false);
  const [enrichmentMessage, setEnrichmentMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // New state for attachments
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  useEffect(() => {
    if (!id) return;
    fetchVisitor(id);
  }, [id]);

  useEffect(() => {
    if (visitor?.audio?.data) {
      // Convert Buffer to Uint8Array
      const uint8Array = new Uint8Array(visitor.audio.data);
      // Create Blob
      const blob = new Blob([uint8Array], {
        type: visitor.audioMimeType || "audio/webm",
      });
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Cleanup when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [visitor]);

  const fetchVisitor = async (visitorId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/visitor/${visitorId}`
      );
      console.log(res.data);

      setVisitor(res.data as Visitor);
    } catch (err) {
      console.error(err);
      setError(" Failed to fetch visitor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrich = async () => {
    if (!visitor?._id) return;

    setSummarizing(true);
    setEnrichmentMessage(null); // Clear previous messages

    try {
      const res: AxiosResponse<AISummary> = await axios.post(
        `http://localhost:5000/api/visitor/${visitor._id}/enrich`
      );

      const { summary, keyPoints, actionItems, sentiment } = res.data;

      setVisitor((prev) =>
        prev
          ? {
              ...prev,
              aiSummary: summary,
              body: summary, // If you still want to mirror this
              enrichedData: {
                keyPoints,
                actionItems,
                sentiment,
              },
            }
          : null
      );

      setEnrichmentMessage({
        type: "success",
        text: "Summary generated successfully!",
      });
    } catch (err) {
      console.error("Error enriching visitor:", err);
      setEnrichmentMessage({
        type: "error",
        text: "Failed to generate summary. Please try again.",
      });
    } finally {
      setSummarizing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    // Clear the input value to allow re-selecting the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFollowUp = async () => {
    if (!visitor?.email) {
      alert("Visitor has no email to send to.");
      return;
    }
    setEmailStatus("sending");
    try {
      const formData = new FormData();

      // Append each selected file to the FormData
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      // Send FormData with axios.post
      await axios.post(
        `http://localhost:5000/api/visitor/${visitor._id}/email`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEmailStatus("sent");
    } catch (err) {
      console.error(err);
      setEmailStatus("idle");
      alert("Failed to send email. Please try again.");
    }
  };

  if (loading) return <DetailPageSkeleton />;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!visitor)
    return <div className="p-4 text-gray-700">Visitor not found.</div>;
  if (!audioUrl) return null;

  return (
    <DashboardLayout activeLink="visitors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Header */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl text font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center gap-3">
            <ClipboardList className="w-9 h-9 drop-shadow" />
            Visitor Details
          </h1>
        </motion.header>

        {/* Visitor Information */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          // transition={{ delay: 0.1 }}
          className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-8 border border-gray-100 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Visitor Information
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <motion.div variants={item}>
              <DetailRow
                label={
                  <>
                    <User className="inline w-4 h-4 mr-1" />
                    Name
                  </>
                }
                value={visitor.name}
              />
            </motion.div>

            <motion.div variants={item}>
              <DetailRow
                label={
                  <>
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Position
                  </>
                }
                value={visitor.position}
              />
            </motion.div>

            <motion.div variants={item}>
              <DetailRow
                label={
                  <>
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email
                  </>
                }
                value={visitor.email}
              />
            </motion.div>

            <motion.div variants={item}>
              <DetailRow
                label={
                  <>
                    <Phone className="inline w-4 h-4 mr-1" />
                    Mobile
                  </>
                }
                value={visitor.phone}
              />
            </motion.div>

            <motion.div variants={item}>
              <DetailRow
                label={
                  <>
                    <Building className="inline w-4 h-4 mr-1" />
                    Company
                  </>
                }
                value={visitor.company}
              />
            </motion.div>

            <motion.div variants={item}>
              <DetailRow
                label={
                  <>
                    <Globe className="inline w-4 h-4 mr-1" />
                    Domain
                  </>
                }
                value={visitor.domain}
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* AI-Powered Summary */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          // transition={{ delay: 0.2 }}
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 border space-y-4"
        >
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI-Powered Conversation Summary
            </h2>
            <button
              onClick={handleEnrich}
              disabled={summarizing}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {summarizing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {summarizing ? "Generating..." : "Generate Summary"}
            </button>
          </div>

          {/* Status Message */}
          {enrichmentMessage && (
            <div
              className={`p-3 rounded-md text-sm shadow-sm ${
                enrichmentMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {enrichmentMessage.text}
            </div>
          )}

          {/* AI Summary Content */}
          {visitor?.aiSummary ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Summary</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-md leading-relaxed border border-gray-100">
                  {visitor.aiSummary}
                </p>
              </div>

              {Array.isArray(visitor?.enrichedData?.keyPoints) &&
                visitor.enrichedData.keyPoints.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800">Key Points</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {visitor.enrichedData.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {Array.isArray(visitor?.enrichedData?.actionItems) &&
                visitor.enrichedData.actionItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Action Items
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {visitor.enrichedData.actionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {visitor.enrichedData?.sentiment && (
                <div>
                  <h4 className="font-semibold text-gray-800">Sentiment</h4>
                  <p className="text-gray-700">
                    {visitor.enrichedData.sentiment}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No summary available. Click the button above to generate one from
              the transcript.
            </p>
          )}
        </motion.section>

        {/* Conversation Section */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          // transition={{ delay: 0.3 }}
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 border space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <Mic className="w-5 h-5 text-blue-600" />
            Conversation
          </h2>

          <h3 className="text-lg font-medium text-gray-700 flex items-center gap-1">
            <FileText className="w-4 h-4 text-gray-500" /> Transcript
          </h3>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-line border border-gray-100">
            {visitor.transcript || "No transcript available."}
          </p>

          <h3 className="text-lg font-medium text-gray-700 flex items-center gap-1 mt-4">
            <Mic className="w-4 h-4 text-gray-500" /> Audio
          </h3>
          <audio
            controls
            className="w-full rounded-md border border-gray-200 shadow-sm"
          >
            <source
              src={audioUrl}
              type={visitor.audioMimeType || "audio/webm"}
            />
            Your browser does not support the audio element.
          </audio>
        </motion.section>

        {/* Follow-up Section */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          // transition={{ delay: 0.4 }}
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 border border-gray-200 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Suggested Follow-up
          </h2>

          {/* Subject */}
          <div className="relative">
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder=" "
              value={
                visitor.subject ||
                `Following up on our chat at ${new Date(
                  visitor.createdAt || ""
                ).toLocaleDateString()}`
              }
              onChange={(e) =>
                setVisitor({ ...visitor, subject: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-transparent"
            />
            <label
              htmlFor="subject"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Subject
            </label>
          </div>

          {/* Body */}
          <div className="relative">
            <div className="peer w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2  focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 transition resize-none placeholder-transparent min-h-[150px]">
              <div dangerouslySetInnerHTML={{ __html: visitor?.body || "" }} />
            </div>
            <label
              htmlFor="body"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Body
            </label>
          </div>

          {/* File Attachments */}
          <div className="mt-4 flex items-start gap-3 flex-wrap">
            <label
              htmlFor="attachments"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100 transition border border-blue-200"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm font-medium">Attach Files</span>
            </label>
            <input
              type="file"
              id="attachments"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFiles.length > 0 && (
              <div className="space-y-2 w-full sm:w-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 rounded-md px-2 py-1.5 text-sm text-gray-700 shadow-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.name)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={handleFollowUp}
              disabled={emailStatus === "sending" || emailStatus === "sent"}
              className={`px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition-all duration-200 ${
                emailStatus === "sending"
                  ? "bg-blue-400 cursor-not-allowed"
                  : emailStatus === "sent"
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 hover:shadow-lg"
              } text-white`}
            >
              {emailStatus === "idle" && <Send className="w-4 h-4" />}
              {emailStatus === "sending" && (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}
              {emailStatus === "sent" && <CheckCircle className="w-5 h-5" />}
              {emailStatus === "idle" && "Send Email"}
              {emailStatus === "sending" && "Sending..."}
              {emailStatus === "sent" && "Email Sent"}
            </button>
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
