'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase/client';
import { ShoppingCart, Utensils } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('table');
  const [tableName, setTableName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchTableInfo() {
      if (!tableId) {
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('tables')
          .select('name')
          .eq('id', tableId)
          .single();

        if (!isMounted) return;

        if (error) {
          // Don't log abort errors - these happen during component unmount or hot reload
          if (!error?.message?.includes('AbortError') && !error?.message?.includes('signal is aborted')) {
            console.error('Error fetching table info:', error?.message || 'Unknown error');
          }
        } else if (data) {
          setTableName(data.name);
        }
      } catch (err) {
        if (isMounted) {
          // Ignore abort errors from unmounting or hot reload
          const errorMsg = err?.message || String(err);
          if (!errorMsg.includes('AbortError') && !errorMsg.includes('signal is aborted')) {
            console.error('Error fetching table:', errorMsg);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchTableInfo();
    
    return () => {
      isMounted = false;
    };
  }, [tableId]);

  if (loading) return <div className="p-10 text-center">Loading Menu...</div>;
  if (!tableId) return <div className="p-10 text-center">Invalid QR Code</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Our Menu</h1>
          <p className="text-sm text-blue-600 font-medium">{tableName || 'Guest Table'}</p>
        </div>
        <div className="relative">
          <ShoppingCart className="text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
        </div>
      </div>

      {/* Menu Categories (Example Placeholder) */}
      <div className="p-4 space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Popular Dishes</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-center mb-3">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
              <Utensils className="text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Classic Burger</h3>
              <p className="text-sm text-gray-500 line-clamp-1">Juicy beef patty with cheese and secret sauce.</p>
              <p className="font-bold text-blue-600 mt-1">$12.00</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">+</button>
          </div>
        </section>
      </div>

      {/* Bottom Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">
          View Cart & Order
        </button>
      </div>
    </div>
  );
}

// Next.js requires Suspense for useSearchParams
export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}