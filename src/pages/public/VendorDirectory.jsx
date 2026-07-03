import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, QrCode, ShoppingBag, ChevronRight, Loader2, Frown, Utensils, MessageCircle } from 'lucide-react';
import { publicService } from '../../services/publicService';
import { getApiErrorMessage } from '../../services/api';
import VendorQRCard from '../../components/VendorQRCard';

// ── Skeleton Loader ─────────────────────────────────────────────────────────
const VendorSkeleton = () => (
  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-white/5 rounded w-full mb-2" />
    <div className="h-3 bg-white/5 rounded w-3/4 mb-4" />
    <div className="flex gap-2">
      <div className="h-8 bg-white/5 rounded-lg flex-1" />
      <div className="h-8 bg-white/5 rounded-lg w-16" />
    </div>
  </div>
);

// ── Vendor Card ──────────────────────────────────────────────────────────────
const VendorCard = ({ vendor, onQRClick }) => {
  const initials = (vendor.business_name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Deterministic avatar color based on name
  const colors = ['#FA6131', '#2CD6EB', '#a78bfa', '#34d399', '#f59e0b', '#ec4899'];
  const colorIdx = (vendor.business_name || '').charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIdx];

  return (
    <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar / Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-extrabold text-base shadow-lg"
          style={{ background: `linear-gradient(135deg, ${avatarColor}cc, ${avatarColor}66)` }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm truncate group-hover:text-[#FA6131] transition-colors">
            {vendor.business_name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{vendor.owner_name || 'Campus Vendor'}</p>
        </div>
        {/* Active badge */}
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 bg-green-500/10 text-green-400 border border-green-500/15">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Open
        </span>
      </div>

      {/* Description */}
      {vendor.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {vendor.description}
        </p>
      )}

      {/* Meta chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {vendor.location && (
          <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 rounded-full px-2.5 py-1 border border-white/5">
            <MapPin size={9} className="text-[#FA6131]" /> {vendor.location}
          </span>
        )}
        {vendor.hours && (
          <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 rounded-full px-2.5 py-1 border border-white/5">
            <Clock size={9} className="text-[#2CD6EB]" /> {vendor.hours}
          </span>
        )}
        {vendor.rating != null && (
          <span className="inline-flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-500/10 rounded-full px-2.5 py-1 border border-yellow-500/10">
            <Star size={9} className="fill-yellow-400" /> {Number(vendor.rating).toFixed(1)}
          </span>
        )}
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2 mt-auto">
        {/* Web order storefront link kept in codebase but bypassed temporarily */}
        {/* 
        <Link
          to={`/order/${vendor.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md shadow-[#FA6131]/15 hover:shadow-[#FA6131]/30 group/btn"
        >
          <ShoppingBag size={13} />
          Order Now
          <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
        */}
        
        {/* WhatsApp direct order channel */}
        <a
          href={vendor.whatsapp_number ? `https://wa.me/${vendor.whatsapp_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hello, I want to order from ${vendor.business_name} [ref:${vendor.slug}]`)}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md shadow-green-600/15 hover:shadow-green-600/30 group/btn"
        >
          <MessageCircle size={13} className="fill-white text-green-600" />
          Order on WhatsApp
          <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </a>

        <button
          onClick={() => onQRClick(vendor)}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-gray-500 hover:text-[#2CD6EB] transition-all"
          title="Get QR Card"
        >
          <QrCode size={16} />
        </button>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const VendorDirectory = () => {
  const [vendors, setVendors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [qrVendor, setQrVendor]       = useState(null);
  const searchTimer = useRef(null);

  // Debounce search input
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await publicService.getAllActiveVendors({ search: debouncedSearch || undefined });
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load vendors. Please try again shortly.'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative bg-[#0f1118] overflow-hidden">
        {/* Background gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FA6131]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#2CD6EB]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FA6131]/10 border border-[#FA6131]/20 rounded-full px-4 py-1.5 mb-6">
            <Utensils size={13} className="text-[#FA6131]" />
            <span className="text-xs font-bold text-[#FA6131] tracking-wider uppercase">Campus Food Discovery</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Discover Campus<br />
            <span className="bg-gradient-to-r from-[#FA6131] to-[#f09d50] bg-clip-text text-transparent">
              Vendors & Restaurants
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10">
            Browse active vendors, explore menus, and order directly — powered by Bukka AI.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              id="vendor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors by name or cuisine..."
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#FA6131]/50 focus:ring-2 focus:ring-[#FA6131]/20 transition-all shadow-xl"
            />
            {loading && (
              <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-gray-500" />
            )}
          </div>
        </div>
      </section>

      {/* ── Results ─────────────────────────────────── */}
      <section className="bg-[#0f1118] min-h-[50vh] pb-20">
        <div className="max-w-5xl mx-auto px-4">
          {/* Count bar */}
          {!loading && !error && vendors.length > 0 && (
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-sm text-gray-500">
                <span className="text-white font-bold">{vendors.length}</span>{' '}
                {vendors.length === 1 ? 'vendor' : 'vendors'} found
                {debouncedSearch && (
                  <> for "<span className="text-[#FA6131]">{debouncedSearch}</span>"</>
                )}
              </p>
            </div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <VendorSkeleton key={i} />)}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frown size={28} className="text-red-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Something went wrong</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{error}</p>
              <button
                onClick={fetchVendors}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && vendors.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-gray-600" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">No vendors found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {debouncedSearch
                  ? `No active vendors match "${debouncedSearch}". Try a different search.`
                  : 'No active vendors at the moment. Check back soon!'}
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-6 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Vendor Grid */}
          {!loading && !error && vendors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor.slug}
                  vendor={vendor}
                  onQRClick={(v) => setQrVendor({ slug: v.slug, name: v.business_name })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QR Card Modal */}
      {qrVendor && (
        <VendorQRCard
          slug={qrVendor.slug}
          vendorName={qrVendor.name}
          onClose={() => setQrVendor(null)}
        />
      )}
    </>
  );
};

export default VendorDirectory;
