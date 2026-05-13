import React, { useState, useEffect } from 'react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import { Loader2, Check, X, Search } from 'lucide-react';

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

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#FA6131]" />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-extrabold text-white mb-4">Menu Manager</h2>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e2333] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all shadow-sm"
            placeholder="Search your menu..."
          />
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
          <p>{error}</p>
          <button onClick={fetchMenu} className="mt-4 px-4 py-2 bg-red-500/20 rounded-xl text-sm font-bold">Retry</button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-4 space-y-3">
          {filteredMenu.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No menu items found.</p>
            </div>
          ) : (
            filteredMenu.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  item.is_available 
                    ? 'bg-[#1e2333] border-white/10' 
                    : 'bg-[#1e2333]/50 border-white/5 opacity-75'
                }`}
              >
                <div className="flex-1 pr-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.category || 'Uncategorized'}</p>
                  <h3 className={`text-lg font-bold mb-1 ${item.is_available ? 'text-white' : 'text-gray-400 line-through'}`}>
                    {item.name}
                  </h3>
                  <p className="text-[#2CD6EB] font-bold">{formatMoney(item.price)}</p>
                </div>
                
                {/* Large Touch Target Toggle */}
                <button
                  onClick={() => handleToggle(item)}
                  disabled={updatingId === item.id}
                  className={`relative flex items-center justify-between w-24 h-12 rounded-full p-1 cursor-pointer transition-colors shrink-0 border-2 ${
                    item.is_available 
                      ? 'bg-green-500/20 border-green-500/50' 
                      : 'bg-red-500/10 border-red-500/30'
                  } ${updatingId === item.id ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <div className={`absolute top-1 bottom-1 w-10 rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    item.is_available 
                      ? 'translate-x-12 bg-green-500 shadow-md shadow-green-500/30' 
                      : 'translate-x-0 bg-gray-600 shadow-inner'
                  }`}>
                    {updatingId === item.id ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : item.is_available ? (
                      <Check size={20} className="text-white" strokeWidth={3} />
                    ) : (
                      <X size={20} className="text-white/50" strokeWidth={3} />
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider w-1/2 text-center ml-auto ${item.is_available ? 'text-green-400 opacity-0' : 'text-gray-500 opacity-100'} transition-opacity`}>
                    OUT
                  </span>
                  <span className={`absolute left-2 text-[9px] font-black uppercase tracking-wider w-1/2 text-center ${item.is_available ? 'text-green-400 opacity-100' : 'opacity-0'} transition-opacity`}>
                    IN
                  </span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VendorMenuManager;
