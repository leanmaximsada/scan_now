"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar1 from "../../../components/Navbar1";
import Footer from "../../../components/Footer";

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/page/rigester/register/verifyemail');
  };

  return (
    <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans relative">
      <Navbar1 />

      <div className="flex flex-col items-center justify-center p-20 ">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex justify-center mb-12">
            <img src="/logo/logo.png" alt="Menu QR" className="h-30 w-auto translate-y-1" />
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 -translate-y-12 border border-gray-300">
          <h2 className="text-xl font-bold text-center text-black mb-6 ">
            Register Your Account
          </h2>

          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email"className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input type="email" id="email" placeholder="Enter Your Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"/>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
                <input type="password" id="password" placeholder="Value" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"/>
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
            Create Account
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
