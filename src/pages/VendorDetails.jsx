import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Save, Trash2, ExternalLink, Copy, Check,
  QrCode, Phone, CreditCard, Tag, Hash, Calendar, RefreshCw, KeyRound,
  ToggleLeft, ToggleRight, User, Link2, Loader2, AlertTriangle, Utensils,
  Plus, X, CheckCircle2, XCircle, ShieldCheck
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { getApiErrorMessage } from '../services/api';
import VendorQRCard from '../components/VendorQRCard';

const FIELD_CLASS =
  'w-full bg-[#0f1118] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all duration-200';

const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
      <Icon size={13} className="text-gray-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] uppercase font-bold tracking-widest text-gray-600 mb-0.5">{label}</p>
      <p className={`text-sm text-white truncate ${mono ? 'font-mono' : 'font-medium'}`}>
        {value || <span className="text-gray-600 italic">—</span>}
      </p>
    </div>
  </div>
);

const VendorDetails = () => {
  const { id: vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'menu'

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [copied, setCopied] = useState(null);
  const [showQRCard, setShowQRCard] = useState(false);

  // Pairing code regeneration
  const [regeneratingPairing, setRegeneratingPairing] = useState(false);
  const [confirmRegeneratePairing, setConfirmRegeneratePairing] = useState(false);

  // Account provisioning
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const [registerLoading, setRegisterLoading] = useState(false);

  // Menu Overrides state
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuFormData, setMenuFormData] = useState({ name: '', price: '', category: 'General', description: '', is_available: true });
  const [menuActionLoading, setMenuActionLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVendor = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getVendorById(vendorId);
      setVendor(data);
      setEditData({
        business_name:  data.business_name  || '',
        owner_name:     data.owner_name     || '',
        whatsapp_number: data.whatsapp_number || '',
        bank_details:   data.bank_details   || '',
        bank_code:      data.bank_code      || '',
        account_number: data.account_number || '',
        account_name:   data.account_name   || '',
        is_active:      data.is_active ?? true,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load vendor details.'));
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorMenu = useCallback(async () => {
    if (!vendorId) return;
    setMenuLoading(true);
    setMenuError(null);
    try {
      const items = await adminService.getVendorMenu(vendorId);
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (err) {
      setMenuError(getApiErrorMessage(err, 'Failed to load vendor menu.'));
    } finally {
      setMenuLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) fetchVendor();
  }, [vendorId]);

  useEffect(() => {
    if (activeTab === 'menu') {
      fetchVendorMenu();
    }
  }, [activeTab, fetchVendorMenu]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await adminService.updateVendor(vendorId, {
        business_name:   editData.business_name?.trim(),
        owner_name:      editData.owner_name?.trim(),
        whatsapp_number: editData.whatsapp_number?.trim(),
        bank_details:    editData.bank_details?.trim(),
        bank_code:       editData.bank_code?.trim()      || undefined,
        account_number:  editData.account_number?.trim() || undefined,
        account_name:    editData.account_name?.trim()   || undefined,
        is_active:       editData.is_active,
      });
      await fetchVendor();
      setEditing(false);
      showToast('success', 'Vendor details updated! ✨');
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'Failed to save changes.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteVendor(vendorId);
      navigate('/admin/vendors');
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'Failed to remove vendor.'));
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleRegeneratePairingCode = async () => {
    setRegeneratingPairing(true);
    try {
      const res = await adminService.regeneratePairingCode(vendorId);
      setVendor((p) => ({ ...p, pairing_code: res.pairing_code || res.code }));
      setConfirmRegeneratePairing(false);
      showToast('success', 'Fresh pairing code generated! 🔑');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to regenerate pairing code.'));
    } finally {
      setRegeneratingPairing(false);
    }
  };

  const handleRegisterOwnerAccount = async (e) => {
    e.preventDefault();
    if (!registerData.email || !registerData.password) return;
    setRegisterLoading(true);
    try {
      await adminService.registerAdminUser({
        email: registerData.email.trim(),
        password: registerData.password,
        role: 'vendor_owner',
        vendor_id: Number(vendorId),
      });
      setShowRegisterModal(false);
      setRegisterData({ email: '', password: '' });
      showToast('success', `Owner account created for ${registerData.email}! 🛡️`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to register owner account.'));
    } finally {
      setRegisterLoading(false);
    }
  };

  // Menu item CRUD handlers
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuFormData.name || !menuFormData.price) return;
    setMenuActionLoading(true);
    try {
      const created = await adminService.addMenuItem(vendorId, {
        name: menuFormData.name.trim(),
        price: Number(menuFormData.price),
        category: menuFormData.category?.trim() || 'General',
        description: menuFormData.description?.trim() || undefined,
        is_available: menuFormData.is_available,
      });
      setMenuItems((prev) => [created, ...prev]);
      setShowAddMenuModal(false);
      setMenuFormData({ name: '', price: '', category: 'General', description: '', is_available: true });
      showToast('success', `Menu item "${created.name}" added! 🍲`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to add menu item.'));
    } finally {
      setMenuActionLoading(false);
    }
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    if (!editingMenuItem || !menuFormData.name || !menuFormData.price) return;
    setMenuActionLoading(true);
    try {
      const updated = await adminService.updateMenuItem(vendorId, editingMenuItem.id, {
        name: menuFormData.name.trim(),
        price: Number(menuFormData.price),
        category: menuFormData.category?.trim() || 'General',
        description: menuFormData.description?.trim() || undefined,
        is_available: menuFormData.is_available,
      });
      setMenuItems((prev) => prev.map((item) => (item.id === editingMenuItem.id ? updated : item)));
      setEditingMenuItem(null);
      showToast('success', 'Menu item updated! ✏️');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to update menu item.'));
    } finally {
      setMenuActionLoading(false);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    setMenuActionLoading(true);
    try {
      await adminService.deleteMenuItem(vendorId, itemId);
      setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast('success', 'Menu item removed.');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to delete menu item.'));
    } finally {
      setMenuActionLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch { return iso; }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10 relative">
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
      <div className="flex items-center gap-4 bg-[#1e2333] border border-white/5 p-5 rounded-2xl">
        <button
          onClick={() => navigate('/admin/vendors')}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-extrabold text-white truncate">
            {loading ? 'Loading...' : vendor?.business_name || 'Vendor Detail'}
          </h2>
          {vendor && (
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{vendor.vendor_id}</p>
          )}
        </div>
        {!editing && !loading && vendor && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all"
          >
            <Edit2 size={14} /> Edit Info
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'details'
              ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/30 text-[#2CD6EB]'
              : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <User size={15} /> Vendor Overview
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeTab === 'menu'
              ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/30 text-[#2CD6EB]'
              : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Utensils size={15} /> Menu Management ({menuItems.length})
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={28} className="animate-spin text-[#2CD6EB]" />
          <p className="text-gray-600 text-sm">Loading vendor details...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-0.5 text-sm">Error Loading Details</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & DETAILS */}
      {!loading && !error && vendor && activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* ── Left Column ── */}
          <div className="md:col-span-2 space-y-5">
            {/* Status badge */}
            <div className="flex items-center justify-between bg-[#1e2333] border border-white/5 px-5 py-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  vendor.is_active
                    ? 'bg-[#2CD6EB]/10 text-[#2CD6EB] border border-[#2CD6EB]/20'
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${vendor.is_active ? 'bg-[#2CD6EB]' : 'bg-gray-600'}`} />
                  {vendor.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">
                  {vendor.active_menu_items_count ?? vendor.menu_count ?? 0} active menu items
                </span>
              </div>

              {/* Provision Owner Credentials Button */}
              <button
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold transition-all"
              >
                <ShieldCheck size={14} /> Provision Owner Acc
              </button>
            </div>

            {/* Edit form */}
            {editing ? (
              <div className="space-y-4 bg-[#1e2333] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#2CD6EB] mb-1">Edit Vendor Info</h3>

                {saveError && (
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {saveError}
                  </div>
                )}

                {[
                  { key: 'business_name',  label: 'Business Name' },
                  { key: 'owner_name',     label: 'Owner Name' },
                  { key: 'whatsapp_number',label: 'WhatsApp Number' },
                  { key: 'bank_details',   label: 'Bank Details (Legacy)' },
                  { key: 'bank_code',      label: 'Bank Code (e.g. 058)' },
                  { key: 'account_number', label: 'Account Number' },
                  { key: 'account_name',   label: 'Account Name' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={editData[key] ?? ''}
                      onChange={(e) => setEditData((p) => ({ ...p, [key]: e.target.value }))}
                      className={FIELD_CLASS}
                    />
                  </div>
                ))}

                {/* Active toggle */}
                <div className="flex items-center justify-between py-2 border-t border-white/5 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active Status</span>
                  <button
                    type="button"
                    onClick={() => setEditData((p) => ({ ...p, is_active: !p.is_active }))}
                    className="flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    {editData.is_active
                      ? <ToggleRight size={28} className="text-[#2CD6EB]" />
                      : <ToggleLeft size={28} className="text-gray-600" />}
                    {editData.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FA6131] hover:bg-[#e04e1f] py-2.5 text-sm font-bold text-white transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setSaveError(null); }}
                    disabled={saving}
                    className="px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1e2333] border border-white/5 rounded-2xl px-5 py-1">
                <InfoRow icon={User}       label="Owner"               value={vendor.owner_name} />
                <InfoRow icon={Phone}      label="WhatsApp"            value={vendor.whatsapp_number} mono />
                <InfoRow icon={CreditCard} label="Bank Details"        value={vendor.bank_details} />
                <InfoRow icon={CreditCard} label="Bank Code"           value={vendor.bank_code} mono />
                <InfoRow icon={Hash}       label="Account Number"      value={vendor.account_number} mono />
                <InfoRow icon={User}       label="Account Name"        value={vendor.account_name} />
                <InfoRow icon={Tag}        label="Paystack Subaccount" value={vendor.subaccount_code} mono />
                <InfoRow icon={Tag}        label="Slug"                value={vendor.slug} mono />
                <InfoRow icon={Hash}       label="Vendor ID"           value={vendor.vendor_id} mono />
                <InfoRow icon={Hash}       label="Internal ID"         value={String(vendor.id ?? '—')} mono />
                <InfoRow icon={Phone}      label="Telegram Chat ID"    value={vendor.telegram_chat_id} mono />
                <InfoRow icon={Calendar}   label="Onboarded"           value={fmtDate(vendor.created_at)} />
              </div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-4">
            {/* Store link */}
            {vendor.slug && (
              <div className="bg-[#1e2333] border border-white/5 rounded-2xl p-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-3">Store Link</p>
                <div className="flex items-center gap-2 bg-[#0f1118] border border-white/5 rounded-xl px-3 py-2.5 mb-3">
                  <Link2 size={13} className="text-[#2CD6EB] shrink-0" />
                  <span className="text-[11px] font-mono text-gray-500 flex-1 truncate">
                    bukkaai.com.ng/order/<strong className="text-[#2CD6EB]">{vendor.slug}</strong>
                  </span>
                  <button
                    onClick={() => handleCopy(`https://bukkaai.com.ng/order/${vendor.slug}`, 'link')}
                    className="text-gray-600 hover:text-[#2CD6EB] transition-colors"
                  >
                    {copied === 'link' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/order/${vendor.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                  >
                    <ExternalLink size={13} /> View Store
                  </a>
                  <button
                    onClick={() => setShowQRCard(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-[#FA6131]/10 border border-white/10 hover:border-[#FA6131]/30 py-2.5 text-xs font-semibold text-gray-300 hover:text-[#FA6131] transition-all"
                  >
                    <QrCode size={13} /> Get QR Card
                  </button>
                </div>
              </div>
            )}

            {/* Pairing Code & Regeneration */}
            <div className="bg-[#0f1a2e] border border-blue-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Device Pairing Code</p>
                <button
                  onClick={() => setConfirmRegeneratePairing(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <RefreshCw size={11} /> Regenerate
                </button>
              </div>

              {vendor.pairing_code ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-extrabold text-blue-300 tracking-[0.2em]">
                    {vendor.pairing_code}
                  </span>
                  <button
                    onClick={() => handleCopy(vendor.pairing_code, 'pairing')}
                    className="w-9 h-9 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-all"
                  >
                    {copied === 'pairing' ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No active pairing code. Click Regenerate to issue a new code.</p>
              )}

              <p className="text-[11px] text-blue-300/60 leading-relaxed">
                Vendor sends{' '}
                <code className="bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 select-all">
                  /link {vendor.pairing_code || '<code>'}
                </code>{' '}
                to the bot to pair their device.
              </p>
            </div>

            {/* Danger zone */}
            <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-3">Danger Zone</p>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-bold text-red-400 transition-all"
                >
                  <Trash2 size={13} /> Remove Vendor
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-red-300 font-medium leading-relaxed">
                    Are you sure? This will soft-delete the vendor.
                  </p>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50"
                  >
                    {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    {deleting ? 'Removing...' : 'Yes, Remove'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENU OVERRIDES */}
      {!loading && !error && activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#1e2333] border border-white/5 px-5 py-4 rounded-2xl">
            <div>
              <h3 className="text-base font-extrabold text-white">Direct Vendor Menu Overrides</h3>
              <p className="text-xs text-gray-500">Superadmin menu override tools for {vendor?.business_name}</p>
            </div>
            <button
              onClick={() => {
                setMenuFormData({ name: '', price: '', category: 'General', description: '', is_available: true });
                setShowAddMenuModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FA6131] hover:bg-[#e04e1f] px-4 py-2 text-xs font-bold text-white transition-all"
            >
              <Plus size={14} /> Add Vendor Item
            </button>
          </div>

          {menuLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 size={24} className="animate-spin text-[#2CD6EB]" />
              <p className="text-xs text-gray-500">Fetching vendor menu items...</p>
            </div>
          ) : menuError ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs">
              {menuError}
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
              <Utensils size={32} className="mx-auto text-gray-600" />
              <p className="text-sm font-bold text-gray-400">No menu items found for this vendor.</p>
              <p className="text-xs text-gray-600">Click "Add Vendor Item" to seed a menu item directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1e2333] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        item.is_available ?? true
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        {item.is_available ?? true ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-xs text-[#2CD6EB] font-extrabold mt-0.5">{formatMoney(item.price)}</p>
                    {item.category && (
                      <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Category: {item.category}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingMenuItem(item);
                        setMenuFormData({
                          name: item.name || '',
                          price: item.price || '',
                          category: item.category || 'General',
                          description: item.description || '',
                          is_available: item.is_available ?? true,
                        });
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      title="Edit Item"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      disabled={menuActionLoading}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50"
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Regenerate Pairing Confirmation Modal */}
      {confirmRegeneratePairing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmRegeneratePairing(false)} />
          <div className="relative w-full max-w-md bg-[#171B26] border border-blue-500/20 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <KeyRound size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-white">Regenerate Pairing Code?</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                This will invalidate any previous unlinked pairing code for <span className="text-white font-semibold">{vendor?.business_name}</span>.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmRegeneratePairing(false)}
                disabled={regeneratingPairing}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegeneratePairingCode}
                disabled={regeneratingPairing}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {regeneratingPairing ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Provisioning Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowRegisterModal(false)} />
          <div className="relative w-full max-w-md bg-[#171B26] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-[#2CD6EB]">
                <ShieldCheck size={20} />
                <h3 className="text-base font-extrabold text-white">Provision Vendor Owner Account</h3>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRegisterOwnerAccount} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="owner@example.com"
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="VendorPass123!"
                  className={FIELD_CLASS}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold text-gray-400 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#2CD6EB] text-[#0F121C] text-xs font-bold hover:bg-[#20b8cb] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {registerLoading ? <Loader2 size={15} className="animate-spin" /> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Menu Item Modal */}
      {(showAddMenuModal || editingMenuItem) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { setShowAddMenuModal(false); setEditingMenuItem(null); }} />
          <div className="relative w-full max-w-md bg-[#171B26] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-extrabold text-white">
                {editingMenuItem ? 'Edit Vendor Menu Item' : 'Add Vendor Menu Item'}
              </h3>
              <button onClick={() => { setShowAddMenuModal(false); setEditingMenuItem(null); }} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={editingMenuItem ? handleUpdateMenuItem : handleAddMenuItem} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Beef Suya, Coke, Jollof Rice"
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Price (₦) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={menuFormData.price}
                  onChange={(e) => setMenuFormData((p) => ({ ...p, price: e.target.value }))}
                  placeholder="1500"
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Category</label>
                <input
                  type="text"
                  value={menuFormData.category}
                  onChange={(e) => setMenuFormData((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. Meat, Rice, Drinks"
                  className={FIELD_CLASS}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Available</span>
                <button
                  type="button"
                  onClick={() => setMenuFormData((p) => ({ ...p, is_available: !p.is_available }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    menuFormData.is_available
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-white/5 border-white/10 text-gray-500'
                  }`}
                >
                  {menuFormData.is_available ? 'Available' : 'Unavailable'}
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddMenuModal(false); setEditingMenuItem(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold text-gray-400 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={menuActionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#FA6131] text-white text-xs font-bold hover:bg-[#e04e1f] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {menuActionLoading ? <Loader2 size={15} className="animate-spin" /> : editingMenuItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Card Modal */}
      {showQRCard && vendor?.slug && (
        <VendorQRCard
          slug={vendor.slug}
          vendorName={vendor.business_name}
          onClose={() => setShowQRCard(false)}
        />
      )}
    </div>
  );
};

export default VendorDetails;
