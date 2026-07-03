import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, Copy, ExternalLink, Link2, Plus, QrCode,
  RefreshCw, Search, Users, CheckCircle, Clock,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { getApiErrorMessage } from '../services/api';
import VendorQRCard from '../components/VendorQRCard';

const TABS = [
  { key: 'all',     label: 'All',     icon: Users },
  { key: 'active',  label: 'Active',  icon: CheckCircle },
  { key: 'pending', label: 'Pending', icon: Clock },
];

const normaliseVendor = (v) => ({
  ...v,
  menu_count: v?.menu_count ?? v?.active_menu_items_count ?? 0,
  status: v?.is_active === false ? 'Inactive' : 'Active',
});

const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeTab, setActiveTab]       = useState('all');
  const [copiedSlug, setCopiedSlug]     = useState(null);
  const [activatingId, setActivatingId] = useState(null);
  const [qrVendor, setQrVendor]         = useState(null); // {slug, name}

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeTab === 'active')  params.is_active = true;
      if (activeTab === 'pending') params.is_active = false;
      const data = await adminService.getVendors(params);
      const list = Array.isArray(data) ? data : data?.vendors || [];
      setVendors(list.map(normaliseVendor));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load vendor directory.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, [activeTab]);

  const pendingCount = vendors.filter((v) => !v.is_active).length;

  const handleCopyLink = (e, slug) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://bukkaai.com.ng/order/${slug}`).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const handleActivate = async (e, vendor) => {
    e.stopPropagation();
    const newState = !vendor.is_active;
    setActivatingId(vendor.vendor_id);
    try {
      await adminService.activateVendor(vendor.vendor_id, newState);
      await fetchVendors();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update vendor status.'));
    } finally {
      setActivatingId(null);
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const q = searchQuery.toLowerCase();
    return (
      (vendor.business_name || '').toLowerCase().includes(q) ||
      (vendor.vendor_id    || '').toLowerCase().includes(q) ||
      (vendor.slug         || '').toLowerCase().includes(q) ||
      (vendor.owner_name   || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Vendor Directory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} onboarded
            {activeTab === 'all' && pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/onboard')}
          className="inline-flex items-center justify-center gap-2 bg-[#FA6131] hover:bg-[#e04e1f] text-white transition-all shadow-lg shadow-[#FA6131]/20 hover:shadow-[#FA6131]/40 rounded-xl font-bold px-5 py-2.5 text-sm"
        >
          <Plus size={17} />
          Add New Vendor
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-[#0f1118] border border-white/5 p-1 rounded-xl w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-[#1e2333] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
            {key === 'pending' && pendingCount > 0 && (
              <span className="ml-0.5 bg-yellow-500 text-black text-[9px] font-black rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Search & Refresh ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, slug, or vendor ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/5 bg-[#0f1118] text-sm text-white placeholder-gray-600 focus:border-[#2CD6EB]/50 focus:ring-1 focus:ring-[#2CD6EB]/30 focus:outline-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={fetchVendors}
          className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm" role="alert">
          <strong className="font-bold">Error: </strong>{error}
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1e2333] border border-white/5 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/2 mb-6" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => <div key={j} className="h-12 bg-white/5 rounded-lg" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && filteredVendors.length === 0 && (
        <div className="bg-[#1e2333] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[280px]">
          <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Users size={24} className="text-gray-600" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">
            {searchQuery ? 'No vendors match your search' : activeTab === 'pending' ? 'No pending vendors' : 'No vendors onboarded yet'}
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            {searchQuery ? 'Try a different search term.' : activeTab === 'pending' ? 'All vendors are currently active.' : 'Get started by onboarding your first vendor.'}
          </p>
          {!searchQuery && activeTab !== 'pending' && (
            <button onClick={() => navigate('/admin/onboard')} className="inline-flex items-center gap-2 bg-[#FA6131] text-white rounded-xl font-bold px-5 py-2.5 text-sm hover:bg-[#e04e1f] transition-colors">
              <Plus size={15} /> Onboard First Vendor
            </button>
          )}
        </div>
      )}

      {/* ── Vendor Cards Grid ── */}
      {!loading && filteredVendors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.vendor_id || vendor.slug}
              onClick={() => navigate(`/admin/vendors/${vendor.id ?? vendor.vendor_id}`)}
              className="bg-[#1e2333] border border-white/5 rounded-2xl p-5 transition-all hover:border-[#2CD6EB]/20 hover:bg-[#232a3b] cursor-pointer group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{vendor.business_name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{vendor.owner_name || '—'}</p>
                </div>
                <button
                  type="button"
                  title={vendor.is_active ? 'Deactivate vendor' : 'Activate vendor'}
                  onClick={(e) => handleActivate(e, vendor)}
                  disabled={activatingId === vendor.vendor_id}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider shrink-0 transition-all ${
                    vendor.is_active
                      ? 'bg-[#2CD6EB]/10 text-[#2CD6EB] border border-[#2CD6EB]/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'
                  }`}
                >
                  {activatingId === vendor.vendor_id ? (
                    <RefreshCw size={9} className="animate-spin" />
                  ) : vendor.is_active ? (
                    <><CheckCircle size={9} /> Active</>
                  ) : (
                    <><Clock size={9} /> Pending</>
                  )}
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Vendor ID', value: vendor.vendor_id },
                  { label: 'Menu Items', value: vendor.menu_count ?? '—' },
                  { label: 'Slug', value: vendor.slug || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#0f1118] rounded-lg px-2.5 py-2">
                    <p className="text-[9px] uppercase font-semibold text-gray-600 tracking-wider mb-0.5">{label}</p>
                    <p className="text-xs font-bold text-gray-300 truncate font-mono" title={String(value)}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Store link */}
              {vendor.slug && (
                <div className="flex items-center gap-2 bg-[#0f1118] border border-white/5 rounded-xl px-3 py-2 mb-3">
                  <Link2 size={12} className="text-[#2CD6EB] shrink-0" />
                  <span className="text-[11px] text-gray-500 truncate flex-1 font-mono">
                    bukkaai.com.ng/order/<strong className="text-[#2CD6EB]">{vendor.slug}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, vendor.slug)}
                    className="text-gray-600 hover:text-[#2CD6EB] transition-colors p-0.5 shrink-0"
                  >
                    {copiedSlug === vendor.slug ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                {vendor.slug ? (
                  <>
                    <a
                      href={`/order/${vendor.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 hover:border-[#2CD6EB]/30 hover:text-[#2CD6EB] px-3 py-1.5 text-xs font-semibold text-gray-400 transition-all"
                    >
                      <ExternalLink size={12} /> View Store
                    </a>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setQrVendor({ slug: vendor.slug, name: vendor.business_name }); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 hover:border-[#FA6131]/30 hover:text-[#FA6131] px-3 py-1.5 text-xs font-semibold text-gray-400 transition-all"
                    >
                      <QrCode size={12} /> QR Card
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, vendor.slug)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 hover:border-green-500/30 hover:text-green-400 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-all ml-auto"
                    >
                      {copiedSlug === vendor.slug ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-600 italic">Slug pending.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── QR Card Modal ── */}
      {qrVendor && (
        <VendorQRCard
          slug={qrVendor.slug}
          vendorName={qrVendor.name}
          onClose={() => setQrVendor(null)}
        />
      )}
    </div>
  );
};

export default VendorList;
