import React, { useState, useEffect, useCallback } from 'react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import {
  Loader2, Check, X, Search, Plus, UtensilsCrossed,
  ChevronDown, ChevronUp, Pencil, Trash2, CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react';

// ── Toast System ─────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-bold border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top ${
      isSuccess
        ? 'bg-green-500/15 border-green-500/25 text-green-400 shadow-green-500/10'
        : 'bg-red-500/15 border-red-500/25 text-red-400 shadow-red-500/10'
    }`}>
      {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      <span>{toast.msg}</span>
    </div>
  );
};

// ── Shared Input Class ───────────────────────────────────────────────
const inputClass =
  'w-full bg-[#0f1118] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FA6131] focus:ring-1 focus:ring-[#FA6131]/50 transition-all';

// ── Add Item Modal ──────────────────────────────────────────────────
const AddItemModal = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim() || 'General',
      };
      if (form.description.trim()) {
        payload.description = form.description.trim();
      }
      await vendorService.addMenuItem(payload);
      setForm({ name: '', price: '', category: '', description: '' });
      showToast('success', `"${payload.name}" added to menu! 🎉`);
      onSuccess();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to add menu item.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[#171B26] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-white">Add Menu Item</h3>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the details for your new item.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Jollof Rice"
              required
              className={inputClass}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1500"
                required
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Rice"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional — short description of this item"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.name.trim() || !form.price}
            className="w-full bg-gradient-to-r from-[#FA6131] to-[#e04e1f] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#FA6131]/20 flex justify-center items-center gap-2 hover:shadow-[#FA6131]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add to Menu
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Edit Item Modal ─────────────────────────────────────────────────
const EditItemModal = ({ item, onClose, onSuccess, showToast }) => {
  const [form, setForm] = useState({
    name: item?.name || '',
    price: item?.price?.toString() || '',
    category: item?.category || '',
    description: item?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!item) return null;

  const hasChanges = () => {
    return (
      form.name.trim() !== (item.name || '') ||
      Number(form.price) !== (item.price || 0) ||
      form.category.trim() !== (item.category || '') ||
      form.description.trim() !== (item.description || '')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {};
      if (form.name.trim() !== item.name) payload.name = form.name.trim();
      if (Number(form.price) !== item.price) payload.price = Number(form.price);
      if (form.category.trim() !== (item.category || '')) payload.category = form.category.trim() || 'General';
      if (form.description.trim() !== (item.description || '')) payload.description = form.description.trim();

      // Only call API if there are actual changes
      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      await vendorService.updateMenuItem(item.id, payload);
      showToast('success', `"${form.name.trim()}" updated! ✏️`);
      onSuccess();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update menu item.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[#171B26] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-white">Edit Item</h3>
            <p className="text-xs text-gray-500 mt-0.5">Update the details of "{item.name}"</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Jollof Rice"
              required
              className={inputClass}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1500"
                required
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Rice"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional — short description of this item"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.price || !hasChanges()}
              className="flex-1 bg-gradient-to-r from-[#FA6131] to-[#e04e1f] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#FA6131]/20 flex justify-center items-center gap-2 hover:shadow-[#FA6131]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Static money formatter (used outside component scope) ───────────
const formatMoneyStatic = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);

// ── Delete Confirmation Modal ───────────────────────────────────────
const DeleteConfirmModal = ({ item, onClose, onConfirm, deleting }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#171B26] border border-red-500/20 rounded-3xl p-6 shadow-2xl shadow-red-500/5 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-400" />
          </div>

          <h3 className="text-lg font-extrabold text-white mb-2">Delete Item?</h3>
          <p className="text-sm text-gray-400 mb-1">
            This will permanently remove
          </p>
          <p className="text-sm font-bold text-white mb-1">"{item.name}"</p>
          <p className="text-xs text-gray-500 mb-6">
            at {formatMoneyStatic(item.price)} from your menu. This cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(item)}
              disabled={deleting}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Menu Item Card ──────────────────────────────────────────────────
const MenuItemCard = ({ item, onEdit, onDelete, onToggle, updatingId }) => {
  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        item.is_available
          ? 'bg-white/[0.03] border-white/5 hover:border-white/10'
          : 'bg-white/[0.01] border-white/[0.03]'
      }`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm md:text-base font-bold truncate ${
              item.is_available ? 'text-white' : 'text-gray-500 line-through'
            }`}>
              {item.name}
            </h4>
            {!item.is_available && (
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                Sold out
              </span>
            )}
          </div>

          <p className="text-[#FA6131] font-extrabold text-sm">
            {formatMoneyStatic(item.price)}
          </p>

          {item.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Category badge */}
          {item.category && (
            <div className="mt-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Toggle */}
          <button
            onClick={() => onToggle(item)}
            disabled={updatingId === item.id}
            className={`relative w-14 h-7 rounded-full p-0.5 cursor-pointer transition-all duration-300 ${
              item.is_available
                ? 'bg-green-500/20 border border-green-500/40'
                : 'bg-gray-800 border border-gray-700'
            } ${updatingId === item.id ? 'opacity-50 cursor-wait' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center ${
              item.is_available
                ? 'translate-x-7 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'translate-x-0 bg-gray-600'
            }`}>
              {updatingId === item.id ? (
                <Loader2 size={12} className="animate-spin text-white" />
              ) : item.is_available ? (
                <Check size={12} className="text-white" strokeWidth={3} />
              ) : (
                <X size={12} className="text-white/40" strokeWidth={3} />
              )}
            </div>
          </button>

          {/* Edit & Delete buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-gray-500 hover:text-[#2CD6EB] hover:bg-[#2CD6EB]/10 hover:border-[#2CD6EB]/20 transition-all"
              title="Edit item"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
              title="Delete item"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Menu Manager ───────────────────────────────────────────────
const VendorMenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Edit & Delete state
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getMenu();
      setMenuItems(Array.isArray(data) ? data : []);
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
      showToast('success', newStatus ? `"${item.name}" is now available ✅` : `"${item.name}" marked as sold out`);
    } catch (err) {
      // Revert on failure
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, is_available: item.is_available } : m));
      showToast('error', getApiErrorMessage(err, 'Failed to update item status.'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (item) => {
    setDeleteLoading(true);
    try {
      // Optimistic removal
      setMenuItems(prev => prev.filter(m => m.id !== item.id));
      setDeletingItem(null);

      await vendorService.deleteMenuItem(item.id);
      showToast('success', `"${item.name}" removed from menu 🗑️`);
    } catch (err) {
      // Revert on failure — re-fetch to get accurate state
      showToast('error', getApiErrorMessage(err, 'Failed to delete item.'));
      fetchMenu();
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
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

  const availableCount = menuItems.filter(i => i.is_available).length;
  const soldOutCount = menuItems.filter(i => !i.is_available).length;

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col h-full bg-[#0f1118] max-w-4xl mx-auto pb-24">
      {/* Toast */}
      <Toast toast={toast} />

      {/* Header section */}
      <div className="mb-6 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Menu Manager</h2>
            <p className="text-sm text-gray-500 mt-1">Add, edit, and manage your listings.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FA6131] to-[#e04e1f] hover:from-[#ff7040] hover:to-[#FA6131] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#FA6131]/20 hover:shadow-[#FA6131]/40 hover:scale-[1.02] active:scale-[0.98] self-start"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>

        {/* Stats bar */}
        {menuItems.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              {menuItems.length} items
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/10">
              {availableCount} available
            </span>
            {soldOutCount > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/10">
                {soldOutCount} sold out
              </span>
            )}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6 shrink-0 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all"
          placeholder="Search your menu..."
        />
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
          <p>{error}</p>
          <button onClick={fetchMenu} className="mt-4 px-6 py-2 bg-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-colors">Retry</button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {Object.keys(groupedMenu).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <UtensilsCrossed size={28} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No menu items found</h3>
              <p className="text-gray-500 max-w-sm text-sm mb-6">
                {searchQuery ? "No items match your search." : "Your menu is empty. Add some items to get started!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-[#FA6131] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                  <Plus size={16} /> Add First Item
                </button>
              )}
            </div>
          ) : (
            Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full px-1 mb-3 group"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#2CD6EB] uppercase tracking-[0.15em]">{category}</h3>
                    <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{items.length}</span>
                  </div>
                  {collapsedCategories[category]
                    ? <ChevronDown size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                    : <ChevronUp size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  }
                </button>

                {/* Items */}
                {!collapsedCategories[category] && (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={setEditingItem}
                        onDelete={setDeletingItem}
                        onToggle={handleToggle}
                        updatingId={updatingId}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Mobile FAB ────────────────────────── */}
      <button
        onClick={() => setShowAddModal(true)}
        className="sm:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#FA6131] to-[#e04e1f] flex items-center justify-center shadow-xl shadow-[#FA6131]/30 hover:shadow-[#FA6131]/50 hover:scale-110 active:scale-95 transition-all z-40"
        aria-label="Add menu item"
      >
        <Plus size={24} className="text-white" />
      </button>

      {/* ── Add Item Modal ────────────────────── */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchMenu}
        showToast={showToast}
      />

      {/* ── Edit Item Modal ────────────────────── */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={fetchMenu}
          showToast={showToast}
        />
      )}

      {/* ── Delete Confirmation Modal ────────────── */}
      {deletingItem && (
        <DeleteConfirmModal
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          deleting={deleteLoading}
        />
      )}
    </div>
  );
};

export default VendorMenuManager;
