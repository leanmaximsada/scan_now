"use client";
import React from "react";
import Link from "next/link";
import { User, Home, Bookmark, MoreHorizontal, Search, Check, Plus } from "lucide-react";
import Footer from "../../components/Footer";
import Navbar1 from "../../components/Navbar1";

const menuItems = [
  { id: 1, name: "Soup", image: "/logo/bay srob.jpg" }, // Using placeholders based on availability
  { id: 2, name: "Fried rice", image: "/logo/rice.jpg" },
  { id: 3, name: "Bay srob", image: "/logo/bay srob.jpg" },
  { id: 4, name: "Honey duck", image: "/logo/chicken.jpg" },
  { id: 5, name: "Soup", image: "/logo/bay srob.jpg" },
  { id: 6, name: "Fried rice", image: "/logo/rice.jpg" },
  { id: 7, name: "Bay srob", image: "/logo/bay srob.jpg" },
  { id: 8, name: "Honey duck", image: "/logo/chicken.jpg" },
  { id: 9, name: "Soup", image: "/logo/bay srob.jpg" },
  { id: 10, name: "Fried rice", image: "/logo/rice.jpg" },
  { id: 11, name: "Bay srob", image: "/logo/bay srob.jpg" },
];

const ExampleMenuPage = () => {
  return (
    <div className="min-h-screen bg-[#EFFFFF] flex flex-col font-sans">
      <Navbar1/>
      {/* Main Content */}
      <main className="flex-grow flex justify-center items-start p-4 md:p-8">
        <div className="w-full max-w-[1400px] bg-gradient-to-r from-white via-[#E6F7FF] to-[#38B6FF] rounded-[40px] shadow-2xl overflow-hidden flex min-h-[900px]">
          
          {/* Sidebar */}
          <div className="w-24 flex flex-col items-center py-12 space-y-8 flex-shrink-0">
            <div className="p-3 rounded-full bg-gray-300/50 hover:bg-gray-300 cursor-pointer">
              <User className="w-6 h-6 text-gray-700" />
            </div>
            <div className="p-3 rounded-full bg-[#38B6FF] shadow-lg cursor-pointer">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div className="p-3 cursor-pointer">
              <Bookmark className="w-7 h-7 text-black" />
            </div>
            <div className="p-3 mt-4 cursor-pointer">
              <MoreHorizontal className="w-7 h-7 text-black" />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 md:p-12">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-5 pr-10 py-2.5 rounded-xl border-none shadow-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] bg-white text-gray-600 placeholder-gray-400"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center space-x-1 bg-[#38B6FF] text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-[#2a9bd6] transition">
                  <Check className="w-4 h-4" />
                  <span>New</span>
                </button>
                <button className="bg-white/60 hover:bg-white text-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm">Price ascending</button>
                <button className="bg-white/60 hover:bg-white text-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm">Price descending</button>
                <button className="bg-white/60 hover:bg-white text-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm">Rating</button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif text-black mb-2">Menu Category</h1>
              <button className="text-sm text-gray-600 hover:underline flex items-center gap-1">
                <span>←</span> back
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center aspect-[3/4] hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-40 h-40 relative mb-4">
                     {/* Circular image effect */}
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-black text-center">{item.name}</h3>
                </div>
              ))}
              
              {/* Plus Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-center aspect-[3/4] hover:shadow-xl transition-shadow cursor-pointer group">
                <Plus className="w-16 h-16 text-black group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExampleMenuPage;
