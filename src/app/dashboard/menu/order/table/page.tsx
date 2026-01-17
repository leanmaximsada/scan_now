'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/api/client';
import { Database } from '@/types/supabase';
import { Plus, Trash2, Copy, QrCode, Loader2, Edit2, Check, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Types extracted from your Database schema
type Table = Database['public']['Tables']['tables']['Row'];
type TableInsert = Database['public']['Tables']['tables']['Insert'];

export default function TableManagementPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableName, setNewTableName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const mountedRef = useRef(true);

  // 🔐 Fetch tables for logged-in user
  const fetchTables = async (isMounted = true) => {
    try {
      if (isMounted) setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMounted && data) setTables(data);
    } catch (error: any) {
      if (isMounted) {
        console.error('Error fetching tables:', error?.message || error);
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchTables(mountedRef.current);
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ➕ Create table
  const createTable = async () => {
    if (!newTableName.trim()) return;
    setCreating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const id = uuidv4();
      const url = `${window.location.origin}/dashboard/menu/phscreen?table=${id}`;

      const tableData: TableInsert = {
        id,
        name: newTableName,
        qr_code: url,
        user_id: session.user.id,
      };

      // We pass TableInsert to .from() to help TS understand the shape
      const { error } = await supabase
        .from('tables')
        .insert([tableData]); 

      if (error) throw error;

      if (mountedRef.current) {
        setNewTableName('');
        fetchTables(mountedRef.current);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        alert('Error creating table: ' + (error?.message || error));
      }
    } finally {
      if (mountedRef.current) setCreating(false);
    }
  };

  // ✏️ Start editing table number
  const startEditing = (tableId: string, currentName: string) => {
    setEditingId(tableId);
    setEditingName(currentName);
  };

  // 💾 Update table number
  const updateTableNumber = async (tableId: string) => {
    if (!editingName.trim()) {
      alert('Table name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('tables')
        .update({ name: editingName })
        .eq('id', tableId);

      if (error) throw error;

      if (mountedRef.current) {
        setEditingId(null);
        setEditingName('');
        // Update local state immediately
        setTables(tables.map(t => t.id === tableId ? { ...t, name: editingName } : t));
      }
    } catch (error: any) {
      if (mountedRef.current) {
        alert('Error updating table: ' + (error?.message || error));
      }
    }
  };

  // ❌ Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // 🗑 Delete table
  const deleteTable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    
    try {
      const { error } = await supabase.from('tables').delete().eq('id', id);
      if (error) throw error;
      
      if (mountedRef.current) {
        setTables(prev => prev.filter(t => t.id !== id));
      }
    } catch (error: any) {
      if (mountedRef.current) {
        alert('Error deleting table: ' + (error?.message || error));
      }
    }
  };

  // 📋 Copy QR URL
  const copyQR = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('QR URL copied to clipboard!');
  };

  // 📷 Generate QR image
  const qrImage = (url: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Table Management</h1>

      {/* Input + Create button */}
      <div className="flex gap-2 mb-8">
        <input
          value={newTableName}
          onChange={e => setNewTableName(e.target.value)}
          placeholder="e.g. Table 01, VIP Section..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && createTable()}
        />
        <button
          onClick={createTable}
          disabled={creating || !newTableName.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
        >
          {creating ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} className="mr-2" /> Create</>}
        </button>
      </div>

      {/* Grid */}
      {tables.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl">
          <QrCode size={48} className="mx-auto mb-4 opacity-20" />
          <p>No tables found. Add your first table above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map(table => (
            <div key={table.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {editingId === table.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        className="border border-gray-300 px-2 py-1 rounded text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => updateTableNumber(table.id)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="Save"
                      >
                        <Check size={16} className="text-green-600" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Cancel"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg text-gray-800">{table.name}</h3>
                      <p className="text-xs text-gray-500 font-mono">{table.id.split('-')[0]}...</p>
                    </>
                  )}
                </div>
                {editingId !== table.id && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startEditing(table.id, table.name)}
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit Table Number"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button 
                      onClick={() => copyQR(table.qr_code)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Copy Link"
                    >
                      <Copy size={16} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteTable(table.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex justify-center mb-4">
                <img 
                  src={qrImage(table.qr_code)} 
                  alt={`QR for ${table.name}`}
                  className="w-32 h-32" 
                />
              </div>

              <a
                href={table.qr_code}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors"
              >
                View Menu Page
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}