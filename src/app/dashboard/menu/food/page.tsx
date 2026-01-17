"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Camera, Clock, Utensils, Wine, IceCream } from "lucide-react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AddFoodPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [available, setAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    preparation_time: '15',
    category_id: ''
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
        
        // Set default category if available
        if (data && data.length > 0) {
          const foodCategory = data.find(cat => cat.slug === 'food');
          if (foodCategory) {
            setFormData(prev => ({...prev, category_id: foodCategory.id}));
          } else {
            setFormData(prev => ({...prev, category_id: data[0].id}));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to add menu items');
      return;
    }

    if (!formData.name || !formData.price || !formData.category_id) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', {
        ...formData,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time) || 15,
        user_id: user.id,
        image_url: imageUrl || null
      });

      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          preparation_time: parseInt(formData.preparation_time) || 15,
          status: 'available',
          is_featured: false,
          user_id: user.id,
          category_id: formData.category_id,
          image_url: imageUrl || null
        }])
        .select();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Menu item added successfully:', data);
      // Redirect to menu page on success
      router.push('/dashboard/menu');
    } catch (error: any) {
      console.error('Error adding menu item:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      alert(error.message || 'Failed to add menu item. Please check the console for details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      // Upload to Supabase Storage (use avatars bucket for now, or create menu-items bucket)
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
    Add Food Item To Menu
  </h1>
</div>

    <div className="bg-[#F2FFFD] flex justify-center py-10">
      <div className="w-full max-w-4xl px-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Food Name */}
          <div>
            <label className="block font-medium text-black mb-2">Food Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g classic cheeseburger..."
              className="w-full border text-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-black font-medium mb-2">Category</label>
            {categories.length > 0 ? (
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full border text-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500">No categories found. Please add categories first.</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-black font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full text-black focus:outline-none"
                required
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
                name="preparation_time"
                value={formData.preparation_time}
                onChange={handleInputChange}
                placeholder="15"
                min="1"
                className="w-full text-black focus:outline-none"
              />
              <Clock className="ml-2 text-gray-500" size={18} />
            </div>
          </div>
          </div>

          {/* Food Image Upload */}
          <div>
            <label className="block text-black font-medium mb-2">Food Image</label>
            <label className="block">
              <div className="border-2 border-dashed rounded-xl h-40 flex items-center justify-center text-gray-400 cursor-pointer hover:border-sky-400 relative overflow-hidden">
                {previewUrl || imageUrl ? (
                  <img 
                    src={previewUrl || imageUrl || undefined} 
                    alt="Food preview" 
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
          

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center mt-4">
            <button 
              type="submit" 
              className="flex justify-center items-center w-40 h-12 bg-[#61A9E5] hover:bg-[#2e9be0] text-white font-bold py-2 px-6 rounded-xl transition-colors"
              disabled={isSubmitting || imageUploading}
            >
              {isSubmitting ? 'Adding...' : 'Add to Menu'}
            </button>
          </div>
        </form>
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
