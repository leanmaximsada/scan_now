"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import Navbar1 from "@/app/components/Navbar1";

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();

  const handleVerify = () => {
    router.push('/page/welcome');
  };
  return (
       <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans relative">
  <Navbar1 />

  {/* CENTER CONTENT BETWEEN NAVBAR & FOOTER */}
  <div className="flex-1 flex items-center justify-center px-4 relative">
    <div className="w-full max-w-sm mx-auto">

      {/* LOGO */}
      <div className="flex flex-col items-center mb-8">
        <img src="/logo/logo.png" alt="Logo" className="h-30 w-auto mb-3" />
      </div>

      {/* CARD */}
      <div className="bg-white w-full rounded-lg shadow-md p-8 text-center border border-gray-300">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Verify your Email
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Enter the confirmation we sent to your email ending with{" "}
          <span className="font-medium">****168@gmail.com</span>
        </p>

        {/* CODE INPUT */}
        <input
          type="text"
          placeholder="--- --- --- --- --- ---"
          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-center tracking-widest
                     focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent mb-4"
        />

        {/* RESEND */}
        <button className="text-sm text-[#38B6FF] hover:underline mb-6">
          Resend code
        </button>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>

          <button
            onClick={handleVerify}
            className="px-6 py-2 bg-[#38B6FF] text-white font-medium rounded-md shadow hover:brightness-95 transition"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>

  );
};

export default VerifyEmailPage;


