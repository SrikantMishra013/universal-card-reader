import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import {
  Camera,
  Loader2,
  RefreshCw,
  ScanLine,
  Mic,
  Square,
  FileText,
  X,
  Headphones,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ApiResponsePart {
  text: string;
}

interface ApiResponseContent {
  parts: ApiResponsePart[];
}

interface ApiResponseCandidate {
  content: ApiResponseContent;
}
// interface GenerativePart {
//   inlineData: { data: string; mimeType: string };
// }

interface GeminiApiResponse {
  candidates?: ApiResponseCandidate[];
}

interface ScannedData {
  name: string;
  position: string;
  email: string;
  phone: string;
  company: string;
  domain: string;
}

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center p-4">
//     <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
//   </div>
// );

const StepIndicator = ({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) => (
  <div className="flex justify-center items-center mb-6">
    {[...Array(totalSteps)].map((_, index) => {
      const isActive = step > index;
      return (
        <div key={index} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: isActive ? 1.1 : 0.8,
              opacity: isActive ? 1 : 0.5,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              isActive ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </motion.div>
          {index < totalSteps - 1 && (
            <motion.div
              initial={{ width: 64, backgroundColor: "#D1D5DB" }}
              animate={{
                width: isActive ? 64 : 32,
                backgroundColor: isActive ? "#2563EB" : "#D1D5DB",
              }}
              transition={{ duration: 0.3 }}
              className={`h-1 rounded`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const ErrorToast = ({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) => {
  if (!message) return null;
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-lg shadow-xl flex items-center gap-4"
        >
          <div className="flex-1">
            <p className="font-bold">Error</p>
            <p className="text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Component ---
const ScanPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [formData, setFormData] = useState<ScannedData>({
    name: "",
    position: "",
    email: "",
    phone: "",
    company: "",
    domain: "",
  });

  const navigate = useNavigate();

  // Step 1: Capture, Step 2: Review, Step 3: Submit
  const [currentStep, setCurrentStep] = useState(1);

  // Helper to convert file to Gemini API format
  const fileToGenerativePart = (base64Data: string, mimeType: string) => ({
    inlineData: { data: base64Data, mimeType },
  });

  // --- Effects ---
  useEffect(() => {
    // Sync scanned data with form data
    if (scannedData) {
      setFormData(scannedData);
      setCurrentStep(2);
    }
  }, [scannedData]);

  useEffect(() => {
    // Start camera stream when component mounts or resets
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
        setError("Could not access the camera. Please grant permissions.");
      }
    };

    if (currentStep === 1 && !stream) {
      startCamera();
    }

    // return () => {
    //   if (localStream) localStream.getTracks().forEach((track) => track.stop());
    // };

    // Cleanup function to stop tracks when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentStep, stream]);

  // --- Handlers ---
  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageSrc = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(imageSrc);

      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCaptured(true);
      // setCurrentStep(2);
      // handleScanCard(imageSrc);
    }
  };

  const handleScanCard = async (imageSrc: string) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${
      import.meta.env.VITE_GEMINI_API_KEY
    }`;

    try {
      const [, base64Data] = imageSrc.split(",");
      const prompt = `You are an expert data extraction tool. Extract the following from the business card: Full Name, Position, Email, Phone Number, Company Name, and Domain. Format the output as a single JSON object: {"name": "", "position": "", "email": "", "phone": "", "company": "", "domain": ""}. If a piece of information is missing or not found on the cardd, use a realistic dummy value for that field instead.`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              fileToGenerativePart(base64Data, "image/jpeg"),
            ],
          },
        ],
      };
      const response: AxiosResponse<GeminiApiResponse> = await axios.post(
        apiUrl,
        payload
      );
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No content returned from the API.");
      const jsonString = text.substring(
        text.indexOf("{"),
        text.lastIndexOf("}") + 1
      );
      const parsedData: ScannedData = JSON.parse(jsonString);

      setScannedData(parsedData);
      setCurrentStep(2);
      startAudioRecording();
    } catch (err) {
      console.error("Scan Error:", err);
      setError("Failed to scan the card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    setScannedData(null);
    setAudioUrl(null);
    setAudioTranscript(null);
    setError(null);
    setIsCaptured(false);
    setFormData({
      name: "",
      position: "",
      email: "",
      phone: "",
      company: "",
      domain: "",
    });
    // Restart the camera

    if (currentStep === 1) {
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
    } else {
      setCurrentStep((prev) => prev - 1);
    }

    // stopAudioRecording();
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        await generateTranscript(audioBlob);
        setCurrentStep(3);
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
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (mediaRecorderRef.current?.stream) {
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
        const [, base64] = (reader.result as string).split(",");
        const prompt = `You are a voice transcription tool. Transcribe the attached audio clearly and concisely, ignoring any background or random noise. Output only the transcripted text. And If the audio contains no actual conversation (i.e., it's silent, unclear, or just noise), output a realistic dummy transcript instead. The dummy transcript should simulate a brief, natural-sounding conversation between an exhibitor and a walk-in booth visitor, focused on recording the visitor’s details and interest. Use this visitor ${formData}`;
        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                fileToGenerativePart(base64, "audio/webm"),
              ],
            },
          ],
        };
        const response: AxiosResponse<GeminiApiResponse> = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${
            import.meta.env.VITE_GEMINI_API_KEY
          }`,
          payload
        );
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setAudioTranscript(text!.trim());
      };
    } catch (err) {
      console.error("Transcript Error:", err);
      setError("Could not transcribe audio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (audioTranscript) data.append("transcript", audioTranscript);
      if (audioBlob) data.append("audio", audioBlob, "recording.webm");

      const res = await axios.post(`http://localhost:5000/api/visitor`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/visitor/${res.data._id}`);
    } catch (err) {
      console.error("Backend Error:", err);
      setError("Failed to save visitor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => (
    <AnimatePresence mode="wait">
      {(() => {
        switch (currentStep) {
          case 1:
            return (
              // Step 1: Capture and Scan
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center p-6 pt-5 bg-white rounded-3xl shadow-2xl border border-gray-100"
              >
                <h2 className="text-3xl font-extrabold  mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  Capture the Business Card
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  Align the business card within the frame to get the best
                  results.
                </p>

                {/* Camera/Preview Container */}
                <div className="relative aspect-video w-full max-w-lg rounded-3xl overflow-hidden bg-gray-700 shadow-xl mb-8">
                  <AnimatePresence mode="wait">
                    {isCaptured && capturedImage ? (
                      <motion.img
                        key="img"
                        src={capturedImage}
                        alt="Captured"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <motion.video
                        key="video"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </AnimatePresence>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  {/* Alignment Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[95%] h-[95%] border-4 border-dashed border-white/70 rounded-xl animate-pulse-border"></div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 min-h-[50px] items-center">
                  {isCaptured ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4"
                    >
                      <button
                        onClick={() =>
                          capturedImage && handleScanCard(capturedImage)
                        }
                        disabled={isLoading}
                        className={`flex items-center px-6 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105
                ${
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
                        disabled={isLoading}
                        onClick={handleRetake}
                        className={`flex items-center px-6 py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                      >
                        <RefreshCw className="w-5 h-5 mr-2" /> Retake
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={handleCapturePhoto}
                      disabled={isLoading || !stream}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="group relative flex items-center px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-full shadow-lg overflow-hidden
             transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed
             hover:shadow-xl hover:shadow-blue-500/50"
                    >
                      <span className="absolute inset-0 bg-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 mr-3 animate-spin relative z-10" />
                      ) : (
                        <Camera className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-3 relative z-10" />
                      )}
                      <span className="relative z-10">Capture</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          case 2:
            return (
              // Step 2: Record Audio
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-3xl shadow-xl border border-gray-200"
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-2 tracking-tight">
                  Record Your Conversation
                </h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">
                  Capture key details and notes from your chat. We'll transcribe
                  it for you automatically.
                </p>

                {/* Visual Indicator for Recording State */}
                <div
                  className={`relative flex items-center justify-center w-48 h-48 rounded-full mb-8 transition-all duration-500 ease-in-out ${
                    isRecording ? "bg-red-100" : "bg-blue-100"
                  }`}
                >
                  <motion.div
                    animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute inset-4 rounded-full ${
                      isRecording
                        ? "bg-red-200 opacity-75"
                        : "bg-blue-200 opacity-75"
                    }`}
                  />
                  <motion.div
                    animate={{ scale: isRecording ? [1, 1.4, 1] : 1 }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute inset-8 rounded-full ${
                      isRecording
                        ? "bg-red-300 opacity-50"
                        : "bg-blue-300 opacity-50"
                    }`}
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: isRecording ? 360 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                      isRecording
                        ? "bg-red-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {isRecording ? (
                      <Mic className="w-12 h-12" />
                    ) : (
                      <Mic className="w-12 h-12" />
                    )}
                  </motion.div>
                </div>

                {/* Status Text with Dynamic Content */}
                <div className="flex flex-col items-center mb-6">
                  <p
                    className={`text-xl font-bold transition-colors duration-500 ${
                      isRecording
                        ? "text-red-700 animate-pulse"
                        : "text-blue-700"
                    }`}
                  >
                    {isRecording
                      ? "Recording in progress..."
                      : "Ready to record"}
                  </p>
                </div>

                {/* Control Button */}
                <button
                  onClick={
                    isRecording ? stopAudioRecording : startAudioRecording
                  }
                  disabled={isLoading}
                  className={`group flex items-center px-10 py-4 font-bold text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out
      disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105
      ${
        isRecording
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-green-600 text-white hover:bg-green-700"
      }
    `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing...
                    </>
                  ) : isRecording ? (
                    <>
                      <Square className="w-6 h-6 mr-3" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6 mr-3" />
                      Start Recording
                    </>
                  )}
                </button>
              </motion.div>
            );
          case 3:
            return (
              // Step 3: Review and Submit Form
              <motion.form
                key="step3"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 64 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -64 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col p-6 bg-gray-50 rounded-3xl shadow-xl border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-700 mb-4">
                      Extracted Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "name",
                        "position",
                        "email",
                        "phone",
                        "company",
                        "domain",
                      ].map((field) => (
                        <div key={field} className="relative">
                          <input
                            id={field}
                            type="text"
                            value={formData[field as keyof ScannedData] || ""}
                            placeholder=" "
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field]: e.target.value,
                              })
                            }
                            className="peer w-full border border-gray-300 bg-white rounded-md px-3 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <label
                            htmlFor={field}
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
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Conversation Transcript
                    </h2>
                    <textarea
                      id="transcript"
                      value={audioTranscript || ""}
                      onChange={(e) => setAudioTranscript(e.target.value)}
                      rows={8}
                      placeholder="Transcript will appear here..."
                      className="w-full border border-gray-300 bg-white rounded-md p-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                    />
                    {audioUrl && (
                      <div>
                        <h2 className="flex items-center gap-2 text-lg font-bold mt-4 text-gray-800 mb-2">
                          <Headphones className="w-5 h-5 text-blue-500" />
                          Recorded Audio
                        </h2>

                        <audio
                          controls
                          src={audioUrl}
                          className="w-full rounded-full shadow-lg overflow-hidden bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </motion.form>
            );
          default:
            return null;
        }
      })()}
    </AnimatePresence>
  );

  return (
    <DashboardLayout activeLink="scan">
      <div className="relative">
        {currentStep > 1 && (
          <button
            onClick={handleRetake}
            className="absolute top-4 left-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline hover:text-blue-800 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        <div className="animate-gradient-bg bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-10 pt-8 w-full max-w-6xl">
          <StepIndicator step={currentStep} totalSteps={3} />
          {renderStep()}
        </div>
      </div>
      <ErrorToast message={error} onClose={() => setError(null)} />
    </DashboardLayout>
  );
};

export default ScanPage;
