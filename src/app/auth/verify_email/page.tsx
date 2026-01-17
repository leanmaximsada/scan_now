"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/components/Footer";
import Navbar1 from "@/app/components/Navbar1";
import { supabase } from "@/app/lib/supabase/client";

const VerifyEmailContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Check if user came from email verification link
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (token && type === "email") {
      // Handle email verification from link
      handleEmailVerification(token);
    } else {
      // Get current user's email if logged in
      getCurrentUserEmail();
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        setSuccess(true);
        setMessage("Email verified successfully! Redirecting...");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          router.push("/page/welcome");
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams, router]);

  const getCurrentUserEmail = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      } else {
        // Try to get from session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
      }
    } catch (err) {
      console.error("Error getting user email:", err);
    }
  };

  const handleEmailVerification = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
      } else {
        setSuccess(true);
        setMessage("Email verified successfully! Redirecting...");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          router.push("/page/welcome");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      // Try to get user email first
      let userEmail: string | null = email;
      if (!userEmail) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userEmail = user?.email || null;
      }

      if (!userEmail) {
        setError("Unable to find your email. Please use the verification link from your email.");
        setLoading(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: userEmail, // TypeScript knows userEmail is string here due to the check above
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
      } else {
        setSuccess(true);
        setMessage("Email verified successfully! Redirecting...");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          router.push("/page/welcome");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError(null);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setError("No user email found. Please register again.");
        setResendLoading(false);
        return;
      }

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify_email`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setMessage("Verification code has been resent to your email!");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Resend error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  const maskEmail = (email: string | null) => {
    if (!email) return "your email";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    const masked = localPart.slice(0, 2) + "***" + "@" + domain;
    return masked;
  };

  return (
    <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans relative">
      <Navbar1 />

      {/* CENTER CONTENT BETWEEN NAVBAR & FOOTER */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <div className="w-full max-w-sm mx-auto">
          {/* CARD */}
          <div className="relative z-10 bg-white w-full rounded-lg shadow-md p-8 text-center border border-gray-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Verify your Email
            </h2>

            {success ? (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {message || "Email verified successfully!"}
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Enter the confirmation code we sent to{" "}
                  <span className="font-medium">{maskEmail(email)}</span>
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                {/* CODE INPUT */}
                <form onSubmit={handleOtpVerify}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      // Only allow numbers and limit to 6 digits
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(value);
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full text-black border border-gray-300 rounded-lg py-3 px-4 text-center tracking-widest text-2xl
                               focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent mb-4"
                    maxLength={6}
                    disabled={loading}
                  />

                  {/* RESEND */}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendLoading}
                    className="text-sm text-[#38B6FF] hover:underline mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? "Sending..." : "Resend code"}
                  </button>

                  {/* ACTION BUTTONS */}
                  <div className="flex justify-center gap-4">
                    <a href="/auth/register">
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </a>

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="px-6 py-2 bg-[#38B6FF] text-white font-medium rounded-md shadow hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const VerifyEmailPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;


