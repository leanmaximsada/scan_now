"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Navbar1 from "../../components/Navbar1";

const MenuPage: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Soup", price: 2.5, quantity: 0, image: "/logo/chicken.jpg" },
    { id: 2, name: "Bay srob", price: 1.25, quantity: 0, image: "/logo/bay srob.jpg" },
    { id: 3, name: "Fried rice", price: 1.5, quantity: 0, image: "/logo/rice.jpg" },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const categories = [
    { id: 1, name: "Rice", icon: "🍚" },
    { id: 2, name: "Salad", icon: "🥗" },
    { id: 3, name: "Drink", icon: "🍹" },
    { id: 4, name: "Soup", icon: "🍲" },
  ];

  const famousFood = [
    { id: 1, name: "Soup", image: "/logo/chicken.jpg" },
    { id: 2, name: "Fried rice", image: "/logo/bay srob.jpg" },
    { id: 3, name: "Bay srob", image: "/logo/rice.jpg" },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EFFFFF] text-slate-800 font-sans relative overflow-hidden">
        <Navbar1/>
       <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 px-8 py-4 overflow-y-auto scrollbar-hide">
          {/* Search and Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <input type="text" placeholder="Search" className="w-full bg-[#f5f7fa] border-none rounded-full py-2 px-4 pl-10 text-sm focus:ring-2 focus:ring-[#38b6ff] outline-none"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-[#38b6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-2 ml-4 overflow-x-auto">
              <button className="px-4 py-1.5 bg-[#38b6ff] text-white text-xs rounded-full font-medium">New</button>
              <button className="px-4 py-1.5 bg-white text-slate-600 text-xs rounded-full border border-transparent hover:border-slate-200">Price ascending</button>
              <button className="px-4 py-1.5 bg-white text-slate-600 text-xs rounded-full border border-transparent hover:border-slate-200">Price descending</button>
              <button className="px-4 py-1.5 bg-white text-slate-600 text-xs rounded-full border border-transparent hover:border-slate-200">Rating</button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="h-40 rounded-2xl overflow-hidden relative group">
              <img src="/logo/chicken.jpg" alt="Food" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
            </div>
            <div className="h-40 rounded-2xl overflow-hidden relative group">
              <img src="/logo/bay srob.jpg" alt="Food" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
            </div>
            <div className="h-40 rounded-2xl overflow-hidden relative group">
               <img src="/logo/rice.jpg" alt="Food" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
            </div>
          </div>

          {/* Menu Category */}
          <div className="mb-10 ml-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-medium text-slate-800">Menu Category</h2>
              <button className="text-xs text-slate-500 hover:text-[#38b6ff]">see all →</button>
            </div>
            
            <div className="flex gap-8">
              {categories.map((cat) => (
                <button key={cat.id} className="flex flex-col items-center gap-3 group">
                  <div className="w-20 h-20 rounded-full border-2 border-slate-300 flex items-center justify-center text-3xl bg-white group-hover:border-[#38b6ff] group-hover:text-[#38b6ff] transition">
                    {cat.icon}
                  </div>
                  {/* <span className="text-sm font-medium text-slate-600 group-hover:text-[#38b6ff]">{cat.name}</span> */}
                </button>
              ))}
            </div>
          </div>

          {/* Famous Food */}
          <div>

            <div className="grid grid-cols-3 gap-6">
              {famousFood.map((food) => (
                <div key={food.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center border border-slate-100">
                  <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-slate-800">{food.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Cart */}
        <div className="w-full lg:w-96 bg-[#EFFFFF]
         backdrop-blur-sm border-l border-slate-100 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
             <h2 className="text-2xl font-serif font-bold text-[#1e3a8a]">My Cart</h2>
             <span className="text-2xl  font-bold text-[#1e3a8a]">{total.toFixed(2)}$</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
             {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg text-slate-800">{item.name}</h3>
                      <p className="text-slate-600 font-medium">{item.price}$</p>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xl"
                      >
                        +
                      </button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xl"
                      >
                        -
                      </button>
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
             <button 
               onClick={() => router.push('/page/login/qrcode')}
               className="w-full py-3 bg-[#38b6ff] text-white rounded-xl font-medium shadow-lg shadow-[#38b6ff]/30 hover:brightness-95 transition"
             >
                Submit
             </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar Navigation (Left Sticky) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
         <button className="w-10 h-10 rounded-full bg-[#38b6ff] text-white flex items-center justify-center shadow-lg shadow-[#38b6ff]/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
         </button>
         <button className="w-10 h-10 rounded-full bg-white text-slate-400 hover:text-[#38b6ff] flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
         </button>
         <button className="w-10 h-10 rounded-full bg-white text-slate-400 hover:text-[#38b6ff] flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
         </button>
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
