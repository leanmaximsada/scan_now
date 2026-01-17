"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "src/lib/supabase/client";
import { getUserProfile, UserProfile, UserRole } from "../lib/auth/roles";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        setUser(session?.user ?? null);
        if (session?.user) {
          const userProfile = await getUserProfile(session.user);
          if (isMounted) setProfile(userProfile);
        }
      } catch (error) {
        if (isMounted) console.error('Auth init error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        const userProfile = await getUserProfile(session.user);
        if (isMounted) setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.isAdmin ?? false,
    isClient: profile?.isClient ?? false,
    role: profile?.role ?? null,
  };
}
