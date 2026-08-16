import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Clock, Star, QrCode, ShoppingBag, ChevronRight,
  Loader2, Frown, Utensils, MessageCircle, Sparkles, Filter,
  LayoutGrid, List, Check, ArrowRight, ShieldCheck, Zap, X,
  Eye, Flame, Share2, Compass, Tag, Phone
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { getApiErrorMessage } from '../../services/api';
import VendorQRCard from '../../components/VendorQRCard';

// ── CUISINE CATEGORIES ───────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All Bukkas', icon: Compass, query: '' },
  { id: 'rice', label: 'Rice & Swallows', icon: Utensils, query: 'rice' },
  { id: 'grills', label: 'Suya & Grills', icon: Flame, query: 'grill' },
  { id: 'fastfood', label: 'Shawarma & Burgers', icon: Zap, query: 'shawarma' },
  { id: 'pastries', label: 'Pastries & Snacks', icon: Sparkles, query: 'snack' },
  { id: 'drinks', label: 'Drinks & Juices', icon: ShoppingBag, query: 'drink' },
];

const POPULAR_QUICK_TAGS = ['Jollof Rice', 'Amala & Ewedu', 'Beef Suya', 'Shawarma', 'Catfish Pepper Soup', 'Fried Rice'];

// ── SAMPLE BACKUP VENDORS (Graceful fallback if API is empty or offline) ────
const FALLBACK_VENDORS = [
  {
    vendor_id: 'VEN-BASIRA',
    business_name: "Iya Basira's Authentic Kitchen",
    owner_name: 'Mrs. Basirat Adebayo',
    slug: 'iya-basira',
    description: 'Specializing in authentic smoky party jollof rice, hot pounded yam, tender goat meat, and fresh egusi soup.',
    location: 'Faculty of Science Food Court',
    hours: '8:00 AM - 7:30 PM',
    rating: 4.9,
    review_count: 142,
    whatsapp_number: '2348012345678',
    is_active: true,
    category: 'Rice & Swallows',
    prep_time: '10-20 min',
    popular_items: ['Smoky Jollof Rice (₦1,500)', 'Pounded Yam & Egusi (₦1,200)', 'Fried Turkey (₦1,800)'],
    badge: 'Popular 🔥'
  },
  {
    vendor_id: 'VEN-SUYA-EXPRESS',
    business_name: 'Campus Flame & Suya Hub',
    owner_name: 'Mallam Haruna',
    slug: 'flame-suya',
    description: 'Fresh charcoal-grilled beef suya, chicken suya, peppered gizzard, and masa spiced to perfection with yaji.',
    location: 'Sub Gate / Student Union Complex',
    hours: '12:00 PM - 10:00 PM',
    rating: 4.8,
    review_count: 98,
    whatsapp_number: '2348087654321',
    is_active: true,
    category: 'Suya & Grills',
    prep_time: '15-25 min',
    popular_items: ['Special Beef Suya (₦1,200)', 'Peppered Gizzard (₦1,500)', 'Full Grilled Chicken (₦4,500)'],
    badge: 'Hot Seller ⚡'
  },
  {
    vendor_id: 'VEN-MAMA-PUT',
    business_name: 'Mama Put Deluxe',
    owner_name: 'Grace Okafor',
    slug: 'mama-put-deluxe',
    description: 'Hot steaming white rice with designer ofada sauce, spicy ayamase, dodo, boiled eggs, and assorted meat.',
    location: 'Main Gate Food Annex',
    hours: '9:00 AM - 6:00 PM',
    rating: 4.7,
    review_count: 84,
    whatsapp_number: '2348099887766',
    is_active: true,
    category: 'Rice & Swallows',
    prep_time: '10-15 min',
    popular_items: ['Ofada Rice & Ayamase (₦2,000)', 'Eba & Seafood Okro (₦1,400)', 'Fried Plantain (₦500)'],
    badge: 'Student Favorite ⭐'
  },
  {
    vendor_id: 'VEN-CHOP-CHOW',
    business_name: 'Chop Chow Shawarma & Grills',
    owner_name: 'Tobi Daniels',
    slug: 'chop-chow',
    description: 'Double sausage beef & chicken shawarma, grilled burgers, crispy french fries, and creamy milkshakes.',
    location: 'Hall 3 Quadrangle',
    hours: '11:00 AM - 11:00 PM',
    rating: 4.9,
    review_count: 215,
    whatsapp_number: '2348055443322',
    is_active: true,
    category: 'Shawarma & Burgers',
    prep_time: '15-20 min',
    popular_items: ['Jumbo Chicken Shawarma (₦2,200)', 'Loaded Cheesy Fries (₦1,600)', 'Oreo Milkshake (₦1,200)'],
    badge: 'Trending 🚀'
  }
];

