import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Plus, Search, Edit2, Trash2, Layers, Check, X, Tag, Filter,
  CheckCircle2, XCircle, AlertTriangle, Power, Sparkles, RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/api';

const FIELD_CLASS =
  'w-full bg-[#0f1118] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all duration-200';

const UNIT_TYPE_OPTIONS = [
  { value: 'per_portion', label: 'Per Portion', icon: '🍛' },
  { value: 'per_piece', label: 'Per Piece', icon: '🍗' },
  { value: 'flat_fee', label: 'Flat Fee', icon: '📦' },
];

const MasterCatalogManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rice',
    unit_type: 'per_portion',
    is_active: true,
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCatalog = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const data = await adminService.getMasterCatalog();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to load master catalog.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Derived categories
  const categories = Array.from(
    new Set(items.map((i) => i.category).filter(Boolean))
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = String(item.name || '').toLowerCase().includes(q);
      const catMatch = String(item.category || '').toLowerCase().includes(q);
      return nameMatch || catMatch;
    }
    return true;
  });

  // Handle create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setActionLoading(true);
    try {
      const newItem = await adminService.addMasterCatalogItem({
        name: formData.name.trim(),
        category: formData.category?.trim() || 'General',
        unit_type: formData.unit_type,
      });
      setItems((prev) => [newItem, ...prev]);
      setIsAddModalOpen(false);
      setFormData({ name: '', category: 'Rice', unit_type: 'per_portion', is_active: true });
      showToast('success', `Item "${newItem.name}" added to Master Catalog! ✨`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to add item.'));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem || !formData.name.trim()) return;

    setActionLoading(true);
    try {
      const updated = await adminService.updateMasterCatalogItem(editingItem.id, {
        name: formData.name.trim(),
        category: formData.category?.trim() || 'General',
        unit_type: formData.unit_type,
        is_active: formData.is_active,
      });
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? updated : i))
      );
      setEditingItem(null);
      showToast('success', `Catalog item updated successfully! 📝`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to update item.'));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete / toggle
  const handleDelete = async (itemId) => {
    setActionLoading(true);
    try {
      await adminService.deleteMasterCatalogItem(itemId);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, is_active: false } : i))
      );
      setDeletingItem(null);
      showToast('success', 'Master catalog item deactivated.');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to deactivate item.'));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'General',
      unit_type: item.unit_type || 'per_portion',
      is_active: item.is_active ?? true,
    });
  };

  const getUnitBadge = (unitType) => {
    switch (unitType) {
      case 'per_portion':
        return { label: 'Per Portion', icon: '🍛', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'per_piece':
        return { label: 'Per Piece', icon: '🍗', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'flat_fee':
        return { label: 'Flat Fee', icon: '📦', cls: 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/20' };
      default:
        return { label: unitType, icon: '🏷️', cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl border animate-in slide-in-from-top-3 duration-200 ${
          toast.type === 'success'
            ? 'bg-[#171B26] border-green-500/30 text-green-400 shadow-green-500/10'
            : 'bg-[#171B26] border-red-500/30 text-red-400 shadow-red-500/10'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 flex items-center justify-center text-[#2CD6EB]">
              <Layers size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Master Food Catalog
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Canonical platform-wide items that vendors select from to build standardized menus.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchCatalog(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Catalog"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => {
              setFormData({ name: '', category: 'Rice', unit_type: 'per_portion', is_active: true });
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FA6131] hover:bg-[#e04e1f] px-4 py-2.5 text-sm font-bold text-white transition-all shadow-lg shadow-[#FA6131]/20"
          >
            <Plus size={16} /> Add Catalog Item
          </button>
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog items by name or category..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2CD6EB]/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'ALL'
                ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/30 text-[#2CD6EB]'
                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
            }`}
          >
            All Items ({items.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/30 text-[#2CD6EB]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              {cat} ({items.filter((i) => i.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading catalog items…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchCatalog()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <Layers size={28} />
          </div>
          <p className="text-gray-400 font-bold text-base">No catalog items found.</p>
          <p className="text-gray-600 text-xs max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'Try adjusting your search term or category filter.'
              : 'Add your first master catalog item to seed the platform repository.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const badge = getUnitBadge(item.unit_type);
            return (
              <div
                key={item.id}
                className="bg-[#1e2333] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#2CD6EB] transition-colors truncate">
                      {item.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border shrink-0 ${
                      item.is_active ?? true
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-white/5 text-gray-500 border-white/10'
                    }`}>
                      {item.is_active ?? true ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.category && (
                      <span className="text-[11px] font-semibold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        📂 {item.category}
                      </span>
                    )}
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${badge.cls}`}>
                      {badge.icon} {badge.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-500">
                  <span className="font-mono text-[10px]">ID: #{item.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      title="Edit Item"
                    >
                      <Edit2 size={14} />
                    </button>
                    {item.is_active ?? true ? (
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        title="Deactivate Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────── */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
          />

          <div className="relative w-full max-w-lg bg-[#171B26] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FA6131]/10 border border-[#FA6131]/20 flex items-center justify-center text-[#FA6131]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    {editingItem ? 'Edit Master Catalog Item' : 'Add Master Catalog Item'}
                  </h3>
                  <p className="text-xs text-gray-500">Platform canonical menu specification</p>
                </div>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={editingItem ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Jollof Rice, Takeaway Pack, Fried Chicken"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. Rice, Protein, Drinks, Extras"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Unit Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {UNIT_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, unit_type: opt.value }))}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                        formData.unit_type === opt.value
                          ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/40 text-[#2CD6EB] ring-1 ring-[#2CD6EB]/30'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {editingItem && (
                <div className="flex items-center justify-between py-3 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active Status</span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, is_active: !p.is_active }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.is_active
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-500'
                    }`}
                  >
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !formData.name.trim()}
                  className="flex-1 py-3 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FA6131]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirm Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setDeletingItem(null)} />
          <div className="relative w-full max-w-md bg-[#171B26] border border-red-500/20 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-white">Deactivate "{deletingItem.name}"?</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                This will soft-delete the item from the master catalog. Vendors will no longer be able to select it for new menu additions.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingItem.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCatalogManager;
