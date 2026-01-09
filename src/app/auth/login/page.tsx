import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
// import { useRouter } from "next/navigation"; // Use 'next/router' if using Pages Router

export default function Login() {
  return (
    <div className="bg-[#EFFFFF]">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-20 min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 -translate-y-12">
          <h2 className="text-sm font-bold font-sans text-center text-black mb-5 mt-[-20]">
            Sign In to Your Account
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
            

            {/* Register Button (moved slightly lower) */}
            <Link href="/page/welcome/welcome_back">
            <button
              type="button"
              className="w-full py-4 px-6 bg-[#38B6FF] 
              text-white font-bold rounded-lg shadow-md hover:brightness-95 transition mt-3 translate-y-[2px]"
            >
              Sign in
            </button>
            </Link>
            <h3 className="underline font-light text-black font-sans mt-2">
              <Link href="/auth/verify_email">Forgot Password?</Link>
            </h3>
            <p className="font-sans font-light  text-black text-xs">Our Term of Service you can find by this <Link href="/page/terms">link</Link>. THis site is protected by reCAPTCHA and the Google <Link href="https://policies.google.com/privacy">Privacy Policy</Link> and <Link href="https://policies.google.com/terms">Terms of Service</Link> apply.
            </p>
            </form>
        </div>
        <Footer />
    </div>
    </div>
  );
}
