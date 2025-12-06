"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import { Footer } from "@/components/Footer";
import { Mail, Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { DeveloperNavbar } from "@/components/DeveloperNavbar";

type Step = "email" | "verification";

interface ApiError {
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Dynamic import of wallet connect button to avoid SSR issues
const WalletConnectButton = dynamic(
  () => import("@/components/WalletConnectButton").then((mod) => mod.WalletConnectButton),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-lg bg-white/5 border border-white/10 font-semibold text-white opacity-50 flex items-center justify-center gap-3"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Wallet...
      </button>
    )
  }
);

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Email flow state
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to send verification code");
      }

      const data = await response.json();
      setToken(data.token);
      setSuccess("Verification code sent to your email");
      setStep("verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...verificationCode];
    newCode[index] = value.toUpperCase();
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).toUpperCase();
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setVerificationCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((c) => !c);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-character code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, code }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Invalid verification code");
      }

      const data = await response.json();

      // Store in auth store
      login(data.accessToken, data.developer, "email");

      setSuccess("Login successful! Redirecting...");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setVerificationCode(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-[#5800C3]/30">
      <DeveloperNavbar />

      <div className="container mx-auto px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              {step === "email" ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-zinc-400">
              {step === "email"
                ? "Sign up to access the DataAPI platform"
                : `Enter the 6-character code sent to ${email}`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-zinc-300 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="developer@example.com"
                          className="w-full h-12 pl-12 pr-4 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#5800C3] focus:border-transparent transition-all"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="h-12 w-full rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Send Verification Code
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-[#0d0d0d] px-4 text-zinc-500">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* WalletConnect Button */}
                  <WalletConnectButton />
                </motion.div>
              ) : (
                <motion.div
                  key="verification-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleVerifyCode} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-4 text-center">
                        Verification Code
                      </label>
                      <div
                        className="flex gap-2 justify-center"
                        onPaste={handlePaste}
                      >
                        {verificationCode.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleCodeChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            aria-label={`Verification code digit ${index + 1}`}
                            className="w-12 h-14 text-center text-xl font-mono font-bold rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5800C3] focus:border-transparent transition-all uppercase"
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || verificationCode.join("").length !== 6}
                      className="h-12 w-full rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Verify & Login
                          <CheckCircle className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Use a different email
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 text-sm"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-sm text-zinc-500"
          >
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#C2C4F9] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#C2C4F9] hover:underline">
              Privacy Policy
            </a>
          </motion.p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
