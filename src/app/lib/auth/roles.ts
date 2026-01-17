import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export type UserRole = "admin" | "customer";

export interface UserProfile {
  id: string;
  role: UserRole;
  isAdmin: boolean;
  isClient: boolean;
}

export async function getUserProfile(user: User): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle(); // ✅ CHANGE HERE

  // Only log real errors
  if (error) {
    console.error("Error fetching user role:", error);
  }

  // ✅ User has no profile yet → fallback
  if (!data) {
    return {
      id: user.id,
      role: "customer",
      isAdmin: false,
      isClient: true,
    };
  }

  return {
    id: data.id,
    role: data.role,
    isAdmin: data.role === "admin",
    isClient: data.role === "customer",
  };
}
