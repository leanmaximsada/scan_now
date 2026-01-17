"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { useAuth } from "@/app/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      loadUserProfile();
    }
  }, [user, authLoading, router]);

  const loadUserProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user data from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      // Check if user record doesn't exist or if there's an error
      if (userError) {
        // Check if it's a "no rows" error or empty error (might be RLS issue)
        const isNoRowsError = 
          userError.code === "PGRST116" || 
          userError.message?.includes("No rows") ||
          userError.message?.includes("not found") ||
          Object.keys(userError).length === 0; // Empty error object

        if (isNoRowsError) {
          // User record doesn't exist
          // Note: We can't insert via RLS due to policies, but the trigger should create it
          // If the trigger didn't fire, we'll just use auth metadata for now
          console.log("User record not found in users table. The trigger should create it automatically.");
          // Don't try to insert manually - RLS will block it
          // Instead, rely on the trigger or just use metadata
        } else {
          // Log other errors but don't block the UI
          console.warn("Error loading user profile (non-critical):", {
            code: userError.code,
            message: userError.message,
            details: userError.details,
            hint: userError.hint
          });
        }
      }

      // If we have userData, use it (successful read)
      if (userData) {
        setFullName(userData.full_name || "");
        setRestaurantName(userData.restaurant_name || "");
        setPhone(userData.phone || "");
        setProfileImageUrl(userData.profile_image_url || null);
      }

      // Always set email from auth user (this should always work)
      // Also try to get other data from metadata if userData failed
      if (!userData) {
        const metadata = user.user_metadata || {};
        if (!fullName && metadata.full_name) {
          setFullName(metadata.full_name);
        }
        if (!restaurantName && metadata.restaurant_name) {
          setRestaurantName(metadata.restaurant_name);
        }
        // Also check metadata for profile image URL as fallback
        if (!profileImageUrl && metadata.profile_image_url) {
          setProfileImageUrl(metadata.profile_image_url);
        }
      }

      // Get email from auth user
      setEmail(user.email || "");
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageUploading(true);
    setError(null);

    try {
      // Create unique filename using user ID in a folder structure
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`; // Store in user folder

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // Provide more detailed error message
        let errorMsg = uploadError.message || "Failed to upload image";

        // Check for common errors
        if (errorMsg.includes("row-level security") || errorMsg.includes("RLS") || errorMsg.includes("policy")) {
          errorMsg = "Storage permission denied. Please run the storage policies SQL (simple_storage_policies.sql) or check bucket permissions in Supabase Dashboard.";
        } else if (errorMsg.includes("already exists")) {
          // File already exists - this is okay with upsert, but Supabase might still return an error
          // Continue anyway since upsert should handle it
          console.log("File already exists, upsert should handle it");
        } else if (errorMsg.includes("not found") && errorMsg.includes("bucket")) {
          errorMsg = 'Storage bucket "avatars" not found. Please create it in Supabase Dashboard > Storage.';
        }

        // Only throw if it's a real error (not just "already exists")
        if (!uploadError.message?.includes("already exists")) {
          console.error("Image upload error details:", {
            message: uploadError.message,
            name: uploadError.name,
            fullError: uploadError
          });
          throw new Error(errorMsg);
        }
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update user profile with image URL in users table
      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_image_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        console.warn("Could not update profile_image_url in users table:", updateError);
        // Try to update using upsert in case record doesn't exist
        const { error: upsertError } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            email: user.email || "",
            profile_image_url: publicUrl,
            is_active: true,
          }, {
            onConflict: 'id'
          });

        if (upsertError) {
          console.warn("Could not upsert user record:", upsertError);
        }
      }

      // Also save to auth metadata as backup
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          profile_image_url: publicUrl,
        },
      });

      if (metadataError) {
        console.warn("Could not update auth metadata:", metadataError);
      }

      setProfileImageUrl(publicUrl);
      setSuccess("Profile image updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to upload image. Please check storage bucket setup.";
      setError(errorMessage);
      console.error("Image upload error:", {
        message: err?.message,
        name: err?.name,
        fullError: err
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // First, try to update user profile in users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: fullName || null,
          restaurant_name: restaurantName || null,
          phone: phone || null,
        })
        .eq("id", user.id);

      if (updateError) {
        // If update fails (record might not exist), just update auth metadata
        // The trigger should create the record eventually
        console.warn("Could not update users table:", updateError.message);
      }

      // Always update auth user metadata (this should always work)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          restaurant_name: restaurantName,
        },
      });

      if (metadataError) {
        throw metadataError;
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload profile to get latest data
      loadUserProfile();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate passwords
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) {
        throw passwordError;
      }

      setSuccess("Password updated successfully!");
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
      console.error("Password update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#EFFFFF] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Image Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Image</h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[#38B6FF]"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#38B6FF]">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
              )}
            </div>
            <div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#38B6FF] file:text-white hover:file:bg-[#2e9be0] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {imageUploading ? "Uploading..." : "JPG, PNG or GIF. Max size 5MB"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                placeholder="Enter your restaurant name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-6 bg-[#38B6FF] text-white font-medium rounded-lg shadow-md hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Password Change Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={saving || !newPassword || !confirmPassword}
              className="w-full py-3 px-6 bg-[#38B6FF] text-white font-medium rounded-lg shadow-md hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
          <button
            onClick={async () => {
              await signOut();
              router.push("/auth/login");
            }}
            className="w-full py-3 px-6 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
