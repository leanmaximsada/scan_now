"use client";
import React from "react";
import Navbar1 from "../../../components/Navbar1";
import Footer from "../../../components/Footer";
const GetStarted: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans">
      <Navbar1 />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto">

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img src="/logo/logo.png" alt="Menu QR" className="h-40 w-auto" />
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <a
          href="/page/rigester/register"
          className="w-full py-4 px-6 bg-[#38B6FF] text-white font-bold rounded-lg border border-gray-300 shadow-sm hover:brightness-95 transition block text-center"
        >
          Register
        </a>

        <a
          href="/page/login"
          className="w-full py-4 px-6 bg-[#38B6FF] text-white font-bold rounded-lg border border-gray-300 shadow-sm hover:brightness-95 transition block text-center"
        >
          Login
        </a>
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
};

export default GetStarted;
