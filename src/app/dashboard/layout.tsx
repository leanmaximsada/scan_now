"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Settings, Box } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/app/lib/supabase/client";

// --- 1. Define the NavItem component ---
interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}



const NavItem = ({ href = "#", icon, label, active }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? "bg-[#61A9E5] text-white" 
          : "hover:bg-slate-100 text-slate-500"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

// --- 2. Your DashboardLayout ---
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfileImage = async () => {
      if (!user) return;

      try {
        // Try to get from users table
        const { data: userData } = await supabase
          .from("users")
          .select("profile_image_url")
          .eq("id", user.id)
          .single();

        if (!isMounted) return;

        if (userData?.profile_image_url) {
          setProfileImageUrl(userData.profile_image_url);
        } else if (user.user_metadata?.profile_image_url) {
          setProfileImageUrl(user.user_metadata.profile_image_url);
        }
      } catch (err) {
        if (!isMounted) return;
        // Fallback to metadata
        if (user.user_metadata?.profile_image_url) {
          setProfileImageUrl(user.user_metadata.profile_image_url);
        }
      }
    };

    loadProfileImage();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#EFFFFF]">
      <aside className="w-64 bg-[#EFFFFF] border shadow-black shadow-xs text-slate-400 flex flex-col shrink-0">
        <div className="p-8 flex flex-col items-center">
          <Link href="/page">
            <div className="mb-1 mt-[-15px]">
              <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
            </div>
          </Link>
          <span className="font-bold text-[#61A9E5] tracking-wide">
            Scan Now
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem
            href="/dashboard  "
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
          <NavItem
            href="/dashboard/menu"
            icon={<UtensilsCrossed size={20} />}
            label="Menu"
            active={pathname === "/dashboard/menu"}
          />
          <NavItem
            href="/dashboard/menu/order"
            icon={<ShoppingBag size={20} />}
            label="Orders"
            active={pathname === "/dashboard/menu/order"}
          />
          <NavItem
            href="/dashboard/menu/order/table"
            icon={<Box size={20} />}
            label="Tables"
            active={pathname === "/dashboard/menu/order/table"}
          />
        </nav>

        <div className="p-4 border-t border-slate-200">
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            href="/dashboard/profile"
            active={pathname === "/dashboard/profile"}
          />
        </div>

        {/* User Avatar - Clickable to go to profile */}
        {/* <div className="p-4 border-t border-slate-200 flex justify-center">
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#61A9E5] shadow-md cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[#61A9E5] focus:ring-offset-2"
            title="Click to edit profile"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl text-gray-400">👤</span>
              </div>
            )}
          </button>
        </div> */}
      </aside>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}