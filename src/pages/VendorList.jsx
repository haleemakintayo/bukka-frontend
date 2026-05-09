import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, Copy, ExternalLink, Link2, Plus, QrCode,
  RefreshCw, Search, Users, CheckCircle, Clock, Filter,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { getApiErrorMessage, resolveAssetUrl } from '../services/api';
import VendorDetailPanel from '../components/VendorDetailPanel';

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
  const [qrLoadingSlug, setQrLoadingSlug] = useState(null);
  const [activatingId, setActivatingId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

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

  // Count pending without extra request when in "all" tab
  const pendingCount = vendors.filter((v) => !v.is_active).length;

  const handleCopyLink = (slug) => {
    navigator.clipboard.writeText(`https://bukkaai.com.ng/order/${slug}`).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const handleOpenQr = async (slug) => {
    if (!slug) return;
    setQrLoadingSlug(slug);
    try {
      const qrData = await adminService.getVendorQR ? adminService.getVendorQR(slug) : null;
      // Fallback: construct QR url via public endpoint
      const { publicService } = await import('../services/publicService');
      const qr = await publicService.getVendorQR(slug);
      const url = resolveAssetUrl(qr?.qr_image_url);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load the vendor QR code.'));
    } finally {
      setQrLoadingSlug(null);
    }
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
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">
            vendor directory
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} onboarded
            {activeTab === 'all' && pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                {pendingCount} pending approval
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/onboard')}
          className="inline-flex items-center justify-center gap-2 bg-bukka-orange text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg rounded-full font-bold px-6 py-3 text-sm"
        >
          <Plus size={18} />
          Add New Vendor
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-bukka-dark-surface p-1 rounded-xl w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-bukka-card-surface text-gray-900 dark:text-bukka-soft-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
            {key === 'pending' && activeTab === 'all' && pendingCount > 0 && (
              <span className="ml-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Search & Refresh ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, slug, or vendor ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-bukka-dark-surface text-sm text-gray-900 dark:text-bukka-soft-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-bukka-cyan focus:ring-bukka-cyan focus:outline-none focus:ring-1 transition-colors shadow-sm"
          />
        </div>
        <button
          type="button"
          onClick={fetchVendors}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-bukka-dark-surface transition-colors shadow-sm bg-white dark:bg-bukka-card-surface"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm" role="alert">
          <strong className="font-bold">Error: </strong>{error}
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-6" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => <div key={j} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && filteredVendors.length === 0 && (
        <div className="bg-white dark:bg-bukka-card-surface shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 bg-gray-100 dark:bg-bukka-dark-surface rounded-full flex items-center justify-center mb-4">
            <Users size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
            {searchQuery ? 'No vendors match your search' : activeTab === 'pending' ? 'No pending vendors' : 'No vendors onboarded yet'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            {searchQuery ? 'Try a different search term.' : activeTab === 'pending' ? 'All vendors are currently active.' : 'Get started by onboarding your first vendor.'}
          </p>
          {!searchQuery && activeTab !== 'pending' && (
            <button onClick={() => navigate('/admin/onboard')} className="inline-flex items-center gap-2 bg-bukka-orange text-white rounded-full font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity shadow-md">
              <Plus size={16} /> Onboard First Vendor
            </button>
          )}
        </div>
      )}

      {/* ── Vendor Cards Grid ── */}
      {!loading && filteredVendors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.vendor_id || vendor.slug}
              onClick={() => setSelectedVendorId(vendor.id ?? vendor.vendor_id)}
              className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-[#2CD6EB]/40 hover:ring-1 hover:ring-[#2CD6EB]/20 cursor-pointer group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{vendor.business_name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{vendor.owner_name || '—'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Activate / Deactivate quick button */}
                  <button
                    type="button"
                    title={vendor.is_active ? 'Deactivate vendor' : 'Activate vendor'}
                    onClick={(e) => handleActivate(e, vendor)}
                    disabled={activatingId === vendor.vendor_id}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      vendor.is_active
                        ? 'bg-bukka-cyan/10 text-bukka-cyan hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    {activatingId === vendor.vendor_id ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : vendor.is_active ? (
                      <><CheckCircle size={10} /> Active</>
                    ) : (
                      <><Clock size={10} /> Pending</>
                    )}
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-bukka-dark-surface rounded-lg px-3 py-2">
                  <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Vendor ID</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-bukka-soft-white mt-0.5 font-mono">{vendor.vendor_id}</p>
                </div>
                <div className="bg-gray-50 dark:bg-bukka-dark-surface rounded-lg px-3 py-2">
                  <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Menu Items</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-bukka-soft-white mt-0.5">{vendor.menu_count ?? '—'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-bukka-dark-surface rounded-lg px-3 py-2">
                  <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Slug</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-bukka-soft-white mt-0.5 truncate" title={vendor.slug}>{vendor.slug || '—'}</p>
                </div>
              </div>

              {/* Store link */}
              {vendor.slug && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-bukka-dark-surface border border-gray-100 dark:border-gray-700/50 rounded-xl px-3.5 py-2.5 mb-4">
                  <Link2 size={14} className="text-bukka-cyan shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 font-mono">
                    bukkaai.com.ng/order/<strong className="text-bukka-cyan">{vendor.slug}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleCopyLink(vendor.slug); }}
                    className="text-gray-400 hover:text-bukka-cyan transition-colors p-1 shrink-0"
                    title="Copy store link"
                  >
                    {copiedSlug === vendor.slug ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                {vendor.slug ? (
                  <>
                    <a
                      href={`/order/${vendor.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-bukka-cyan hover:text-bukka-cyan transition-all"
                    >
                      <ExternalLink size={13} /> View Store
                    </a>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleOpenQr(vendor.slug); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-bukka-orange hover:text-bukka-orange transition-all"
                    >
                      <QrCode size={13} /> {qrLoadingSlug === vendor.slug ? 'Loading...' : 'Get QR'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleCopyLink(vendor.slug); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-green-500 hover:text-green-600 transition-all ml-auto"
                    >
                      {copiedSlug === vendor.slug ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Public storefront slug pending.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Vendor Detail Slide-over ── */}
      {selectedVendorId && (
        <VendorDetailPanel
          vendorId={selectedVendorId}
          onClose={() => setSelectedVendorId(null)}
          onDeleted={fetchVendors}
          onUpdated={fetchVendors}
        />
      )}
    </div>
  );
};

export default VendorList;
