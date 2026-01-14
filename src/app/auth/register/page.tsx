"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/auth/verify_email");
  };

  return (
    <div className="relative min-h-screen bg-[#EFFFFF] overflow-hidden">
      {/* Navbar stays normal */}
      <Navbar />

      {/* Main content ABOVE footer */}
      <main className="relative z-10 flex flex-col mb-[-100] items-center justify-center min-h-screen">
        {/* Logo */}
        {/* <div className=""> */}
          {/* <div className="flex justify-center mb-8">
            <img
              src="/logo/logo.png"
              alt="Menu QR"
              className="h-30 w-auto"
            />
          </div> */}
        {/* </div> */}

        {/* Register Card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg  p-8 -translate-y-12">
          <h2 className="text-2xl font-bold text-center text-black mb-8">
            Register Your Account
          </h2>

          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm Your Password
              </label>
              <input
                type="password"
                placeholder="Value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              />
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-4 bg-[#38B6FF] text-white font-bold rounded-lg
                         shadow-md hover:brightness-95 transition"
            >
              Register
            </button>
          </form>
        </div>
      </main>

      {/* Footer is BACKGROUND layer */}
      <Footer />
    </div>
  );
};

export default RegisterPage;
