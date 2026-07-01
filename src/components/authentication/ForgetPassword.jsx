import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API } from "../../utils/api";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}api/auth/forget-password`, { email }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      }
      );



      if (response.data.status === 1) {
        toast.success(response.data.message || "Password reset email sent successfully", {
          autoClose: 3000
        });
        setEmail("");
        // Start navigation timer regardless of toast closing
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=500')] bg-cover bg-center opacity-20"></div>
          <div className="relative py-6 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-amber-500/10 to-red-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-amber-600"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h2 className="text-xl font-bold text-amber-800 font-serif">
              Forgot Password
            </h2>
            <p className="text-sm text-amber-700">
              Enter your email to reset your password
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Link
            to="/login"
            className="flex items-center text-sm text-amber-600 hover:text-amber-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sign In
          </Link>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-amber-800"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-amber-500" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 text-gray-500 py-2.5 rounded-lg border border-amber-200 bg-amber-50 focus:border-amber-300 focus:ring-amber-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-medium py-2.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="flex items-center justify-center pt-4">
            <div className="flex-grow h-px bg-amber-200"></div>
            <span className="px-3 text-sm text-amber-700">or</span>
            <div className="flex-grow h-px bg-amber-200"></div>
          </div>

          <div className="text-center pt-4 border-t border-amber-200">
            <p className="text-sm text-amber-700">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-amber-600 hover:text-amber-800 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;