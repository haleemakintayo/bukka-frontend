import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Save, Trash2, ExternalLink, Copy, Check,
  QrCode, Phone, CreditCard, Tag, Hash, Calendar,
  ToggleLeft, ToggleRight, User, Link2, Loader2, AlertTriangle,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { getApiErrorMessage, resolveAssetUrl } from '../services/api';

const FIELD_CLASS =
  'w-full bg-white dark:bg-[#171B26] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all duration-200';

const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/5 last:border-0">
    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
      <Icon size={14} className="text-gray-400" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm text-gray-900 dark:text-white truncate ${mono ? 'font-mono' : 'font-medium'}`}>
        {value || <span className="text-gray-400 dark:text-gray-600 italic">—</span>}
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
      const data = await adminService.getVendorById(vendorId);
      setVendor(data);
      setEditData({
        business_name: data.business_name || '',
        owner_name: data.owner_name || '',
        whatsapp_number: data.whatsapp_number || '',
        bank_details: data.bank_details || '',
        bank_code: data.bank_code || '',
        account_number: data.account_number || '',
        account_name: data.account_name || '',
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
      await adminService.updateVendor(vendorId, {
        business_name: editData.business_name?.trim(),
        owner_name: editData.owner_name?.trim(),
        whatsapp_number: editData.whatsapp_number?.trim(),
        bank_details: editData.bank_details?.trim(),
        bank_code: editData.bank_code?.trim() || undefined,
        account_number: editData.account_number?.trim() || undefined,
        account_name: editData.account_name?.trim() || undefined,
        is_active: editData.is_active,
      });
      await fetchVendor();
      setEditing(false);
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
      const { publicService } = await import('../services/publicService');
      const qrData = await publicService.getVendorQR(vendor.slug);
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
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white dark:bg-bukka-card-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <button
          onClick={() => navigate('/admin/vendors')}
          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white truncate">
            {loading ? 'Loading...' : vendor?.business_name || 'Vendor Detail'}
          </h2>
          {vendor && (
            <p className="text-sm text-gray-500 mt-0.5 font-mono">{vendor.vendor_id}</p>
          )}
        </div>
        {!editing && !loading && vendor && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <Edit2 size={16} /> Edit
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 size={32} className="animate-spin text-bukka-cyan" />
          <p className="text-gray-500">Loading vendor details...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1">Error Loading Details</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && vendor && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            {/* Status badge */}
            <div className="flex items-center gap-4 bg-white dark:bg-bukka-card-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider ${
                vendor.is_active
                  ? 'bg-bukka-cyan/10 text-bukka-cyan'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${vendor.is_active ? 'bg-bukka-cyan' : 'bg-gray-400 dark:bg-gray-500'}`} />
                {vendor.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {vendor.active_menu_items_count ?? vendor.menu_count ?? 0} active menu items
              </span>
            </div>

            {/* Edit form */}
            {editing ? (
              <div className="space-y-5 bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-white/10 shadow-sm rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-bukka-cyan mb-2">Edit Vendor Info</h3>

                {saveError && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
                    {saveError}
                  </div>
                )}

                {[
                  { key: 'business_name', label: 'Business Name' },
                  { key: 'owner_name', label: 'Owner Name' },
                  { key: 'whatsapp_number', label: 'WhatsApp Number' },
                  { key: 'bank_details', label: 'Bank Details (Legacy)' },
                  { key: 'bank_code', label: 'Bank Code (e.g. 058)' },
                  { key: 'account_number', label: 'Account Number' },
                  { key: 'account_name', label: 'Account Name' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
                    <input
                      type="text"
                      value={editData[key] ?? ''}
                      onChange={(e) => setEditData((p) => ({ ...p, [key]: e.target.value }))}
                      className={FIELD_CLASS}
                    />
                  </div>
                ))}

                {/* Active toggle */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-white/10 mt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Status</span>
                  <button
                    type="button"
                    onClick={() => setEditData((p) => ({ ...p, is_active: !p.is_active }))}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {editData.is_active
                      ? <ToggleRight size={32} className="text-bukka-cyan" />
                      : <ToggleLeft size={32} className="text-gray-400 dark:text-gray-500" />}
                    {editData.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-bukka-orange py-3 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setSaveError(null); }}
                    disabled={saving}
                    className="px-6 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Info cards */
              <div className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-white/10 shadow-sm rounded-2xl px-6 py-2">
                <InfoRow icon={User} label="Owner" value={vendor.owner_name} />
                <InfoRow icon={Phone} label="WhatsApp" value={vendor.whatsapp_number} mono />
                <InfoRow icon={CreditCard} label="Bank Details (Legacy)" value={vendor.bank_details} />
                <InfoRow icon={CreditCard} label="Bank Code" value={vendor.bank_code} mono />
                <InfoRow icon={Hash} label="Account Number" value={vendor.account_number} mono />
                <InfoRow icon={User} label="Account Name" value={vendor.account_name} />
                <InfoRow icon={Tag} label="Paystack Subaccount" value={vendor.subaccount_code} mono />
                <InfoRow icon={Tag} label="Slug" value={vendor.slug} mono />
                <InfoRow icon={Hash} label="Vendor ID" value={vendor.vendor_id} mono />
                <InfoRow icon={Hash} label="Internal ID" value={String(vendor.id ?? '—')} mono />
                <InfoRow icon={Phone} label="Telegram Chat ID" value={vendor.telegram_chat_id} mono />
                <InfoRow icon={Calendar} label="Onboarded" value={fmtDate(vendor.created_at)} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Store link */}
            {vendor.slug && (
              <div className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-white/10 shadow-sm rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Store Link</p>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#171B26] border border-gray-100 dark:border-white/5 rounded-xl px-3 py-3 mb-4">
                  <Link2 size={16} className="text-bukka-cyan shrink-0" />
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400 flex-1 truncate">
                    bukkaai.com.ng/order/<strong className="text-bukka-cyan">{vendor.slug}</strong>
                  </span>
                  <button
                    onClick={() => handleCopy(`https://bukkaai.com.ng/order/${vendor.slug}`, 'link')}
                    className="text-gray-400 hover:text-bukka-cyan transition-colors"
                  >
                    {copied === 'link' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/order/${vendor.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                    <ExternalLink size={16} /> View Store
                  </a>
                  <button
                    onClick={handleOpenQR}
                    disabled={qrLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all disabled:opacity-50"
                  >
                    {qrLoading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                    {qrLoading ? 'Loading...' : 'Get QR Code'}
                  </button>
                </div>
              </div>
            )}

            {/* Pairing Code */}
            {vendor.pairing_code && (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 shadow-sm rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Device Pairing Code</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-[0.2em]">
                    {vendor.pairing_code}
                  </span>
                  <button
                    onClick={() => handleCopy(vendor.pairing_code, 'pairing')}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-white/20 text-blue-600 dark:text-blue-400 transition-all shadow-sm"
                  >
                    {copied === 'pairing' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-4 leading-relaxed font-medium">
                  Vendor sends <code className="bg-white dark:bg-blue-900/50 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 select-all">/link {vendor.pairing_code}</code> to the bot to pair their device.
                </p>
              </div>
            )}

            {/* Danger zone */}
            <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 shadow-sm rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-4">Danger Zone</p>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-red-500/10 hover:bg-red-50 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 transition-all shadow-sm"
                >
                  <Trash2 size={16} /> Remove Vendor
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-red-600 dark:text-red-300 font-semibold leading-relaxed">
                    Are you sure? This will soft-delete the vendor and cannot be undone easily.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-3 text-sm font-bold text-white transition-all shadow-md disabled:opacity-50"
                    >
                      {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      {deleting ? 'Removing...' : 'Yes, Remove Vendor'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;
