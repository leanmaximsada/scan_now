"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, ArrowRight, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function PhoneScreenPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get("table");

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Get the restaurant owner's user_id from the table
        const { data: tableData } = await supabase
          .from("tables")
          .select("user_id")
          .eq("id", tableId)
          .single();

        if (!tableData) {
          console.error("Table not found");
          setLoading(false);
          return;
        }

        // Fetch menu items for this restaurant
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("user_id", tableData.user_id)
          .eq("status", "available")
          .order("name");

        if (mountedRef.current && error) {
          console.error("Error fetching menu items:", error);
        } else if (mountedRef.current && data) {
          setMenuItems(data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (tableId) {
      fetchMenuItems();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [tableId]);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((ci) => ci.id === item.id);
      if (existingItem) {
        return prevCart.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((ci) =>
          ci.id === itemId ? { ...ci, quantity } : ci
        )
      );
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !tableId || !mountedRef.current) return;

    if (mountedRef.current) {
      setSubmitting(true);
    }

    try {
      const { data: tableData, error: tableError } = await supabase
        .from("tables")
        .select("user_id")
        .eq("id", tableId)
        .single();

      if (!mountedRef.current) return;

      if (tableError || !tableData) {
        alert("Table not found");
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: tableData.user_id,
          table_id: tableId,
          table_number: "Table " + tableId.slice(0, 4),
          status: "pending",
          total_amount: totalPrice,
          order_number: `#${Date.now()}`,
        })
        .select()
        .single();

      if (!mountedRef.current) return;

      if (orderError) throw orderError;

      // Add order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (!mountedRef.current) return;

      if (itemsError) throw itemsError;

      if (mountedRef.current) {
        alert("Order placed successfully!");
        setCart([]);
      }
    } catch (error) {
      console.error("Error placing order:", error?.message || error);
      if (mountedRef.current) {
        alert("Failed to place order. Please try again.");
      }
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#38B6FF] focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Menu Items Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B6FF]"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Item Image */}
                    <div className="relative h-40 w-full bg-gray-200">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-300">
                          <ShoppingCart size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-black">{item.name}</h4>
                        <span className="font-bold text-xl text-[#38B6FF]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-[#38B6FF] hover:bg-[#2da3e6] text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h3 className="font-bold text-xl text-black mb-4 flex items-center gap-2">
              <ShoppingCart size={24} />
              Order Summary
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-black">{item.name}</h4>
                          <p className="text-xs text-gray-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 justify-between">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 p-1 rounded text-xs"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold text-sm min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 p-1 rounded text-xs"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="ml-auto font-semibold text-sm text-[#38B6FF]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total and Checkout */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-black">Total:</span>
                    <span className="font-bold text-2xl text-[#38B6FF]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting || cart.length === 0}
                    className="w-full bg-[#38B6FF] hover:bg-[#2da3e6] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
