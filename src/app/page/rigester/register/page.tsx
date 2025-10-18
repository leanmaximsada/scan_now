"use client";

import React from "react";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/page/rigester/register/verifyemail');
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-4">
      {/* Back Arrow */}
      <div className="absolute top-4 left-4">
        <button className="p-2 text-[#38B6FF] hover:bg-[#38B6FF]/10 rounded-full transition">
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
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen ">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex justify-center mb-8">
            <img src="/logo/logo.png" alt="Menu QR" className="h-40 w-auto translate-y-1" />
          </div>
          <h1 className="text-2xl font-bold text-[#38B6FF] text-center"></h1>
        </div>

        {/* Registration Form Card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 -translate-y-12">
          <h2 className="text-2xl font-bold text-center text-black mb-8 ">
            Register Your Account
          </h2>

          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black mb-2"
              >
                Confirm Your Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
              />
            </div>

            {/* Register Button (moved slightly lower) */}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-4 px-6 bg-[#38B6FF] text-white font-bold rounded-lg shadow-md hover:brightness-95 transition mt-3 translate-y-[2px]"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
