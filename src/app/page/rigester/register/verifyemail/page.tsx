"use client";

import React from "react";
import { useRouter } from "next/navigation";

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();

  const handleVerify = () => {
    router.push('/page/rigester/register/welcome');
  };
  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col items-center justify-center p-6 relative">
      {/* Back Arrow */}
      <button className="absolute top-6 left-6 p-2 text-[#38B6FF] hover:bg-[#38B6FF]/10 rounded-full transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8 mt-10">
        <img src="/logo/logo.png" alt="Logo" className="h-40  w-auto mb-3" />
        <h1 className="text-2xl font-bold text-[#38B6FF]"></h1>
      </div>

      {/* Card Section */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Verify your Email</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the confirmation we sent to your email ending with{" "}
          <span className="font-medium">****168@gmail.com</span>
        </p>

        {/* Code Input */}
        <input
          type="text"
          placeholder="--- --- --- --- --- ---"
          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent mb-4"
        />

        {/* Resend code link */}
        <button className="text-sm text-[#38B6FF] hover:underline mb-6">
          Resend code
        </button>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button 
            onClick={handleVerify}
            className="px-6 py-2 bg-[#38B6FF] text-white font-medium rounded-md shadow hover:brightness-95 transition"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
