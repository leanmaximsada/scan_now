"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Share, Download } from 'lucide-react';
import Navbar1 from "../../../components/Navbar1";
import Footer from "../../../components/Footer";

const QRCodePage = () => {
  return (
    <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans">
      <Navbar1 />
      <div className="w-10 hidden md:block"></div>
     

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        {/* Navigation Arrows and Card Container */}
        <div className="flex items-center justify-center gap-4 md:gap-16 w-full max-w-4xl">
          
          {/* Left Arrow */}
          <button className="w-12 h-12 bg-[#38BDF8] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#0EA5E9] transition-colors">
            <ChevronLeft size={32} />
          </button>

          {/* Central Card */}
          <div className="relative bg-white rounded-[30px] shadow-xl p-8 w-full max-w-md aspect-square flex flex-col items-center border border-gray-100">


            {/* Decorative Flowers */}
            {/* Top Right */}
            <div className="absolute -top-8 -right-8 w-24 h-24 z-10">
              <div className="relative w-full h-full">
                <Image 
                  src="/logo/romdoul.png" 
                  alt="Flower Decoration" 
                  fill
                  className="object-contain opacity-80"
                />
              </div>
            </div>
            {/* Bottom Left */}
            <div className="absolute -bottom-8 -left-8 w-24 h-24 z-10">
              <div className="relative w-full h-full">
                <Image 
                  src="/logo/romdoul.png" 
                  alt="Flower Decoration" 
                  fill
                  className="object-contain opacity-80 transform rotate-180"
                />
              </div>
            </div>

            {/* Card Content */}
            <h2 className="text-[#38BDF8] text-3xl font-bold mb-6 mt-2">Scan Now</h2>
            
            {/* QR Code Container */}
            <div className="relative w-64 h-64 border-4 border-gray-100 rounded-3xl p-4 flex items-center justify-center">
              {/* Corner marks can be simulated with borders or divs if needed, but the image might have them. 
                  We'll just place the QR code centrally. */}
               <Image 
                src="/logo/qr.png" 
                alt="QR Code" 
                width={200} 
                height={200}
                className="object-contain"
              />
              
              {/* Center Logo Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white p-1 rounded-full shadow-sm">
                   <Image 
                    src="/logo/logo.png" 
                    alt="Center Logo" 
                    width={30} 
                    height={30}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button className="w-12 h-12 bg-[#38BDF8] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#0EA5E9] transition-colors">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-8 mt-12">
          <button className="flex items-center gap-2 bg-[#38BDF8] text-white px-12 py-3 rounded-xl text-xl font-bold shadow-lg hover:bg-[#0EA5E9] transition-colors">
            Share <Share size={24} />
          </button>
          
          <button className="flex items-center gap-2 bg-[#38BDF8] text-white px-12 py-3 rounded-xl text-xl font-bold shadow-lg hover:bg-[#0EA5E9] transition-colors">
            Save <Download size={24} />
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default QRCodePage;
