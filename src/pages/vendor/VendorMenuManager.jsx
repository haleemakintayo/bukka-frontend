import React, { useState, useEffect, useCallback } from 'react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import {
  Loader2, Check, X, Search, Plus, UtensilsCrossed,
  Pencil, Trash2, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Tag, Box
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

const inputClass =
  'w-full bg-[#0f1118] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FA6131] focus:ring-1 focus:ring-[#FA6131]/50 transition-all';

const UNIT_TYPE_OPTIONS = [
  { value: 'per_portion', label: 'Per Portion', icon: '🍛' },
  { value: 'per_piece', label: 'Per Piece', icon: '🍗' },
  { value: 'flat_fee', label: 'Flat Fee', icon: '📦' },
];

// ── Add Item Modal (V2 System) ──────────────────────────────────────
const AddItemModal = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Rice',
    unit_type: 'per_portion',
    stock_qty: '',
    reorder_level: '',
    is_compulsory: false,
    description: '',
  });
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
        unit_type: form.unit_type,
        is_compulsory: form.is_compulsory,
      };
      if (form.stock_qty !== '') payload.stock_qty = Number(form.stock_qty);
      if (form.reorder_level !== '') payload.reorder_level = Number(form.reorder_level);
      if (form.description.trim()) payload.description = form.description.trim();

      await vendorService.addMenuV2Item(payload);
      setForm({
        name: '',
        price: '',
        category: 'Rice',
        unit_type: 'per_portion',
        stock_qty: '',
        reorder_level: '',
        is_compulsory: false,
        description: '',
      });
      showToast('success', `"${payload.name}" added to V2 menu! 🎉`);
      onSuccess();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to add menu item.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[#171B26] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-white">Add Menu Item (V2)</h3>
            <p className="text-xs text-gray-500">Configure prices, stock, and compulsory checkout items.</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Item Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Jollof Rice, Takeaway Pack"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Price (₦) *</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1500"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Rice, Extras"
                className={inputClass}
              />
            </div>
          </div>

          {/* Unit Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Unit Portioning</label>
            <div className="grid grid-cols-3 gap-2">
              {UNIT_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, unit_type: opt.value })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    form.unit_type === opt.value
                      ? 'bg-[#FA6131]/10 border-[#FA6131]/40 text-[#FA6131]'
                      : 'bg-white/5 border-white/5 text-gray-500'
                  }`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Tracking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Stock Qty (Optional)</label>
              <input
                type="number"
                min="0"
                value={form.stock_qty}
                onChange={(e) => setForm({ ...form, stock_qty: e.target.value })}
                placeholder="Untracked"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Low-Stock Alert Level</label>
              <input
                type="number"
                min="0"
                value={form.reorder_level}
                onChange={(e) => setForm({ ...form, reorder_level: e.target.value })}
                placeholder="5"
                className={inputClass}
              />
            </div>
          </div>

          {/* Compulsory Item Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#2CD6EB]" /> Compulsory Checkout Item
              </p>
              <p className="text-[10px] text-gray-500">Auto-injected into customer cart (e.g. Takeaway Pack)</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_compulsory: !form.is_compulsory })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                form.is_compulsory
                  ? 'bg-[#2CD6EB]/20 border-[#2CD6EB]/40 text-[#2CD6EB]'
                  : 'bg-white/5 border-white/5 text-gray-500'
              }`}
            >
              {form.is_compulsory ? 'Compulsory' : 'Optional'}
            </button>
          </div>

          <button
            type="submit"
            disabled={saving || !form.name.trim() || !form.price}
            className="w-full py-3 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FA6131]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add to Menu
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Edit Item Modal ──────────────────────────────────────────────────
const EditItemModal = ({ item, onClose, onSuccess, showToast }) => {
  const [form, setForm] = useState({
    name: item?.name || '',
    price: item?.price?.toString() || '',
    category: item?.category || '',
    description: item?.description || '',
    unit_type: item?.unit_type || 'per_portion',
    stock_qty: item?.stock_qty != null ? item.stock_qty.toString() : '',
    reorder_level: item?.reorder_level != null ? item.reorder_level.toString() : '',
    is_compulsory: item?.is_compulsory ?? false,
    is_available: item?.is_available ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!item) return null;

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
        unit_type: form.unit_type,
        is_compulsory: form.is_compulsory,
        is_available: form.is_available,
      };
      if (form.stock_qty !== '') payload.stock_qty = Number(form.stock_qty);
      if (form.reorder_level !== '') payload.reorder_level = Number(form.reorder_level);
      if (form.description.trim()) payload.description = form.description.trim();

      await vendorService.updateMenuV2Item(item.id, payload);
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[#171B26] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-base font-extrabold text-white">Edit Menu Item</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Item Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Price (₦) *</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Availability & Compulsory */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Availability</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_available: !form.is_available })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  form.is_available
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {form.is_available ? 'Available' : 'Sold Out'}
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Checkout Mode</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_compulsory: !form.is_compulsory })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  form.is_compulsory
                    ? 'bg-[#2CD6EB]/20 border-[#2CD6EB]/40 text-[#2CD6EB]'
                    : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                {form.is_compulsory ? 'Compulsory' : 'Optional'}
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold text-gray-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.price}
              className="flex-1 py-2.5 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Menu Manager ────────────────────────────────────────────────
const VendorMenuManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await vendorService.getMenuV2();
      } catch {
        data = await vendorService.getMenu();
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load menu items.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Instant Stock Toggle
  const handleToggleAvailability = async (item) => {
    setUpdatingId(item.id);
    const newStatus = !item.is_available;
    try {
      await vendorService.updateMenuV2Item(item.id, { is_available: newStatus });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
      );
      showToast('success', `${item.name} is now ${newStatus ? 'Available' : 'Sold Out'}`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to update stock status.'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await vendorService.deleteMenuItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setDeletingItem(null);
      showToast('success', `"${item.name}" removed from menu.`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to delete menu item.'));
    }
  };

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return String(item.name || '').toLowerCase().includes(q) || String(item.category || '').toLowerCase().includes(q);
    }
    return true;
  });

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto pb-24 relative">
      <Toast toast={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Menu & Inventory V2</h2>
          <p className="text-xs text-gray-500 mt-1">Manage prices, instant stock availability, and compulsory cart items.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FA6131] hover:bg-[#e04e1f] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-[#FA6131]/20 self-start"
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FA6131]/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === 'ALL'
                ? 'bg-[#FA6131]/10 border-[#FA6131]/30 text-[#FA6131]'
                : 'bg-white/[0.02] border-white/5 text-gray-400'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#FA6131]/10 border-[#FA6131]/30 text-[#FA6131]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading store menu…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
          <UtensilsCrossed size={28} className="mx-auto text-gray-600" />
          <p className="text-sm font-bold text-gray-400">No items match your criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                item.is_available
                  ? 'bg-white/[0.03] border-white/5'
                  : 'bg-white/[0.01] border-white/[0.03] opacity-60'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                  {item.is_compulsory && (
                    <span className="text-[9px] font-extrabold text-[#2CD6EB] bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 px-2 py-0.5 rounded-full uppercase">
                      Compulsory
                    </span>
                  )}
                  {!item.is_available && (
                    <span className="text-[9px] font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase">
                      Sold out
                    </span>
                  )}
                </div>

                <p className="text-[#FA6131] font-extrabold text-sm">{formatMoney(item.price)}</p>

                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  {item.category && <span>Cat: {item.category}</span>}
                  {item.stock_qty != null && <span>Stock: {item.stock_qty} available</span>}
                </div>
              </div>

              {/* Instant Stock Toggle & Action Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleAvailability(item)}
                  disabled={updatingId === item.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    item.is_available
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {updatingId === item.id ? <Loader2 size={12} className="animate-spin" /> : item.is_available ? 'Available' : 'Sold Out'}
                </button>

                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  title="Edit item"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => setDeletingItem(item)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  title="Delete item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchMenu}
        showToast={showToast}
      />

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={fetchMenu}
          showToast={showToast}
        />
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setDeletingItem(null)} />
          <div className="relative w-full max-w-sm bg-[#171B26] border border-red-500/20 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-base font-extrabold text-white">Delete "{deletingItem.name}"?</h3>
              <p className="text-xs text-gray-400 mt-1">This will permanently delete this item from your store menu.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeletingItem(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold text-gray-400">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(deletingItem)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMenuManager;
