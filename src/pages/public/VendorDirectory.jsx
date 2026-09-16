import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Clock, Star, QrCode, ShoppingBag, ChevronRight,
  Loader2, Frown, Utensils, MessageCircle, Sparkles, Filter,
  LayoutGrid, List, Check, ArrowRight, ShieldCheck, Zap, X,
  Eye, Flame, Share2, Compass
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
      <div className="bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 rounded-xl bg-gray-300 dark:bg-gray-700 border-2 border-black dark:border-white shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-32 border-2 border-black dark:border-white" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-24 border-2 border-black dark:border-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#2CD6EB] animate-pulse flex flex-col">
      <div className="h-20 bg-gray-200 dark:bg-gray-800 border-b-3 border-black dark:border-white" />
      <div className="p-5 pt-0 relative flex-1 space-y-3">
        <div className="w-14 h-14 rounded-xl bg-gray-300 dark:bg-gray-700 border-3 border-black -mt-7 mb-3" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-20 border-2 border-black" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-24 border-2 border-black" />
        </div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mt-4 border-2 border-black" />
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

  const bannerColors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#FED7AA', '#DDD6FE', '#FBCFE8'];
  const colorIdx = (vendor.business_name || '').charCodeAt(0) % bannerColors.length;
  const bannerBg = bannerColors[colorIdx];

  const waNumber = (vendor.whatsapp_number || '').replace(/[^\d]/g, '');
  const waMessage = encodeURIComponent(
    `Hello! I would like to order from ${vendor.business_name}. Please share your current available menu.`
  );
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg bg-[#FAF7EE] dark:bg-[#171B26] border-4 border-black dark:border-white rounded-3xl overflow-hidden shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#2CD6EB] z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div
          className="h-24 relative p-4 flex justify-between items-start border-b-3 border-black dark:border-white"
          style={{ backgroundColor: bannerBg }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-black uppercase tracking-wider">
            <Sparkles size={13} className="text-[#FA6131]" />
            <span>Verified Bukka</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#111] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} className="stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar overlap */}
          <div
            className="w-16 h-16 -mt-8 rounded-2xl flex items-center justify-center text-black font-display font-black text-xl shadow-[3px_3px_0px_0px_#000] border-3 border-black mb-3 bg-[#FFE600]"
          >
            {initials}
          </div>

          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display font-black text-2xl text-gray-950 dark:text-white">{vendor.business_name}</h3>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-0.5">{vendor.owner_name || 'Campus Merchant'}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-display font-black uppercase tracking-wider bg-[#25D366] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Open Now
            </span>
          </div>

          <p className="font-medium text-sm text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">
            {vendor.description || 'Quality food prepared with fresh ingredients, served fast for students and staff.'}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-2.5 bg-white dark:bg-[#121620] border-2 border-black dark:border-white rounded-xl p-3 mb-5 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
            <div className="text-center">
              <p className="text-[10px] uppercase font-display font-black text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-xs font-display font-extrabold text-black dark:text-white truncate mt-0.5">{vendor.location || 'Campus Core'}</p>
            </div>
            <div className="text-center border-x-2 border-black/20 dark:border-white/20 px-1">
              <p className="text-[10px] uppercase font-display font-black text-gray-500 dark:text-gray-400">Delivery</p>
              <p className="text-xs font-display font-extrabold text-[#FA6131] mt-0.5">{vendor.prep_time || '10-20 min'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-display font-black text-gray-500 dark:text-gray-400">Rating</p>
              <p className="text-xs font-display font-black text-black dark:text-white mt-0.5 flex items-center justify-center gap-1">
                <Star size={13} className="fill-[#FFE600] text-black stroke-[2]" />
                {Number(vendor.rating || 4.8).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Popular Menu Teasers */}
          {vendor.popular_items && vendor.popular_items.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-display font-black uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                <Flame size={14} className="text-[#FA6131]" /> Popular Dishes
              </p>
              <div className="space-y-2">
                {vendor.popular_items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-white dark:bg-[#121620] border-2 border-black dark:border-white rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                  >
                    <span className="font-semibold">{item}</span>
                    <span className="text-[10px] font-display font-black uppercase text-black bg-[#2CD6EB] border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]">Fast Prep</span>
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
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black text-sm uppercase tracking-wide rounded-xl py-3 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <MessageCircle size={18} className="fill-black text-[#25D366]" />
                <span>Order on WhatsApp</span>
              </a>
            ) : null}

            {vendor.slug && (
              <Link
                to={`/order/${vendor.slug}`}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FA6131] hover:bg-[#ff7244] text-white font-display font-black text-sm uppercase tracking-wide rounded-xl py-3 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <ShoppingBag size={17} />
                <span>View Full Menu</span>
              </Link>
            )}

            <button
              onClick={() => {
                onClose();
                onQRClick(vendor);
              }}
              className="px-4 py-3 rounded-xl bg-white dark:bg-[#121620] text-black dark:text-white border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
              title="Get QR Card"
            >
              <QrCode size={18} />
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

  const bannerColors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#FED7AA', '#DDD6FE', '#FBCFE8'];
  const colorIdx = (vendor.business_name || '').charCodeAt(0) % bannerColors.length;
  const bannerBg = bannerColors[colorIdx];

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
    <div className="group relative bg-white dark:bg-[#1C2230] border-2 sm:border-3 border-black dark:border-white rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#2CD6EB] sm:dark:shadow-[5px_5px_0px_0px_#2CD6EB] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[3px_3px_0px_0px_#000] transition-all flex flex-col justify-between">
      <div>
        {/* Decorative Top Banner */}
        <div
          className="h-20 relative p-3.5 flex items-start justify-between border-b-2 sm:border-b-3 border-black dark:border-white"
          style={{ backgroundColor: bannerBg }}
        >
          {/* Category badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-display font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <Utensils size={11} className="text-[#FA6131]" />
            {vendor.category || 'Campus Food'}
          </span>

          {/* Live Status Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[10px] font-display font-black uppercase tracking-wider bg-[#25D366] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            Open
          </span>
        </div>

        {/* Card Content */}
        <div className="p-5 pt-0 relative">
          {/* Floating Avatar & Action Row */}
          <div className="flex items-end justify-between -mt-7 mb-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-black font-display font-black text-lg shadow-[3px_3px_0px_0px_#000] border-3 border-black bg-[#FFE600] shrink-0"
            >
              {initials}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#121620] hover:bg-[#FFE600] dark:hover:bg-[#FFE600] text-black dark:text-white hover:text-black flex items-center justify-center transition-all border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                title="Copy share link"
              >
                {copied ? <Check size={14} className="text-emerald-600 stroke-[3]" /> : <Share2 size={14} />}
              </button>
              <button
                onClick={() => onPreviewClick(vendor)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#121620] hover:bg-[#2CD6EB] text-black dark:text-white hover:text-black flex items-center justify-center transition-all border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                title="Quick preview"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => onQRClick(vendor)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#121620] hover:bg-[#FA6131] text-black dark:text-white hover:text-white flex items-center justify-center transition-all border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                title="QR Card"
              >
                <QrCode size={14} />
              </button>
            </div>
          </div>

          {/* Title and Owner */}
          <div className="mb-2">
            <h3 className="font-display font-black text-gray-950 dark:text-white text-base truncate group-hover:text-[#FA6131] transition-colors">
              {vendor.business_name}
            </h3>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate mt-0.5">
              {vendor.owner_name || 'Verified Bukka Merchant'}
            </p>
          </div>

          {/* Description */}
          <p className="font-medium text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed mb-4">
            {vendor.description || 'Authentic campus dishes cooked fresh daily. Fast order dispatch to student hostels and faculty centers.'}
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-black bg-[#FEF08A] rounded-md px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <MapPin size={11} className="stroke-[2.5]" />
              <span className="truncate max-w-[110px]">{vendor.location || 'Campus Center'}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-black bg-[#BAE6FD] rounded-md px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <Clock size={11} className="stroke-[2.5]" />
              <span>{vendor.prep_time || '10-20 min'}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-display font-black text-black bg-[#FFE600] rounded-md px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <Star size={11} className="fill-black stroke-[2]" />
              <span>{Number(vendor.rating || 4.8).toFixed(1)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="px-5 pb-5 pt-0 flex gap-2">
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black text-xs uppercase tracking-wider rounded-xl py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <MessageCircle size={14} className="fill-black text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        ) : null}

        {vendor.slug ? (
          <Link
            to={`/order/${vendor.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#FA6131] hover:bg-[#ff7244] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group/btn cursor-pointer"
          >
            <ShoppingBag size={13} />
            <span>Menu</span>
            <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform stroke-[3]" />
          </Link>
        ) : (
          <button
            onClick={() => onPreviewClick(vendor)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-[#121620] text-black dark:text-white font-display font-black text-xs uppercase tracking-wider rounded-xl py-2.5 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] transition-all cursor-pointer"
          >
            Quick Info
          </button>
        )}
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

  const waNumber = (vendor.whatsapp_number || '').replace(/[^\d]/g, '');
  const waMessage = encodeURIComponent(`Hello! I want to order from ${vendor.business_name}`);
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return (
    <div className="group bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-2xl p-4 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5">
      {/* Left: Avatar and Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className="w-13 h-13 rounded-xl flex items-center justify-center text-black font-display font-black text-base shrink-0 shadow-[2px_2px_0px_0px_#000] border-2 border-black bg-[#FFE600]"
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-black text-gray-950 dark:text-white text-base truncate group-hover:text-[#FA6131] transition-colors">
              {vendor.business_name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-display font-black uppercase tracking-wider bg-[#25D366] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              Open
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-[#FEF08A] text-black px-2 py-0.5 rounded border border-black font-display font-bold text-[11px]">
              <MapPin size={11} className="stroke-[2.5]" />
              <span className="truncate max-w-[140px]">{vendor.location || 'Campus Food Court'}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-[#BAE6FD] text-black px-2 py-0.5 rounded border border-black font-display font-bold text-[11px]">
              <Clock size={11} className="stroke-[2.5]" />
              {vendor.prep_time || '10-20 min'}
            </span>
            <span className="inline-flex items-center gap-1 bg-[#FFE600] text-black px-2 py-0.5 rounded border border-black font-display font-black text-[11px]">
              <Star size={11} className="fill-black stroke-[2]" />
              {Number(vendor.rating || 4.8).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-black/10 dark:border-white/10">
        <button
          onClick={() => onPreviewClick(vendor)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#121620] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          title="Quick preview"
        >
          <Eye size={15} />
        </button>

        <button
          onClick={() => onQRClick(vendor)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#121620] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          title="Get QR Card"
        >
          <QrCode size={15} />
        </button>

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black rounded-xl px-4 py-2.5 text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <MessageCircle size={14} className="fill-black text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        )}

        {vendor.slug && (
          <Link
            to={`/order/${vendor.slug}`}
            className="inline-flex items-center gap-1.5 bg-[#FA6131] hover:bg-[#ff7244] text-white font-display font-black rounded-xl px-4 py-2.5 text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group/btn cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Order</span>
            <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform stroke-[3]" />
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
    <div className="bg-[#FAF7EE] dark:bg-[#11141D] text-gray-950 dark:text-gray-100 min-h-screen selection:bg-[#FFE600] selection:text-black">
      
      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative pt-12 md:pt-20 pb-12 border-b-3 border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          
          {/* Top Sticker Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border-2 border-black dark:border-white bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] mb-6">
            <Sparkles size={14} className="fill-black" />
            <span>Campus Food Discovery • Live Directory</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-gray-950 dark:text-white leading-[1.15] mb-5">
            Discover Campus <br className="hidden sm:inline" />
            <span className="relative inline-block px-3 py-0.5 mx-1 bg-[#2CD6EB] text-black border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] -rotate-1">
              Bukkas & Food Spots
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-800 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Browse verified campus food vendors, explore menus, and order instantly via WhatsApp or Web — powered by Bukka AI.
          </p>

          {/* Neo-Brutalist Search Box */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <div className="relative flex items-center bg-white dark:bg-[#1C2230] border-2 sm:border-3 border-black dark:border-white rounded-2xl shadow-[3px_3px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#2CD6EB] sm:dark:shadow-[5px_5px_0px_0px_#2CD6EB] focus-within:translate-x-0.5 focus-within:translate-y-0.5 transition-all overflow-hidden">
              <Search size={20} className="absolute left-4.5 text-black dark:text-white pointer-events-none stroke-[2.5]" />
              <input
                id="vendor-directory-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, bukka name, or location (e.g. Jollof, Suya, Science)..."
                className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-950 dark:text-white placeholder-gray-500 text-sm md:text-base font-medium focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 w-8 h-8 rounded-lg bg-[#FAF7EE] dark:bg-[#111] text-black dark:text-white border-2 border-black dark:border-white shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={15} className="stroke-[3]" />
                </button>
              )}
              {loading && !search && (
                <Loader2 size={20} className="absolute right-4 animate-spin text-[#FA6131] stroke-[2.5]" />
              )}
            </div>

            {/* Quick Trending Keyword Pills */}
            <div className="flex items-center gap-2 flex-wrap justify-center mt-4">
              <span className="text-xs font-display font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Trending:
              </span>
              {POPULAR_QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="text-xs font-display font-bold text-gray-950 dark:text-white bg-white dark:bg-[#1C2230] hover:bg-[#FFE600] dark:hover:bg-[#FFE600] hover:text-black border-2 border-black dark:border-white rounded-lg px-3 py-1 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS / GUARANTEE STRIP ───────────────────────────────────────── */}
      <section className="border-b-3 border-black dark:border-white bg-[#FFE600] text-black py-3.5 select-none">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="flex items-center justify-center gap-2 py-1">
              <Zap size={18} className="stroke-[2.5]" />
              <span className="font-display font-black text-xs md:text-sm uppercase tracking-wide">10-25 Min Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <MessageCircle size={18} className="stroke-[2.5]" />
              <span className="font-display font-black text-xs md:text-sm uppercase tracking-wide">Direct WhatsApp Orders</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <ShieldCheck size={18} className="stroke-[2.5]" />
              <span className="font-display font-black text-xs md:text-sm uppercase tracking-wide">100% Verified Bukkas</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <Sparkles size={18} className="stroke-[2.5]" />
              <span className="font-display font-black text-xs md:text-sm uppercase tracking-wide">Zero Fake Alert Hassles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUISINE FILTER & CONTROLS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-4">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isSelected = selectedCategory === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-black text-xs md:text-sm uppercase tracking-wide whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FA6131] text-white border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] -translate-x-0.5 -translate-y-0.5'
                    : 'bg-white dark:bg-[#1C2230] text-black dark:text-white border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:bg-[#2CD6EB] hover:text-black dark:hover:bg-[#2CD6EB] dark:hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none'
                }`}
              >
                <Icon size={16} className={`stroke-[2.5] ${isSelected ? 'text-white' : 'text-black dark:text-white'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Count, Sort, View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t-2 border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#1C2230] border-2 border-black dark:border-white rounded-lg shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] text-xs font-display font-black text-gray-900 dark:text-gray-100">
              Showing <span className="text-[#FA6131]">{filteredAndSortedVendors.length}</span>{' '}
              {filteredAndSortedVendors.length === 1 ? 'bukka' : 'bukkas'}
              {debouncedSearch && (
                <> for &ldquo;<span>{debouncedSearch}</span>&rdquo;</>
              )}
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-display font-extrabold text-[#FA6131] hover:underline ml-2 uppercase tracking-wide cursor-pointer"
              >
                ✕ Clear filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#1C2230] border-2 border-black dark:border-white rounded-xl px-3 py-1.5 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
              <Filter size={13} className="text-black dark:text-white stroke-[2.5]" />
              <span className="text-[11px] font-display font-black uppercase text-gray-600 dark:text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-black dark:text-white font-display font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-white dark:bg-[#1C2230] text-black dark:text-white">Most Popular 🔥</option>
                <option value="rating" className="bg-white dark:bg-[#1C2230] text-black dark:text-white">Top Rated ⭐</option>
                <option value="name" className="bg-white dark:bg-[#1C2230] text-black dark:text-white">Name (A-Z)</option>
                <option value="fast" className="bg-white dark:bg-[#1C2230] text-black dark:text-white">Fastest Delivery ⚡</option>
              </select>
            </div>

            {/* Grid / List view toggle */}
            <div className="flex items-center bg-white dark:bg-[#1C2230] border-2 border-black dark:border-white rounded-xl p-1 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-[#FA6131] text-white border-2 border-black shadow-[1px_1px_0px_0px_#000]' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-[#FA6131] text-white border-2 border-black shadow-[1px_1px_0px_0px_#000]' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
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
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <VendorSkeleton key={idx} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16 bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-3xl p-8 max-w-md mx-auto shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400 shadow-[2px_2px_0px_0px_#000]">
              <Frown size={28} />
            </div>
            <h3 className="font-display font-black text-xl text-black dark:text-white mb-2">Unable to Load Directory</h3>
            <p className="font-medium text-gray-700 dark:text-gray-300 text-xs mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchVendors}
              className="px-6 py-2.5 bg-[#FA6131] hover:bg-[#ff7244] text-white rounded-xl font-display font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedVendors.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-3xl p-8 max-w-lg mx-auto shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <div className="w-16 h-16 bg-[#FFE600] border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 text-black shadow-[2px_2px_0px_0px_#000]">
              <Search size={28} className="stroke-[2.5]" />
            </div>
            <h3 className="font-display font-black text-xl text-black dark:text-white mb-2">No Bukkas Found</h3>
            <p className="font-medium text-gray-700 dark:text-gray-300 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
              {debouncedSearch
                ? `No active campus vendors matched "${debouncedSearch}". Try another keyword like "Jollof", "Suya", or "Shawarma".`
                : 'No food vendors currently match this category filter.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 bg-[#2CD6EB] text-black font-display font-black text-xs uppercase tracking-wide border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
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
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
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

      {/* ── ONBOARD YOUR BUKKA BILLBOARD ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="relative rounded-3xl border-3 sm:border-4 border-black dark:border-white bg-[#FA6131] text-white p-6 sm:p-10 md:p-12 shadow-[4px_4px_0px_0px_#000] sm:shadow-[7px_7px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#2CD6EB] sm:dark:shadow-[7px_7px_0px_0px_#2CD6EB] overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <Flame size={14} className="stroke-[2.5]" /> Campus Food Merchants
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white leading-tight">
                Run a food spot on campus?
              </h2>
              <p className="text-orange-100 text-sm md:text-base leading-relaxed font-medium">
                Join Bukka AI to automate WhatsApp orders, eliminate fake bank transfer panic, and get smart acrylic QR codes on your dining tables.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FFE600] text-black px-7 py-3.5 rounded-xl font-display font-black text-sm uppercase tracking-wide border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group"
              >
                <span>Onboard Your Bukka</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform stroke-[3]" />
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
