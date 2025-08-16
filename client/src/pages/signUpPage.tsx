import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Loader2, AtSign, Eye, EyeOff } from "lucide-react";
import Layout from "@/components/Layout";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError(""); // Clear any previous errors
    return true;
  };

  const handleEmailSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Simulate API call for email/password registration
      // In a real application, you would replace this with an actual API call
      // e.g., await axios.post('/api/signup', { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      console.log("Email Sign Up successful:", { email, password });
      // Redirect to dashboard or a success page
      navigate("/dashboard");
    } catch (err) {
      console.error("Email Sign Up error:", err);
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSignUp = async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     // Simulate Google API login
  //     // In a real application, you would integrate Google Sign-In SDK here:
  //     // 1. Load Google Platform Library: <script src="https://apis.google.com/js/platform.js" async defer></script>
  //     // 2. Initialize gapi.auth2.init() with your client ID.
  //     // 3. Trigger GoogleAuth.signIn().
  //     await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

  //     console.log("Google Sign Up successful!");
  //     // Redirect to dashboard or a success page
  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Google Sign Up error:", err);
  //     setError("Failed to sign up with Google. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Layout>
      {/* Using DashboardLayout for consistent styling */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
            Sign Up
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Create your account to get started.
          </p>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full border border-gray-300 bg-white rounded-lg px-4 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all
                  peer-placeholder-shown:top-3.5
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-gray-400
                  peer-focus:-top-2.5
                  peer-focus:text-sm
                  peer-focus:text-blue-600"
              >
                Email Address
              </label>
              <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full border border-gray-300 bg-white rounded-lg px-4 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all
                  peer-placeholder-shown:top-3.5
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-gray-400
                  peer-focus:-top-2.5
                  peer-focus:text-sm
                  peer-focus:text-blue-600"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                className="peer w-full border border-gray-300 bg-white rounded-lg px-4 pt-6 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all
                  peer-placeholder-shown:top-3.5
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-gray-400
                  peer-focus:-top-2.5
                  peer-focus:text-sm
                  peer-focus:text-blue-600"
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <User className="w-5 h-5 mr-2" />
              )}
              Sign Up
            </button>
          </form>

          {/* <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">OR</span>
            </div>
          </div>
            */}
          {/* Google Sign Up Button */}
          {/* <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 font-bold bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Mail className="w-5 h-5 mr-2" /> // Using a generic Google icon
            )}
            Sign up with Google
          </button> */}

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
