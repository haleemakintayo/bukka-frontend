import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Save, Trash2, ExternalLink, Copy, Check,
  QrCode, Phone, CreditCard, Tag, Hash, Calendar,
  ToggleLeft, ToggleRight, User, Link2, Loader2, AlertTriangle,
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

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [copied, setCopied] = useState(null);
  const [showQRCard, setShowQRCard] = useState(false);

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

  useEffect(() => { if (vendorId) fetchVendor(); }, [vendorId]);

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

  const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch { return iso; }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
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
            <Edit2 size={14} /> Edit
          </button>
        )}
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

      {!loading && !error && vendor && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* ── Left Column ── */}
          <div className="md:col-span-2 space-y-5">
            {/* Status badge */}
            <div className="flex items-center gap-3 bg-[#1e2333] border border-white/5 px-5 py-4 rounded-2xl">
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

            {/* Pairing Code */}
            {vendor.pairing_code && (
              <div className="bg-[#0f1a2e] border border-blue-500/20 rounded-2xl p-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400 mb-3">Pairing Code</p>
                <div className="flex items-center justify-between gap-3 mb-3">
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
                <p className="text-[11px] text-blue-300/60 leading-relaxed">
                  Vendor sends{' '}
                  <code className="bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 select-all">
                    /link {vendor.pairing_code}
                  </code>{' '}
                  to the bot to pair their device.
                </p>
              </div>
            )}

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
