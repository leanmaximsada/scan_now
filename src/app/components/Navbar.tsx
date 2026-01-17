"use client";

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#EFFFFF] shadow-sm">
      <a href="/">
        <img 
          src="/logo/logo.png" 
          alt="Scan Now Logo" 
          className="w-12 mb-[-5] mt-[-5] h-auto object-contain pointer-events-none" />
      </a> 

      
      <div className="flex space-x-20 text-gray-700 mt-1 mb-1">
        <a href="/page/examplemenu" className="text-l hover:text-[#38B6FF]" >Example of Menu</a>
        <a href="/page/pricing" className="text-l hover:text-[#38B6FF]">Pricing</a>
        <a href="/page/contact" className="text-l hover:text-[#38B6FF]" >Contact us</a>
      </div>

      <div className="flex items-center gap-5">
        {loading ? (
          // Show loading state or nothing while checking auth
          <div className="w-[140px]"></div>
        ) : user ? (
          // Show "Go to dashboard" button if user is logged in
          <Link 
            href="/dashboard" 
            className="inline-flex mb-[-10] mt-[-10] px-4 py-2 rounded-lg border border-[#38b6ff] bg-[#38b6ff] text-white hover:brightness-95 shadow-sm shadow-[#38b6ff]/30 transition w-40 items-center justify-center font-medium"
          >
            Go to dashboard
          </Link>
        ) : (
          // Show normal buttons if user is not logged in
          <>
            <Link 
              href="/auth/login" 
              className="hidden mb-[-10] mt-[-10] sm:inline-flex px-4 py-2 rounded-lg border border-black text-[#38b6ff] hover:bg-[#38b6ff]/10 transition w-[120px] items-center justify-center font-medium"
            >
              Sign in
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-flex mb-[-10] mt-[-10] px-4 py-2 rounded-lg border border-[#38b6ff] bg-[#38b6ff] text-white hover:brightness-95 shadow-sm shadow-[#38b6ff]/30 transition w-[120px] items-center justify-center font-medium"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
    