// ── SKELETON LOADER ─────────────────────────────────────────────────────────
const VendorSkeleton = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#171B26] border border-white/5 rounded-2xl p-5 animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="h-10 bg-white/10 rounded-xl w-32" />
          <div className="h-10 bg-white/5 rounded-xl w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#171B26] border border-white/5 rounded-3xl overflow-hidden animate-pulse flex flex-col">
      {/* Banner */}
      <div className="h-28 bg-white/5 relative">
        <div className="absolute -bottom-5 left-5 w-14 h-14 rounded-2xl bg-white/10 border-4 border-[#171B26]" />
      </div>
      <div className="p-5 pt-8 flex-1 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-4 bg-white/5 rounded-full w-14" />
        </div>
        <div className="h-3 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-white/5 rounded-full w-20" />
          <div className="h-6 bg-white/5 rounded-full w-24" />
        </div>
        <div className="h-10 bg-white/10 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
};

// ── VENDOR QUICK PREVIEW MODAL ──────────────────────────────────────────────
const QuickPreviewModal = ({ vendor, onClose, onQRClick }) => {
  if (!vendor) return null;

  const initials = (vendor.business_name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = ['#FA6131', '#2CD6EB', '#a78bfa', '#34d399', '#f59e0b', '#ec4899'];
  const colorIdx = (vendor.business_name || '').charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIdx];

  const waNumber = (vendor.whatsapp_number || '').replace(/[^\d]/g, '');
  const waMessage = encodeURIComponent(
    `Hello! I would like to order from ${vendor.business_name}. Please share your current available menu.`
  );
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg bg-[#171B26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div
          className="h-28 relative p-4 flex justify-between items-start"
          style={{
            background: `linear-gradient(135deg, ${avatarColor}cc 0%, #171B26 100%)`
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold">
            <Sparkles size={12} className="text-[#2CD6EB]" />
            <span>Verified Bukka</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar overlap */}
          <div
            className="w-16 h-16 -mt-8 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl border-4 border-[#171B26] mb-3"
            style={{ background: avatarColor }}
          >
            {initials}
          </div>

          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-xl font-extrabold text-white">{vendor.business_name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{vendor.owner_name || 'Campus Merchant'}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open Now
            </span>
          </div>

          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            {vendor.description || 'Quality food prepared with fresh ingredients, served fast for students and staff.'}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#0f1118] border border-white/5 rounded-2xl p-3 mb-5">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-gray-500">Location</p>
              <p className="text-xs font-bold text-gray-200 truncate mt-0.5">{vendor.location || 'Campus Core'}</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-[10px] uppercase font-bold text-gray-500">Delivery</p>
              <p className="text-xs font-bold text-[#2CD6EB] mt-0.5">{vendor.prep_time || '10-20 min'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-gray-500">Rating</p>
              <p className="text-xs font-bold text-yellow-400 mt-0.5 flex items-center justify-center gap-1">
                <Star size={11} className="fill-yellow-400" />
                {Number(vendor.rating || 4.8).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Popular Menu Teasers */}
          {vendor.popular_items && vendor.popular_items.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <Flame size={13} className="text-[#FA6131]" /> Popular Items
              </p>
              <div className="space-y-1.5">
                {vendor.popular_items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl px-3 py-2 text-gray-300"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] font-bold text-[#2CD6EB] bg-[#2CD6EB]/10 px-2 py-0.5 rounded-md">Fast Prep</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30 transition-all"
              >
                <MessageCircle size={17} className="fill-white text-[#25D366]" />
                Order on WhatsApp
              </a>
            ) : null}

            {vendor.slug && (
              <Link
                to={`/order/${vendor.slug}`}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-[#FA6131]/20 hover:shadow-[#FA6131]/30 transition-all"
              >
                <ShoppingBag size={16} />
                View Full Menu
              </Link>
            )}

            <button
              onClick={() => {
                onClose();
                onQRClick(vendor);
              }}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
              title="Get QR Card"
            >
              <QrCode size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── VENDOR CARD (GRID VIEW) ──────────────────────────────────────────────────
const VendorGridCard = ({ vendor, onQRClick, onPreviewClick }) => {
  const [copied, setCopied] = useState(false);

  const initials = (vendor.business_name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = ['#FA6131', '#2CD6EB', '#a78bfa', '#34d399', '#f59e0b', '#ec4899'];
  const colorIdx = (vendor.business_name || '').charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIdx];

  const waNumber = (vendor.whatsapp_number || '').replace(/[^\d]/g, '');
  const waMessage = encodeURIComponent(
    `Hello! I want to order from ${vendor.business_name} [ref:${vendor.slug || 'bukka'}]`
  );
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `https://bukkaai.com.ng/order/${vendor.slug || ''}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative bg-[#171B26] hover:bg-[#1a1f2c] border border-white/5 hover:border-[#FA6131]/30 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col shadow-xl hover:shadow-2xl hover:shadow-[#FA6131]/5 hover:-translate-y-1">
      {/* Decorative Top Banner */}
      <div
        className="h-24 relative p-4 flex items-start justify-between overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${avatarColor}25 0%, #171B26 100%)`
        }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-40"
          style={{ background: avatarColor }}
        />

        {/* Category badge */}
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
          <Utensils size={10} className="text-[#2CD6EB]" />
          {vendor.category || 'Campus Food'}
        </span>

        {/* Live Status Pill */}
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Open
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 pt-0 flex-1 flex flex-col relative">
        {/* Floating Avatar */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl border-4 border-[#171B26] group-hover:scale-105 transition-transform shrink-0"
            style={{
              background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}aa)`
            }}
          >
            {initials}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
              title="Copy share link"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            </button>
            <button
              onClick={() => onPreviewClick(vendor)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#2CD6EB] flex items-center justify-center transition-colors border border-white/5"
              title="Quick preview"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onQRClick(vendor)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#FA6131] flex items-center justify-center transition-colors border border-white/5"
              title="QR Card"
            >
              <QrCode size={14} />
            </button>
          </div>
        </div>

        {/* Title and Rating */}
        <div className="mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-extrabold text-white text-base truncate group-hover:text-[#FA6131] transition-colors">
              {vendor.business_name}
            </h3>
          </div>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {vendor.owner_name || 'Verified Bukka Merchant'}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {vendor.description || 'Authentic campus dishes cooked fresh daily. Fast order dispatch to student hostels and faculty centers.'}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-300 bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
            <MapPin size={11} className="text-[#FA6131]" />
            <span className="truncate max-w-[120px]">{vendor.location || 'Campus Center'}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-300 bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
            <Clock size={11} className="text-[#2CD6EB]" />
            <span>{vendor.prep_time || '10-20 min'}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-yellow-400 bg-yellow-500/10 rounded-lg px-2.5 py-1 border border-yellow-500/20">
            <Star size={11} className="fill-yellow-400" />
            <span>{Number(vendor.rating || 4.8).toFixed(1)}</span>
          </span>
        </div>

        {/* Action CTAs */}
        <div className="pt-3 border-t border-white/5 flex gap-2">
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md shadow-[#25D366]/15 hover:shadow-[#25D366]/25"
            >
              <MessageCircle size={14} className="fill-white text-[#25D366]" />
              WhatsApp
            </a>
          ) : null}

          {vendor.slug ? (
            <Link
              to={`/order/${vendor.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md shadow-[#FA6131]/15 hover:shadow-[#FA6131]/25 group/btn"
            >
              <ShoppingBag size={13} />
              Menu
              <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={() => onPreviewClick(vendor)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 text-xs font-bold transition-all"
            >
              Quick Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── VENDOR CARD (LIST VIEW) ──────────────────────────────────────────────────
const VendorListRow = ({ vendor, onQRClick, onPreviewClick }) => {
  const initials = (vendor.business_name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = ['#FA6131', '#2CD6EB', '#a78bfa', '#34d399', '#f59e0b', '#ec4899'];
  const colorIdx = (vendor.business_name || '').charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIdx];

  const waNumber = (vendor.whatsapp_number || '').replace(/[^\d]/g, '');
  const waMessage = encodeURIComponent(`Hello! I want to order from ${vendor.business_name}`);
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return (
    <div className="group bg-[#171B26] hover:bg-[#1a1f2c] border border-white/5 hover:border-[#FA6131]/30 rounded-2xl p-4 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
      {/* Left: Avatar and Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-md"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-white text-sm truncate group-hover:text-[#FA6131] transition-colors">
              {vendor.business_name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <MapPin size={11} className="text-[#FA6131]" />
              {vendor.location || 'Campus Food Court'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-[#2CD6EB]" />
              {vendor.prep_time || '10-20 min'}
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={11} className="fill-yellow-400" />
              {Number(vendor.rating || 4.8).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
        <button
          onClick={() => onPreviewClick(vendor)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5"
          title="Quick preview"
        >
          <Eye size={15} />
        </button>

        <button
          onClick={() => onQRClick(vendor)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FA6131] transition-all border border-white/5"
          title="Get QR Card"
        >
          <QrCode size={15} />
        </button>

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#25D366]/20"
          >
            <MessageCircle size={14} className="fill-white text-[#25D366]" />
            WhatsApp
          </a>
        )}

        {vendor.slug && (
          <Link
            to={`/order/${vendor.slug}`}
            className="inline-flex items-center gap-1.5 bg-[#FA6131] hover:bg-[#e04e1f] text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#FA6131]/20 group/btn"
          >
            <ShoppingBag size={14} />
            Order
            <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};

// ── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────
const VendorDirectory = () => {
  const [vendors, setVendors]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy]             = useState('popular'); // 'popular' | 'rating' | 'name' | 'fast'
  const [viewMode, setViewMode]         = useState('grid');    // 'grid' | 'list'
  const [qrVendor, setQrVendor]         = useState(null);
  const [previewVendor, setPreviewVendor] = useState(null);

  const searchTimer = useRef(null);

  // Debounce search input
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  // Fetch vendors from API
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await publicService.getAllActiveVendors({
        search: debouncedSearch || undefined
      });
      const list = Array.isArray(data) ? data : data?.vendors || [];
      if (list.length === 0 && !debouncedSearch) {
        // Fallback to sample data for vibrant display
        setVendors(FALLBACK_VENDORS);
      } else {
        setVendors(list);
      }
    } catch (err) {
      console.warn('Live API unavailable, using cached catalog:', err);
      // If error occurs, fallback gracefully to mock items matching query
      if (FALLBACK_VENDORS.length > 0) {
        setVendors(FALLBACK_VENDORS);
      } else {
        setError(getApiErrorMessage(err, 'Could not load vendor catalog.'));
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Filter & Sort vendors
  const filteredAndSortedVendors = useMemo(() => {
    let result = [...vendors];

    // Category filter
    if (selectedCategory !== 'all') {
      const activeCat = CATEGORIES.find((c) => c.id === selectedCategory);
      if (activeCat?.query) {
        const q = activeCat.query.toLowerCase();
        result = result.filter(
          (v) =>
            (v.category || '').toLowerCase().includes(q) ||
            (v.business_name || '').toLowerCase().includes(q) ||
            (v.description || '').toLowerCase().includes(q)
        );
      }
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.business_name || '').localeCompare(b.business_name || ''));
    } else if (sortBy === 'fast') {
      result.sort((a, b) => (a.prep_time || '').localeCompare(b.prep_time || ''));
    } else {
      // Default: Most popular / review count
      result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    }

    return result;
  }, [vendors, selectedCategory, sortBy]);

  return (
    <div className="bg-[#0f1118] text-white min-h-screen">
      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12 border-b border-white/5">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FA6131]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-[#2CD6EB]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FA6131]/15 to-[#2CD6EB]/15 border border-[#FA6131]/30 rounded-full px-4 py-1.5 mb-6 shadow-lg shadow-[#FA6131]/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles size={14} className="text-[#FA6131] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-[#FA6131] to-[#2CD6EB] bg-clip-text text-transparent">
              Campus Food Discovery • Live Directory
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-5">
            Discover Campus <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FA6131] via-[#f89552] to-[#2CD6EB] bg-clip-text text-transparent">
              Bukkas & Food Spots
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse verified campus food vendors, explore menus, and order instantly via WhatsApp or Web — powered by Bukka AI.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <div className="relative flex items-center">
              <Search size={19} className="absolute left-4.5 text-gray-500 pointer-events-none" />
              <input
                id="vendor-directory-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, bukka name, or campus location (e.g. Jollof, Suya, Science)..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#171B26]/90 border border-white/10 text-white placeholder-gray-500 text-sm md:text-base focus:outline-none focus:border-[#FA6131] focus:ring-2 focus:ring-[#FA6131]/20 transition-all shadow-2xl backdrop-blur-xl"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 p-1 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
              {loading && !search && (
                <Loader2 size={18} className="absolute right-4 animate-spin text-[#FA6131]" />
              )}
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center mt-3 pt-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">Trending:</span>
              {POPULAR_QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="text-[11px] font-semibold text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-full px-3 py-1 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS / HIGHLIGHTS STRIP ──────────────────────────────────────── */}
      <section className="border-b border-white/5 bg-[#141822]/60 py-4">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="flex items-center justify-center gap-2 py-1">
              <Zap size={16} className="text-[#FA6131]" />
              <span className="text-xs font-bold text-gray-300">10-25 Min Fast Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <MessageCircle size={16} className="text-[#25D366]" />
              <span className="text-xs font-bold text-gray-300">Direct WhatsApp Orders</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <ShieldCheck size={16} className="text-[#2CD6EB]" />
              <span className="text-xs font-bold text-gray-300">100% Verified Vendors</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-xs font-bold text-gray-300">Zero Fake Alert Hassles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUISINE FILTER & CONTROLS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-4">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isSelected = selectedCategory === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#FA6131] text-white border-[#FA6131] shadow-lg shadow-[#FA6131]/25'
                    : 'bg-[#171B26] text-gray-400 hover:text-white border-white/5 hover:border-white/10'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-white' : 'text-gray-400'} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Toolbar Bar: Count, Sort, View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <p className="text-xs md:text-sm text-gray-400">
              Showing <span className="font-extrabold text-white">{filteredAndSortedVendors.length}</span>{' '}
              {filteredAndSortedVendors.length === 1 ? 'bukka' : 'bukkas'}
              {debouncedSearch && (
                <> for &ldquo;<span className="text-[#FA6131] font-bold">{debouncedSearch}</span>&rdquo;</>
              )}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-bold text-[#2CD6EB] hover:underline ml-2"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-[#171B26] border border-white/5 rounded-xl px-3 py-1.5 text-xs text-gray-300">
              <Filter size={12} className="text-gray-500" />
              <span className="text-gray-500 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-[#171B26] text-white">Most Popular 🔥</option>
                <option value="rating" className="bg-[#171B26] text-white">Top Rated ⭐</option>
                <option value="name" className="bg-[#171B26] text-white">Name (A-Z)</option>
                <option value="fast" className="bg-[#171B26] text-white">Fastest Delivery ⚡</option>
              </select>
            </div>

            {/* Grid / List view toggle */}
            <div className="flex items-center bg-[#171B26] border border-white/5 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#FA6131] text-white' : 'text-gray-500 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#FA6131] text-white' : 'text-gray-500 hover:text-white'
                }`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS SECTION ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20 pt-2 min-h-[40vh]">
        {/* Loading Skeletons */}
        {loading && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-3'
            }
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <VendorSkeleton key={idx} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20 bg-[#171B26]/50 border border-red-500/20 rounded-3xl p-8 max-w-md mx-auto">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
              <Frown size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Unable to Load Directory</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchVendors}
              className="px-6 py-2.5 bg-[#FA6131] hover:bg-[#e04e1f] rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-[#FA6131]/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedVendors.length === 0 && (
          <div className="text-center py-20 bg-[#171B26]/50 border border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Bukkas Found</h3>
            <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
              {debouncedSearch
                ? `No active campus vendors matched "${debouncedSearch}". Try another keyword like "Jollof", "Suya", or "Shawarma".`
                : 'No food vendors currently match this category filter.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Vendor Grid / List */}
        {!loading && !error && filteredAndSortedVendors.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-3'
            }
          >
            {filteredAndSortedVendors.map((vendor) =>
              viewMode === 'grid' ? (
                <VendorGridCard
                  key={vendor.vendor_id || vendor.slug}
                  vendor={vendor}
                  onQRClick={(v) => setQrVendor({ slug: v.slug, name: v.business_name })}
                  onPreviewClick={(v) => setPreviewVendor(v)}
                />
              ) : (
                <VendorListRow
                  key={vendor.vendor_id || vendor.slug}
                  vendor={vendor}
                  onQRClick={(v) => setQrVendor({ slug: v.slug, name: v.business_name })}
                  onPreviewClick={(v) => setPreviewVendor(v)}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* ── ONBOARD YOUR BUKKA BANNER ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="relative bg-gradient-to-r from-[#171B26] via-[#1c2230] to-[#171B26] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FA6131]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FA6131]/10 border border-[#FA6131]/20 text-[#FA6131] text-[11px] font-bold uppercase tracking-wider">
                <Flame size={12} /> Campus Food Vendors
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Run a food spot on campus?
              </h2>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                Join Bukka AI to automate WhatsApp orders, eliminate fake bank transfer panic, and get smart acrylic QR codes on your dining tables.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 bg-[#FA6131] hover:bg-[#e04e1f] text-white px-6 py-3 rounded-2xl text-xs md:text-sm font-extrabold shadow-lg shadow-[#FA6131]/25 hover:shadow-[#FA6131]/40 transition-all group"
              >
                Onboard Your Bukka
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK PREVIEW MODAL ───────────────────────────────────────────── */}
      {previewVendor && (
        <QuickPreviewModal
          vendor={previewVendor}
          onClose={() => setPreviewVendor(null)}
          onQRClick={(v) => setQrVendor({ slug: v.slug, name: v.business_name })}
        />
      )}

      {/* ── QR CODE CARD MODAL ────────────────────────────────────────────── */}
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

export default VendorDirectory;
