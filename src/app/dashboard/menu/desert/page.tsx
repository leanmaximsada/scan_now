"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Camera, Clock, Utensils, Wine, IceCream } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/app/lib/supabase/client";

export default function AddFoodPage() {
  const { user } = useAuth();
  const [available, setAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Show preview immediately
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    setImageUploading(true);

    try {
      // Create unique filename using timestamp
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const fileName = `menu-${timestamp}.${fileExt}`;
      const filePath = `${user.id}/menu-items/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload image");
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setImageUrl(publicUrl);
      // Clean up preview URL
      URL.revokeObjectURL(preview);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("Image upload error:", err);
      alert(err.message || "Failed to upload image");
      setPreviewUrl(null);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    
    <div className="bg-[#EFFFFF]">
           <div className="flex items-center justify-center text-center h-20 bg-[#EFFFFF] border-b-2 border-slate-200 shadow-xl">
  <h1 className="text-3xl font-semibold text-sky-500">
    Add Desert To Menu
  </h1>
</div>

    <div className=" bg-[#F2FFFD] flex justify-center py-10">

      <div className="w-full ml-[-200] max-w-4xl px-6">

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Food Name */}
          <div>
            <label className="block font-medium text-black mb-2">Desert Name</label>
            <input
              type="text"
              placeholder="e.g classic cheeseburger..."
              className="w-full border  text-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-black font-medium mb-2">Category</label>
            <div className="flex gap-4">
            <a href="/dashboard/menu/food"><CategoryIcon icon={<Utensils />} /></a>
            <a href="/dashboard/menu/drinks"><CategoryIcon icon={<Wine />} /></a>
              <CategoryIcon icon={<IceCream />} active />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-black font-medium mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="e.g juicy beef patty with cheddar..."
              className="w-full text-black border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-black font-medium mb-2">Price (USD)</label>
            <div className="flex items-center border rounded-lg px-4 py-3 border-black">
              <input
                type="number"
                placeholder="...."
                className="w-full text-black focus:outline-none "
              />
              <span className="ml-2 text-gray-500">$</span>
            </div>

            <div>
            <label className="block text-black font-medium mb-2">
              Preparation Time (Minute)
            </label>
            <div className="flex items-center border rounded-lg px-4 py-3 border-black">
              <input
                type="number"
                placeholder="...."
                className="w-full text-black focus:outline-none"
              />
              <Clock className="ml-2 text-gray-500" size={18} />
            </div>
          </div>
          </div>

          {/* Desert Image Upload */}
          <div>
            <label className="block text-black font-medium mb-2">Desert Image</label>
            <label className="block">
              <div className="border-2 border-dashed rounded-xl h-40 flex items-center justify-center text-gray-400 cursor-pointer hover:border-sky-400 relative overflow-hidden">
                {previewUrl || imageUrl ? (
                  <img 
                    src={previewUrl || imageUrl || undefined} 
                    alt="Desert preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={36} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imageUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                    Uploading...
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {imageUploading ? "Uploading..." : "Click to upload image (Max 5MB)"}
              </p>
            </label>
          </div>

          {/* Preparation Time */}
          

          {/* Customs */}
          <div>
            <a href="/dashboard/menu">
            <div className="mt-38 flex justify-center hover-black font-bold items-center w-40 h-10 bg-[#61A9E5] mt-3 rounded-xl">
                <h1>Add</h1>
            </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

/* Category Button */
function CategoryIcon({
  icon,
  active = false,
}: {
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center rounded-full border cursor-pointer transition
      ${
        active
          ? "border-sky-400 text-sky-500 bg-white shadow"
          : "border-gray-300 text-gray-400"
      }`}
    >
      {icon}
    </div>
  );
}
