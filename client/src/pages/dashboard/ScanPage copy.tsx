import { useState, useRef, useEffect } from "react";

import axios from "axios";

import {
  Camera,
  Loader2,
  RefreshCw,
  ScanLine,
  Mic,
  Square,
  Headphones,
  FileText,
} from "lucide-react";

import DashboardLayout from "./DashboardLayout";

import { useNavigate } from "react-router-dom";

// --- Spinner ---

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
  </div>
);

// --- Types ---

interface GenerativePart {
  inlineData: {
    data: string;

    mimeType: string;
  };
}

interface ScannedData {
  name: string;

  position: string;

  email: string;

  phone: string;

  company: string;

  domain: string;
}

// --- Helpers ---

function fileToGenerativePart(
  base64Data: string,

  mimeType: string
): GenerativePart {
  return {
    inlineData: {
      data: base64Data,

      mimeType,
    },
  };
}

// --- Main Component ---

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [scannedData, setScannedData] = useState<ScannedData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const [isRecordingStop, setIsRecordingStop] = useState(false);

  const [formData, setFormData] = useState<ScannedData>({
    name: "",

    position: "",

    email: "",

    phone: "",

    company: "",

    domain: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (scannedData) {
      setFormData(scannedData);
    }
  }, [scannedData]);

  useEffect(() => {
    let localStream: MediaStream;

    const startCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        setStream(newStream);

        localStream = newStream;
      } catch (err) {
        console.error("Error accessing camera:", err);

        setError(
          "Could not access the camera. Please ensure permissions are granted."
        );
      }
    };

    if (!capturedImage && !stream) {
      startCamera();
    }

    return () => {
      // Clean up the current stream if it exists

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Also stop any new local stream if created in this effect run

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImage, stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;

      const canvas = canvasRef.current;

      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageSrc = canvas.toDataURL("image/jpeg", 0.9);

      setCapturedImage(imageSrc);

      setScannedData(null);

      setError(null);

      stream?.getTracks().forEach((track) => track.stop());
    }
  };

  const scanCard = async () => {
    if (!capturedImage) return;

    setIsLoading(true);

    setError(null);

    try {
      const [meta, base64Data] = capturedImage.split(",");

      const mimeTypeMatch = meta.match(/data:(.*?);/);

      if (!mimeTypeMatch)
        throw new Error("Could not determine image MIME type.");

      const mimeType = mimeTypeMatch[1];

      const prompt = `

You are an expert OCR and data extraction tool.

Extract the following information from the business card image:

- Full Name

- Position

- Email Address

- Phone Number

- Company Name

- Domain



Format the output as a single JSON object with these keys: "name", "position", "email", "phone", "company", "domain".

If a piece of information is missing or not found on the cardd, use a realistic dummy value for that field instead.

`;

      const imageParts = [fileToGenerativePart(base64Data, mimeType)];

      const payload = {
        contents: [
          {
            role: "user",

            parts: [{ text: prompt }, ...imageParts],
          },
        ],
      };

      const apiKey = "AIzaSyB-G866dFyG_qwX2Fgj7gsu0LNHk6hzcIk";

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error("API request failed with status " + response.status);

      const result = await response.json();

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No content returned from the API.");

      const jsonStart = text.indexOf("{");

      const jsonEnd = text.lastIndexOf("}") + 1;

      const jsonString = text.substring(jsonStart, jsonEnd);

      const parsedData: ScannedData = JSON.parse(jsonString);

      setScannedData(parsedData);

      startAudioRecording();
    } catch (err: any) {
      console.error("Error scanning business card:", err);

      setError(`Failed to scan the card: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = async () => {
    setCapturedImage(null);

    setScannedData(null);

    setIsLoading(false);

    setError(null);

    setAudioUrl(null);

    setAudioTranscript(null);

    // Restart the camera

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      setStream(newStream);
    } catch (err) {
      console.error("Error restarting camera:", err);

      setError("Could not restart the camera. Please refresh the page.");
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setAudioBlob(audioBlob);

        const audioURL = URL.createObjectURL(audioBlob);

        setAudioUrl(audioURL);

        // Generate transcript

        await generateTranscript(audioBlob);
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start audio recording:", err);

      setError("Microphone access denied or failed.");
    }
  };

  const stopAudioRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();

      setIsRecording(false);

      setIsRecordingStop(true);
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream

        .getTracks()

        .forEach((track) => track.stop());
    }
  };

  const generateTranscript = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);

      const reader = new FileReader();

      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64data = reader.result as string;

        const [meta, base64] = base64data.split(",");

        const mimeMatch = meta.match(/data:(.*?);/);

        if (!mimeMatch) throw new Error("Invalid audio type");

        const mimeType = mimeMatch[1];

        const prompt = `You are a voice transcription tool. Transcribe the attached audio clearly and concisely, ignoring any background or random noise. Output only the transcripted text. And If the audio contains no actual conversation (i.e., it's silent, unclear, or just noise), output a realistic dummy transcript instead. The dummy transcript should simulate a brief, natural-sounding conversation between an exhibitor and a walk-in booth visitor, focused on recording the visitor’s details and interest.`;

        const audioPart = fileToGenerativePart(base64, mimeType);

        const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }, audioPart] }],
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=AIzaSyB-G866dFyG_qwX2Fgj7gsu0LNHk6hzcIk`,

          {
            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Transcript not received");

        setAudioTranscript(text.trim());
      };
    } catch (err: any) {
      console.error("Transcript Error:", err);

      setError("Could not transcribe audio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    setError("");

    try {
      const data = new FormData();

      // Append form fields

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append transcript

      if (audioTranscript) {
        data.append("transcript", audioTranscript);
      }

      // Append audio file

      if (audioBlob) {
        data.append("audio", audioBlob, "recording.webm");
      }

      const res = await axios.post<{ _id: string }>(
        `${import.meta.env.VITE_API_URL}/api/visitor`,

        data,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate(`/visitor/${res.data._id}`);
    } catch (err) {
      console.error("Backend Error:", err);

      setError("❌ Failed to save visitor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout activeLink="scan">
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-6xl">
          <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Camera className="w-6 h-6 text-blue-500" /> Scan Visitor
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Camera and buttons */}

            <div className="self-start w-1/2">
              {/* Camera Preview */}

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 shadow-inner mb-6">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                <canvas ref={canvasRef} style={{ display: "none" }} />

                <div className="absolute inset-0 border-4 border-dashed border-white/50 m-4 rounded-xl pointer-events-none"></div>
              </div>

              {/* Buttons */}

              <div className="flex justify-center space-x-4 mb-6">
                {!capturedImage ? (
                  <button
                    onClick={capturePhoto}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="w-5 h-5 mr-2" /> Capture
                  </button>
                ) : (
                  <>
                    <button
                      onClick={scanCard}
                      disabled={isLoading}
                      className={`flex items-center px-6 py-3 font-semibold rounded-full shadow-lg transition-colors ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <ScanLine className="w-5 h-5 mr-2" />
                      )}
                      Scan Card
                    </button>

                    <button
                      onClick={reset}
                      className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" /> Retake
                    </button>
                  </>
                )}
              </div>

              {/* Audio recording status */}

              {isRecording && (
                <div className="flex flex-col items-center mt-4">
                  <div className="flex items-center gap-2 text-red-600 mb-3">
                    <Mic className="w-6 h-6 animate-pulse" />

                    <div className="flex items-end gap-[2px] h-6">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-red-500 rounded ${
                            i % 2 === 0
                              ? "animate-wave-short"
                              : "animate-wave-tall"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={stopAudioRecording}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    Stop Recording
                  </button>
                </div>
              )}
            </div>

            {/* Right: Results and form */}

            {isRecordingStop && scannedData && (
              <form onSubmit={handleSubmit} className="flex-1">
                {isRecordingStop && isLoading && <LoadingSpinner />}

                {error && (
                  <div className="text-center text-red-500 font-medium mb-4">
                    {error}
                  </div>
                )}

                {isRecordingStop && scannedData && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-700 mb-4">
                      Extracted Information
                    </h2>

                    <div className="space-y-4">
                      {[
                        "name",

                        "position",

                        "email",

                        "phone",

                        "company",

                        "domain",
                      ].map((field) => {
                        const value =
                          formData[field as keyof typeof formData] || "";

                        const id = `input-${field}`;

                        return (
                          <div key={field} className="relative">
                            <input
                              id={id}
                              type="text"
                              value={value}
                              placeholder=" "
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,

                                  [field]: e.target.value,
                                }))
                              }
                              className="peer w-full border border-gray-300 bg-white rounded-md px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                            <label
                              htmlFor={id}
                              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all

peer-placeholder-shown:top-3.5

peer-placeholder-shown:text-base

peer-placeholder-shown:text-gray-400

peer-focus:-top-2.5

peer-focus:text-sm

peer-focus:text-blue-600"
                            >
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {audioUrl && (
                  <div className="mt-8 space-y-4">
                    <div>
                      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                        <Headphones className="w-5 h-5 text-blue-500" />
                        Recorded Audio
                      </h2>

                      <audio
                        controls
                        src={audioUrl}
                        className="w-full rounded-lg border"
                      />
                    </div>

                    {audioTranscript && (
                      <div>
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          Transcript
                        </h2>

                        <div className="relative">
                          <textarea
                            id="transcript"
                            value={audioTranscript}
                            onChange={(e) => setAudioTranscript(e.target.value)}
                            rows={4}
                            placeholder=" "
                            className="peer w-full border border-gray-300 bg-white rounded-md px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          />

                          <label
                            htmlFor="transcript"
                            className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all

peer-placeholder-shown:top-3.5

peer-placeholder-shown:text-base

peer-placeholder-shown:text-gray-400

peer-focus:-top-2.5

peer-focus:text-sm

peer-focus:text-blue-600"
                          >
                            Transcript
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScanPage;
