import React, { useEffect, useState } from 'react';
import {
  X, Edit2, Save, Trash2, ExternalLink, Copy, Check,
  QrCode, Phone, CreditCard, Tag, Hash, Calendar,
  ToggleLeft, ToggleRight, User, Link2, Loader2, AlertTriangle,
} from 'lucide-react';
import { getAdminVendor, updateAdminVendor, deleteAdminVendor, getVendorQR, getApiErrorMessage, resolveAssetUrl } from '../services/api';

const FIELD_CLASS =
  'w-full bg-[#171B26] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all duration-200';

const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
      <Icon size={14} className="text-gray-400" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm text-white truncate ${mono ? 'font-mono' : 'font-medium'}`}>
        {value || <span className="text-gray-600 italic">—</span>}
      </p>
    </div>
  </div>
);

const VendorDetailPanel = ({ vendorId, onClose, onDeleted, onUpdated }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Copy / QR
  const [copied, setCopied] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  const fetchVendor = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminVendor(vendorId);
      setVendor(data);
      setEditData({
        business_name: data.business_name || '',
        owner_name: data.owner_name || '',
        whatsapp_number: data.whatsapp_number || '',
        bank_details: data.bank_details || '',
        is_active: data.is_active ?? true,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load vendor details.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchVendor();
  }, [vendorId]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateAdminVendor(vendorId, {
        business_name: editData.business_name?.trim(),
        owner_name: editData.owner_name?.trim(),
        whatsapp_number: editData.whatsapp_number?.trim(),
        bank_details: editData.bank_details?.trim(),
        is_active: editData.is_active,
      });
      await fetchVendor();
      setEditing(false);
      onUpdated?.();
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'Failed to save changes.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAdminVendor(vendorId);
      onDeleted?.();
      onClose();
    } catch (err) {
      setSaveError(getApiErrorMessage(err, 'Failed to remove vendor.'));
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleOpenQR = async () => {
    if (!vendor?.slug) return;
    setQrLoading(true);
    try {
      const qrData = await getVendorQR(vendor.slug);
      const url = resolveAssetUrl(qrData?.qr_image_url);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // silently fail
    } finally {
      setQrLoading(false);
    }
  };

  // Format date
  const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#1e2333] border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white">
              {loading ? 'Loading...' : vendor?.business_name || 'Vendor Detail'}
            </h2>
            {vendor && (
              <p className="text-xs text-gray-500 mt-0.5 font-mono">{vendor.vendor_id}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!editing && !loading && vendor && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-all"
              >
                <Edit2 size={13} /> Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={28} className="animate-spin text-[#2CD6EB]" />
              <p className="text-sm text-gray-500">Loading vendor details...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {!loading && !error && vendor && (
            <>
              {/* Status badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  vendor.is_active
                    ? 'bg-[#2CD6EB]/10 text-[#2CD6EB]'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${vendor.is_active ? 'bg-[#2CD6EB]' : 'bg-gray-500'}`} />
                  {vendor.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">
                  {vendor.active_menu_items_count ?? 0} active menu items
                </span>
              </div>

              {/* Edit form */}
              {editing ? (
                <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2CD6EB] mb-1">Edit Vendor Info</h3>

                  {saveError && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {saveError}
                    </div>
                  )}

                  {[
                    { key: 'business_name', label: 'Business Name' },
                    { key: 'owner_name', label: 'Owner Name' },
                    { key: 'whatsapp_number', label: 'WhatsApp Number' },
                    { key: 'bank_details', label: 'Bank Details' },
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Status</span>
                    <button
                      type="button"
                      onClick={() => setEditData((p) => ({ ...p, is_active: !p.is_active }))}
                      className="flex items-center gap-2 text-sm font-semibold text-white"
                    >
                      {editData.is_active
                        ? <ToggleRight size={28} className="text-[#2CD6EB]" />
                        : <ToggleLeft size={28} className="text-gray-500" />}
                      {editData.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FA6131] to-[#e04e1f] py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setSaveError(null); }}
                      disabled={saving}
                      className="px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Info cards */
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4">
                  <InfoRow icon={User} label="Owner" value={vendor.owner_name} />
                  <InfoRow icon={Phone} label="WhatsApp" value={vendor.whatsapp_number} mono />
                  <InfoRow icon={CreditCard} label="Bank Details" value={vendor.bank_details} />
                  <InfoRow icon={Tag} label="Slug" value={vendor.slug} mono />
                  <InfoRow icon={Hash} label="Vendor ID" value={vendor.vendor_id} mono />
                  <InfoRow icon={Hash} label="Internal ID" value={String(vendor.id ?? '—')} mono />
                  <InfoRow icon={Phone} label="Telegram Chat ID" value={vendor.telegram_chat_id} mono />
                  <InfoRow icon={Calendar} label="Onboarded" value={fmtDate(vendor.created_at)} />
                </div>
              )}

              {/* Pairing Code */}
              {vendor.pairing_code && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Device Pairing Code</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-2xl font-extrabold text-[#2CD6EB] tracking-[0.3em]">
                      {vendor.pairing_code}
                    </span>
                    <button
                      onClick={() => handleCopy(vendor.pairing_code, 'pairing')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                    >
                      {copied === 'pairing' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                      {copied === 'pairing' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Vendor sends <code className="bg-white/10 px-1 rounded text-[#2CD6EB]">/link {vendor.pairing_code}</code> to the bot to pair their device.</p>
                </div>
              )}

              {/* Store link */}
              {vendor.slug && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Store Link</p>
                  <div className="flex items-center gap-2 bg-[#171B26] rounded-xl px-3 py-2.5 mb-3">
                    <Link2 size={13} className="text-[#2CD6EB] shrink-0" />
                    <span className="text-xs font-mono text-gray-400 flex-1 truncate">
                      bukkaai.com.ng/order/<strong className="text-[#2CD6EB]">{vendor.slug}</strong>
                    </span>
                    <button
                      onClick={() => handleCopy(`https://bukkaai.com.ng/order/${vendor.slug}`, 'link')}
                      className="text-gray-500 hover:text-[#2CD6EB] transition-colors"
                    >
                      {copied === 'link' ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/order/${vendor.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                    >
                      <ExternalLink size={13} /> View Store
                    </a>
                    <button
                      onClick={handleOpenQR}
                      disabled={qrLoading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-all disabled:opacity-50"
                    >
                      {qrLoading ? <Loader2 size={13} className="animate-spin" /> : <QrCode size={13} />}
                      {qrLoading ? 'Loading...' : 'Get QR'}
                    </button>
                  </div>
                </div>
              )}

              {/* Danger zone */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Danger Zone</p>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={13} /> Remove Vendor
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-300 font-semibold">
                      Are you sure? This will soft-delete the vendor and cannot be undone easily.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50"
                      >
                        {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        {deleting ? 'Removing...' : 'Yes, Remove'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VendorDetailPanel;
