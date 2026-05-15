import React, { useState, useEffect } from 'react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import { Loader2, Check, X, Search, Plus, UtensilsCrossed } from 'lucide-react';

const VendorMenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getMenu();
      setMenuItems(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load menu items.'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item) => {
    if (updatingId) return;
    try {
      setUpdatingId(item.id);
      const newStatus = !item.is_available;
      
      // Optimistic update
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, is_available: newStatus } : m));
      
      // API call
      await vendorService.updateMenuItem(item.id, { is_available: newStatus });
    } catch (err) {
      // Revert on failure
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, is_available: item.is_available } : m));
      alert(getApiErrorMessage(err, 'Failed to update item status.'));
    } finally {
      setUpdatingId(null);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const filteredMenu = menuItems.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by category
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#FA6131]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col h-full bg-[#171B26]">
      {/* Header section */}
      <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Menu Manager</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your active listings and availability.</p>
        </div>
        <button
          onClick={() => alert("Add Item endpoint coming soon!")}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FA6131] to-[#e04e1f] hover:from-[#ff7040] hover:to-[#FA6131] text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#FA6131]/20 hover:shadow-[#FA6131]/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 shrink-0 relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1e2333]/80 backdrop-blur-md border border-white/10 rounded-2xl pl-14 pr-4 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all shadow-sm"
          placeholder="Search your menu..."
        />
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center backdrop-blur-sm">
          <p>{error}</p>
          <button onClick={fetchMenu} className="mt-4 px-6 py-2 bg-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors">Retry</button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-4 space-y-8 pr-2 custom-scrollbar">
          {Object.keys(groupedMenu).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <UtensilsCrossed size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No menu items found</h3>
              <p className="text-gray-400 max-w-sm">
                {searchQuery ? "We couldn't find any items matching your search." : "You don't have any items on your menu yet. Add some to get started!"}
              </p>
            </div>
          ) : (
            Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-bold text-[#2CD6EB] uppercase tracking-widest px-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-5 rounded-3xl border backdrop-blur-md transition-all ${
                        item.is_available 
                          ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10' 
                          : 'bg-white/5 border-white/5 opacity-60 grayscale-[50%]'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <h4 className={`text-xl font-bold mb-1 ${item.is_available ? 'text-white' : 'text-gray-400 line-through'}`}>
                          {item.name}
                        </h4>
                        <p className="text-[#FA6131] font-extrabold text-lg">{formatMoney(item.price)}</p>
                      </div>
                      
                      {/* Premium Toggle */}
                      <button
                        onClick={() => handleToggle(item)}
                        disabled={updatingId === item.id}
                        className={`relative flex items-center justify-between w-[100px] h-12 rounded-full p-1 cursor-pointer transition-colors shrink-0 border-2 ${
                          item.is_available 
                            ? 'bg-green-500/10 border-green-500/50' 
                            : 'bg-red-500/5 border-red-500/30'
                        } ${updatingId === item.id ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <div className={`absolute top-1 bottom-1 w-[44px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center ${
                          item.is_available 
                            ? 'left-[50px] bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                            : 'left-1 bg-gray-600 shadow-inner'
                        }`}>
                          {updatingId === item.id ? (
                            <Loader2 size={16} className="animate-spin text-white" />
                          ) : item.is_available ? (
                            <Check size={20} className="text-white" strokeWidth={3} />
                          ) : (
                            <X size={20} className="text-white/50" strokeWidth={3} />
                          )}
                        </div>
                        <span className={`absolute right-3 text-[10px] font-black uppercase tracking-wider text-center ${item.is_available ? 'opacity-0' : 'text-gray-500 opacity-100'} transition-opacity`}>
                          OUT
                        </span>
                        <span className={`absolute left-4 text-[10px] font-black uppercase tracking-wider text-center ${item.is_available ? 'text-green-400 opacity-100' : 'opacity-0'} transition-opacity`}>
                          IN
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VendorMenuManager;
