import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, ExternalLink, Copy, Search, RefreshCw, Users, Check, Link2, QrCode } from 'lucide-react';

const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      if (token === 'mock_token_for_prototype') {
        // Mock data for prototype demonstration
        await new Promise(r => setTimeout(r, 600));
        setVendors([
          {
            vendor_id: 'VEN-1001',
            business_name: 'Iya Basira Canteen',
            owner_name: 'Mrs Basira Adewale',
            slug: 'iya-basira-canteen',
            email: 'basira@example.com',
            status: 'Active',
            paired: true,
            menu_count: 12,
            created_at: '2026-04-10T08:30:00Z',
          },
          {
            vendor_id: 'VEN-1002',
            business_name: 'White House Bukka',
            owner_name: 'Mr Tunde Olamide',
            slug: 'white-house-bukka',
            email: 'whitehouse@example.com',
            status: 'Active',
            paired: true,
            menu_count: 8,
            created_at: '2026-04-12T14:00:00Z',
          },
          {
            vendor_id: 'VEN-1003',
            business_name: 'Amala Phase 2',
            owner_name: 'Alhaja Sidikat',
            slug: 'amala-phase-2',
            email: 'amala2@example.com',
            status: 'Active',
            paired: false,
            menu_count: 5,
            created_at: '2026-04-20T10:15:00Z',
          },
          {
            vendor_id: 'VEN-1004',
            business_name: 'Buka Express OOU',
            owner_name: 'Chef David Ojo',
            slug: 'buka-express-oou',
            email: 'bukaexpress@example.com',
            status: 'Inactive',
            paired: false,
            menu_count: 0,
            created_at: '2026-04-25T16:45:00Z',
          },
        ]);
      } else {
        const response = await axios.get('/api/v1/admin/vendors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setVendors(response.data?.vendors || response.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.response?.data?.detail || 'Failed to load vendor directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCopyLink = (slug) => {
    const link = `bukkaai.com.ng/order/${slug}`;
    navigator.clipboard.writeText(`https://${link}`).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const filteredVendors = vendors.filter(v => {
    const q = searchQuery.toLowerCase();
    return (
      (v.business_name || '').toLowerCase().includes(q) ||
      (v.vendor_id || '').toLowerCase().includes(q) ||
      (v.slug || '').toLowerCase().includes(q) ||
      (v.owner_name || '').toLowerCase().includes(q)
    );
  });

  // ─── Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">vendor directory</h2>
        </div>
        <div className="bg-white dark:bg-bukka-card-surface shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px]">
          <RefreshCw size={32} className="text-gray-400 dark:text-gray-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading vendor directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">vendor directory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} onboarded</p>
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

      {/* Search & Refresh Bar */}
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
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm" role="alert">
          <strong className="font-bold">Error: </strong>{error}
        </div>
      )}

      {/* Empty State */}
      {!error && filteredVendors.length === 0 && (
        <div className="bg-white dark:bg-bukka-card-surface shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 bg-gray-100 dark:bg-bukka-dark-surface rounded-full flex items-center justify-center mb-4">
            <Users size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
            {searchQuery ? 'No vendors match your search' : 'No vendors onboarded yet'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            {searchQuery ? 'Try a different search term.' : 'Get started by onboarding your first vendor — it only takes 60 seconds.'}
          </p>
          {!searchQuery && (
            <button onClick={() => navigate('/admin/onboard')} className="inline-flex items-center gap-2 bg-bukka-orange text-white rounded-full font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity shadow-md">
              <Plus size={16} /> Onboard First Vendor
            </button>
          )}
        </div>
      )}

      {/* Vendor Cards */}
      {filteredVendors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.vendor_id}
              className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md group"
            >
              {/* Top Row: Name + Status */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{vendor.business_name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{vendor.owner_name || '—'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Pairing Badge */}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    vendor.paired
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                  }`}>
                    {vendor.paired ? '✓ Paired' : '⏳ Unpaired'}
                  </span>
                  {/* Active/Inactive Badge */}
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    vendor.status === 'Active'
                      ? 'bg-bukka-cyan/10 text-bukka-cyan'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {vendor.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Info Row */}
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
                  <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Email</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-bukka-soft-white mt-0.5 truncate" title={vendor.email}>{vendor.email || '—'}</p>
                </div>
              </div>

              {/* Store Link Row */}
              {vendor.slug && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-bukka-dark-surface border border-gray-100 dark:border-gray-700/50 rounded-xl px-3.5 py-2.5 mb-4">
                  <Link2 size={14} className="text-bukka-cyan shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 font-mono">
                    bukkaai.com.ng/order/<strong className="text-bukka-cyan">{vendor.slug}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(vendor.slug)}
                    className="text-gray-400 hover:text-bukka-cyan transition-colors p-1 shrink-0"
                    title="Copy store link"
                  >
                    {copiedSlug === vendor.slug ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={`/order/${vendor.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-bukka-cyan hover:text-bukka-cyan transition-all"
                >
                  <ExternalLink size={13} /> View Store
                </a>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://bukkaai.com.ng/order/${vendor.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-bukka-orange hover:text-bukka-orange transition-all"
                >
                  <QrCode size={13} /> Get QR
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyLink(vendor.slug)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-green-500 hover:text-green-600 transition-all ml-auto"
                >
                  {copiedSlug === vendor.slug ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorList;
