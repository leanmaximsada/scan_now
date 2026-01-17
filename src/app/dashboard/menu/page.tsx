"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CookingPot,
  HandPlatter,
  Layers,
  Pencil,
  Eye,
  Trash2,
  ChevronDown,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/app/lib/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  status: 'available' | 'unavailable';
  preparation_time: number;
  is_featured: boolean;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default function Menu() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("food");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (!user) return;

      try {
        const { data: userData } = await supabase
          .from("users")
          .select("profile_image_url")
          .eq("id", user.id)
          .single();

        if (userData?.profile_image_url) {
          setProfileImageUrl(userData.profile_image_url);
        } else if (user.user_metadata?.profile_image_url) {
          setProfileImageUrl(user.user_metadata.profile_image_url);
        }
      } catch (err) {
        if (user.user_metadata?.profile_image_url) {
          setProfileImageUrl(user.user_metadata.profile_image_url);
        }
      }
    };

    loadProfileImage();
  }, [user]);

  useEffect(() => {
    const loadMenuItems = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading menu items:", error);
        } else {
          setMenuItems(data || []);
        }
      } catch (err) {
        console.error("Error loading menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadMenuItems();
    }
  }, [user]);

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterCategory === "all") {
      return matchesSearch;
    }

    const categorySlug = item.categories?.slug || "";
    const categoryMatches = categorySlug === filterCategory;

    return matchesSearch && categoryMatches;
  });

  // Handle edit menu item
  const handleEdit = (itemId: string) => {
    router.push(`/dashboard/menu/edit/${itemId}`);
  };

  // Handle view menu item
  const handleView = (itemId: string) => {
    // You can implement a view modal or redirect to a view page
    alert(`Viewing item ${itemId}`);
  };

  // Handle delete menu item
  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item? This action cannot be undone.")) {
      return;
    }

    setDeletingId(itemId);
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      // Remove the item from the local state
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

      alert("Menu item deleted successfully");
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle item status (available/unavailable)
  const toggleItemStatus = async (item: MenuItem) => {
    try {
      const newStatus = item.status === "available" ? "unavailable" : "available";

      const { error } = await supabase
        .from("menu_items")
        .update({ status: newStatus })
        .eq("id", item.id);

      if (error) throw error;

      // Update the local state
      setMenuItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
    } catch (error) {
      console.error("Error updating menu item status:", error);
      alert("Failed to update menu item status. Please try again.");
    }
  };

  // Calculate stats
  const totalDishes = menuItems.length;
  const popularDishes = menuItems.filter((item) => item.is_featured).length;
  const categoriesCount = new Set(menuItems.map((item) => item.category_id)).size;

  return (
    <div className="flex-1 h-screen overflow-y-auto">
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Menu</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-72 shadow-sm transition-all"
              />
            </div>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[#61A9E5] focus:ring-offset-2"
              title="Click to edit profile"
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm text-gray-400">👤</span>
                </div>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<CookingPot size={22} />}
            label="Total Dishes"
            value={totalDishes.toString()}
            color="bg-blue-50 text-blue-500"
          />
          <StatCard
            icon={<HandPlatter size={25} />}
            label="Popular Dishes"
            value={popularDishes.toString()}
            color="bg-sky-50 text-sky-400"
          />
          <StatCard
            icon={<Layers size={22} />}
            label="Categories"
            value={categoriesCount.toString()}
            color="bg-blue-50 text-blue-600"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Menu Overview</h3>
          <button 
            className="flex items-center justify-center h-10 px-4 text-white bg-[#61A9E5] hover:bg-[#2e9be0] rounded-md cursor-pointer transition-colors"
            onClick={() => router.push(`/dashboard/menu/${selectedCategory}`)}
          >
            Add New Dish
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  filterCategory === "all"
                    ? "text-white bg-[#61A9E5] hover:bg-[#2e9be0]"
                    : "text-slate-700 bg-slate-100 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-sm text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#61A9E5]/50"
                >
                  <option value="food">Food</option>
                  <option value="dessert">Dessert</option>
                  <option value="drinks">Drinks</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                View As
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-sm font-medium text-slate-500 border-b border-slate-100">
                <div className="col-span-2">Dish Image</div>
                <div className="col-span-2">Dish Name</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right pr-4">Actions</div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  Loading menu items...
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {searchQuery
                    ? `No items found matching "${searchQuery}"`
                    : "No menu items yet. Click 'Add Dish' to get started!"}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredMenuItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="col-span-2">
                        {item.image_url ? (
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={item.image_url}
                            alt={item.name}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                            <UtensilsCrossed size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 font-medium text-slate-800">
                        {item.name}
                      </div>
                      <div className="col-span-2 text-sm text-slate-600">
                        {item.categories?.name || "Uncategorized"}
                      </div>
                      <div className="col-span-2 font-semibold text-slate-800">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="col-span-2">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "available" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status === "available" ? "Available" : "Unavailable"}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end space-x-2">
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemStatus(item);
                          }}
                          className={`p-2 rounded-lg ${
                            item.status === "available"
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          } transition-colors`}
                          title={item.status === "available" ? "Set as unavailable" : "Set as available"}
                        >
                          {item.status === "available" ? "Available" : "Unavailable"}
                        </button> */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.id);
                          }}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(item.id);
                          }}
                          className="p-2 text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          disabled={deletingId === item.id}
                          className={`p-2 rounded-lg transition-colors ${
                            deletingId === item.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-500 hover:bg-red-100"
                          }`}
                          title="Delete"
                        >
                          {deletingId === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
