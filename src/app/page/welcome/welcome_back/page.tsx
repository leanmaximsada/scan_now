"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar1 from "../../../components/Navbar1";
import Footer from "../../../components/Footer";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/app/lib/supabase/client";

export default function WelcomePage() {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    const loadUserName = async () => {
      if (!user) return;

      try {
        // Try to get full_name from users table
        const { data: userData } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (userData?.full_name) {
          setUserName(userData.full_name);
        } else if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        }
      } catch (err) {
        // Fallback to metadata if database query fails
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        }
      }
    };

    loadUserName();
  }, [user]);

  return (
     <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans relative">
        <Navbar1 />

      {/* Logo Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 relative mt-[-100]">
        <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
        <img src="/logo/logo.png" alt="Logo" className="h-30 w-auto mt-2 mb-3" />
        <h1 className="text-xl font-bold text-[#61A9E5]">Welcome back, {userName}!</h1>
      
      </div>

      {/* Welcome Card */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 text-center border border-gray-300">
        <h2 className="text-md font-bold text-gray-900 mt-[-20] mb-[1] mb-4">You are now signed in</h2>
        <p className="text-xs text-gray-600 mb-6">Your dashboard awaits!</p>

        {/* Wallet Icon */}
        <div className="flex justify-center mb-6">
  <div 
    className="h-12 w-12 bg-[#61A9E5]" // This sets the actual color
    style={{
      maskImage: 'url(/logo/tick-circle.svg)',
      WebkitMaskImage: 'url(/logo/tick-circle.svg)',
      maskRepeat: 'no-repeat',
      maskSize: 'contain'
    }}
  />
</div>

        {/* Get Started Button */}
        <Link href="/dashboard"> 
        <button className="font-bold w-full py-3 px-6 bg-[#38B6FF] text-white font-medium rounded-lg shadow-md hover:brightness-95 transition">
          Go to Dashboard
        </button></Link>
      </div>
    </div>
    </div>
      <Footer />
    </div>
  );
}
