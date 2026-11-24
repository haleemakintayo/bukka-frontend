import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartSummaryBar from '../../components/CartSummaryBar';
import { publicService } from '../../services/publicService';
import {
  Plus, Minus, Star, MapPin, Clock, ArrowLeft, ShoppingBag,
  MessageCircle, Share2, Check, Search, X, Sparkles, Flame,
  Sun, Moon, Zap, ShieldCheck
} from 'lucide-react';
import { GENERAL_WHATSAPP_NUMBER } from './VendorDirectory';

const MOCK_VENDOR = {
  id: "VEN-4092",
  name: "Iya Basira's Kitchen",
  isOpen: true,
  rating: 4.8,
  reviewCount: 234,
  location: 'Faculty of Science Food Court',
  deliveryTime: '10-15 mins',
  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  tags: ["🔥 Hot Today", "⭐ Verified Bukka"],
  categories: [
    {
      name: "Swallows & Rice",
      emoji: "🍚",
      items: [
        { id: "i4", name: "Pounded Yam (Wrap)", description: "Soft, hot, and freshly pounded yam wrapper.", price: 800, is_available: true, image: "https://images.unsplash.com/photo-1626132647523-66d4f1fdc24d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", popular: true },
        { id: "i5", name: "Amala (Wrap)", description: "Authentic fluffy Oyo Amala served straight from the steaming pot.", price: 500, is_available: true, image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: "i6", name: "Jollof Rice (Portion)", description: "Smoky firewood-style campus party Jollof rice.", price: 1200, is_available: true, image: "https://images.unsplash.com/photo-1604899097473-2ab84d6d14ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", popular: true },
        { id: "i12", name: "Fried Rice (Portion)", description: "Rich fried rice with veggies and liver chunks.", price: 1300, is_available: true, image: "https://images.unsplash.com/photo-1583304000676-4877530f0c26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
      ]
    },
    {
      name: "Proteins & Meats",
      emoji: "🍗",
      items: [
        { id: "i1", name: "Fried Turkey Wing", description: "Spicy and crunchy golden turkey wing marinated in pepper sauce.", price: 1500, is_available: true, image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", popular: true },
        { id: "i2", name: "Assorted Meat", description: "Tender shaki, ponmo, and slow-cooked beef in rich buka pepper stew.", price: 1000, is_available: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: "i3", name: "Catfish (Point & Kill)", description: "Freshly spiced pepper soup whole catfish.", price: 2500, is_available: false, image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: "i10", name: "Boiled Egg", description: "Farm fresh hard-boiled egg.", price: 300, is_available: true, image: "https://images.unsplash.com/photo-1582708417311-978a321e3fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
      ]
    },
    {
      name: "Quick Bites & Sides",
      emoji: "🍟",
      items: [
        { id: "i11", name: "Fried Plantain (Dodo)", description: "Sweet and ripe fried golden plantain slices.", price: 500, is_available: true, image: "https://images.unsplash.com/photo-1628205042134-47d4a18d1348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: "i13", name: "Moi Moi Elewe", description: "Steamed savory beans pudding with egg center.", price: 600, is_available: true, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", popular: true }
      ]
    },
    {
      name: "Chilled Drinks",
      emoji: "🥤",
      items: [
        { id: "i7", name: "Chilled Coke (50cl)", description: "Ice-cold refreshing Coca-Cola pet bottle.", price: 400, is_available: true, image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
        { id: "i8", name: "Bottled Pure Water (75cl)", description: "Cold spring drinking water.", price: 200, is_available: true, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
      ]
    }
  ]
};

const VendorMenu = () => {
  const { vendorSlug } = useParams();
  const { addToCart, decrementQuantity, cartItems } = useCart();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('bukka_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bukka_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bukka_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Fetch vendor data & menu
  useEffect(() => {
    const fetchVendorMenu = async () => {
      setLoading(true);
      try {
        const [vendorData, menuData] = await Promise.all([
          publicService.getVendorBySlug(vendorSlug),
          publicService.getVendorMenuBySlug(vendorSlug)
        ]);

        const rawCategories = menuData?.categories || menuData || {};
        setVendor({
          id: vendorData.vendor_id,
          slug: vendorData.slug || vendorSlug,
          name: vendorData.business_name,
          isOpen: vendorData.is_active !== false,
          rating: vendorData.rating || 4.7,
          reviewCount: vendorData.review_count || 120,
          location: vendorData.location || 'Campus Food Core',
          deliveryTime: vendorData.delivery_time || '10-20 min',
          image: vendorData.image || vendorData.cover_image,
          coverImage: vendorData.cover_image,
          tags: vendorData.tags || ["🔥 Popular Bukka", "⚡ Instant Prep"],
          categories: transformCategories(rawCategories)
        });
      } catch (err) {
        console.error('Error fetching vendor:', err);
        setVendor(MOCK_VENDOR);
      } finally {
        setLoading(false);
      }
    };

    if (vendorSlug) {
      fetchVendorMenu();
    }
  }, [vendorSlug]);

  const transformCategories = (categories) => {
    if (!categories) return [];

    if (Array.isArray(categories)) {
      const grouped = {};
      categories.forEach(item => {
        const cat = item.category || 'Dishes';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });
      return Object.entries(grouped).map(([name, items]) => ({
        name,
        emoji: getCategoryEmoji(name),
        items: items.map(item => ({
          id: item.id.toString(),
          name: item.name,
          description: item.description || '',
          price: item.price,
          is_available: item.is_available !== false,
          image: item.image || item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          popular: item.popular || false
        }))
      }));
    }

    return Object.entries(categories).map(([name, items]) => ({
      name,
      emoji: getCategoryEmoji(name),
      items: (Array.isArray(items) ? items : []).map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || '',
        price: item.price,
        is_available: item.is_available !== false,
        image: item.image || item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        popular: item.popular || false
      }))
    }));
  };

  const getCategoryEmoji = (categoryName) => {
    const emojis = {
      'Main': '🍚', 'Rice': '🍚', 'Swallows': '🍲', 'Swallows & Rice': '🍚',
      'Noodles': '🍜', 'Spaghetti': '🍝', 'Macaroni': '🧀', 'Yam & Plantain': '🍠',
      'Special Breakfast': '🥞', 'Pepper Soup': '🍲', 'Signature Specials': '👑',
      'Proteins': '🍗', 'Protein': '🍗', 'Meat': '🍖', 'Proteins & Meats': '🍗',
      'Sides': '🍟', 'Extras': '🍗', 'Quick Bites & Sides': '🍟',
      'Drinks': '🥤', 'Drink': '🥤', 'Chilled Drinks': '🥤',
      'Fast Food': '🍔', 'Breakfast': '🥞', 'Suya': '🔥'
    };
    return emojis[categoryName] || '🍴';
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filtered categories based on search & category pill
  const filteredCategories = useMemo(() => {
    if (!vendor?.categories) return [];

    return vendor.categories
      .map(cat => {
        // If category filter active and doesn't match
        if (activeCategory !== 'all' && cat.name !== activeCategory) {
          return null;
        }

        let items = cat.items;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          items = items.filter(
            i => i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)
          );
        }

        if (items.length === 0) return null;
        return { ...cat, items };
      })
      .filter(Boolean);
  }, [vendor, activeCategory, searchQuery]);

  // Build the guaranteed WhatsApp prefilled message URL
  const waUrl = useMemo(() => {
    const phone = GENERAL_WHATSAPP_NUMBER;
    const vendorName = vendor?.name || 'Campus Bukka';
    const slug = vendor?.slug || vendorSlug || '';
    const loc = vendor?.location ? ` (${vendor.location})` : '';
    const msg = `Hello Auntie Chioma! I'm on the menu page for *${vendorName}*${loc} [ref:${slug}]. Please help me place an order!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [vendor, vendorSlug]);

  // Total items in menu
  const totalItemCount = useMemo(() => {
    return vendor?.categories?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0;
  }, [vendor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] dark:bg-[#11141D] text-black dark:text-white flex flex-col justify-center items-center p-6 selection:bg-[#FFE600] selection:text-black">
        <div className="bg-white dark:bg-[#1C2230] border-4 border-black dark:border-white rounded-3xl p-8 max-w-sm w-full text-center shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#2CD6EB] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-3 border-black flex items-center justify-center mx-auto text-black shadow-[3px_3px_0px_0px_#000] animate-bounce">
            <ShoppingBag size={28} className="stroke-[2.5]" />
          </div>
          <h2 className="font-display font-black text-2xl uppercase tracking-wide">Loading Menu...</h2>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Fetching fresh dishes, prices, and kitchen availability.
          </p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] dark:bg-[#11141D] text-black dark:text-white flex flex-col justify-center items-center p-6">
        <div className="bg-white dark:bg-[#1C2230] border-4 border-black dark:border-white rounded-3xl p-8 max-w-md w-full text-center shadow-[8px_8px_0px_0px_#000] space-y-4">
          <span className="text-5xl">🍽️</span>
          <h2 className="font-display font-black text-2xl">Bukka Not Found</h2>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            This food spot may be taking a break or the link is expired.
          </p>
          <Link
            to="/vendors"
            className="inline-flex items-center gap-2 bg-[#FA6131] text-white font-display font-black text-xs uppercase px-5 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]"
          >
            <ArrowLeft size={16} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE] dark:bg-[#11141D] text-gray-950 dark:text-gray-100 pb-36 selection:bg-[#FFE600] selection:text-black transition-colors">
      
      {/* ── STICKY TOP NAV BAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF7EE]/95 dark:bg-[#11141D]/95 backdrop-blur-md border-b-3 border-black dark:border-white transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          <Link
            to="/vendors"
            className="inline-flex items-center gap-2 bg-white dark:bg-[#1C2230] text-black dark:text-white font-display font-black text-xs uppercase tracking-wide px-3.5 py-2 rounded-xl border-2 border-black dark:border-white shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="stroke-[3]" />
            <span className="hidden sm:inline">All Bukkas</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Center Brand Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-display font-black uppercase tracking-wider">
            <Sparkles size={13} className="text-[#FA6131] fill-[#FA6131]" />
            <span className="truncate max-w-[140px] sm:max-w-none">{vendor.name}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black text-xs uppercase tracking-wider px-3 py-2 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              title="Chat with Auntie Chioma to order from this bukka"
            >
              <MessageCircle size={15} className="fill-black text-[#25D366]" />
              <span className="hidden md:inline">Order via Chat</span>
              <span className="md:hidden">Chat</span>
            </a>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl bg-white dark:bg-[#1C2230] text-black dark:text-white border-2 border-black dark:border-white shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              {isDarkMode ? <Sun size={17} className="text-[#FFE600]" /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">

        {/* ── HERO BANNER & STORE IDENTITY CARD ───────────────────────────── */}
        <div className="relative bg-white dark:bg-[#1C2230] border-3 sm:border-4 border-black dark:border-white rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#2CD6EB] sm:dark:shadow-[8px_8px_0px_0px_#2CD6EB] mb-8">
          
          {/* Cover Photo / Neo-Banner Header */}
          <div className="h-44 sm:h-56 relative overflow-hidden border-b-3 sm:border-b-4 border-black dark:border-white bg-[#FFE600]">
            <img
              src={vendor.coverImage || vendor.image}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/25 backdrop-contrast-125" />

            {/* Sticker Tags Pinned to Cover */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#25D366] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                {vendor.isOpen ? 'Open Now' : 'Closed'}
              </span>

              {vendor.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="hidden sm:inline-flex items-center px-3 py-1 rounded-md bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-black uppercase tracking-wider -rotate-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Top Right Quick Share */}
            <div className="absolute top-4 right-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] font-display font-black text-xs uppercase hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                title="Share menu link"
              >
                {copied ? <Check size={14} className="text-emerald-600 stroke-[3]" /> : <Share2 size={14} />}
                <span>{copied ? 'Copied! ✨' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Profile Details & Tactile Stickers */}
          <div className="p-5 sm:p-7 pt-0 relative">
            
            {/* Big Initial Avatar Badge */}
            <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-4">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-[#FFE600] text-black border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center font-display font-black text-2xl sm:text-3xl shrink-0">
                {(vendor.name || '?').slice(0, 2).toUpperCase()}
              </div>

              {/* Verified Bukka Stamp */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2CD6EB] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-black uppercase tracking-wider rotate-1">
                <ShieldCheck size={15} className="stroke-[2.5]" />
                <span>Verified Bukka</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 mb-4">
              <h1 className="font-display font-black text-2xl sm:text-4xl text-gray-950 dark:text-white tracking-tight">
                {vendor.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-2xl">
                Order freshly prepared campus dishes for quick hostel delivery or instant table pickup.
              </p>
            </div>

            {/* Neo Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FEF08A] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-bold">
                <MapPin size={13} className="stroke-[2.5]" />
                <span>{vendor.location}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#BAE6FD] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-bold">
                <Clock size={13} className="stroke-[2.5]" />
                <span>{vendor.deliveryTime}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-black">
                <Star size={13} className="fill-black stroke-[2]" />
                <span>{vendor.rating}</span>
                <span className="text-black/70 font-semibold">({vendor.reviewCount})</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#BBF7D0] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-display font-bold">
                <Zap size={13} className="stroke-[2.5]" />
                <span>Fast Kitchen Prep</span>
              </span>
            </div>

            {/* Direct WhatsApp Pre-filled Ordering Strip */}
            <div className="mt-5 pt-5 border-t-2 border-black/15 dark:border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
                <p className="text-xs font-display font-bold text-gray-800 dark:text-gray-200">
                  Prefer ordering via text? Chat directly with Auntie Chioma!
                </p>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <MessageCircle size={16} className="fill-black text-[#25D366]" />
                <span>Open Pre-filled WhatsApp Chat</span>
              </a>
            </div>

          </div>
        </div>

        {/* ── IN-MENU SEARCH & CONTROLS ────────────────────────────────────── */}
        <div className="space-y-4 mb-6">
          <div className="relative flex items-center bg-white dark:bg-[#1C2230] border-2 sm:border-3 border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#2CD6EB] overflow-hidden">
            <Search size={18} className="absolute left-4 text-black dark:text-white stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, extras (e.g. Jollof, Turkey, Plantain)..."
              className="w-full pl-11 pr-11 py-3.5 bg-transparent text-gray-950 dark:text-white text-xs sm:text-sm font-medium focus:outline-none placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-black flex items-center justify-center cursor-pointer"
              >
                <X size={14} className="stroke-[3]" />
              </button>
            )}
          </div>

          {/* Sticky Category Quick Jump Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-display font-black text-xs uppercase tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#FA6131] text-white border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-white dark:bg-[#1C2230] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:bg-[#FFE600] hover:text-black dark:hover:bg-[#FFE600] dark:hover:text-black'
              }`}
            >
              <span>🍽️ All Dishes ({totalItemCount})</span>
            </button>

            {vendor.categories?.map((cat, idx) => {
              const isSelected = activeCategory === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-display font-black text-xs uppercase tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FA6131] text-white border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white dark:bg-[#1C2230] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:bg-[#2CD6EB] hover:text-black dark:hover:bg-[#2CD6EB] dark:hover:text-black'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-bold opacity-80">({cat.items.length})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MENU CATEGORIES & FOOD ITEMS FEED ────────────────────────────── */}
        <main className="space-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, catIdx) => (
              <section key={catIdx} className="space-y-4">
                
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-2 border-b-2 border-black/15 dark:border-white/15">
                  <span className="text-2xl">{category.emoji}</span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-gray-950 dark:text-white uppercase tracking-tight">
                    {category.name}
                  </h2>
                  <span className="ml-auto px-2.5 py-0.5 rounded-md bg-[#FFE600] text-black border-2 border-black text-xs font-display font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                    {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => {
                    const itemInCart = cartItems.find((ci) => String(ci.id) === String(item.id));
                    const currentQty = itemInCart ? itemInCart.quantity : 0;

                    return (
                      <div
                        key={item.id}
                        className={`group relative bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#2CD6EB] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000] transition-all p-4 flex flex-col justify-between ${
                          !item.is_available ? 'opacity-65 grayscale' : ''
                        }`}
                      >
                        <div className="flex gap-3.5 items-start mb-3">
                          {/* Food Thumbnail */}
                          <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-xl border-2 border-black dark:border-white overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.popular && (
                              <div className="absolute top-1 left-1 bg-[#FFE600] text-black border border-black text-[9px] font-display font-black uppercase px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] -rotate-2">
                                🔥 Hot
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="font-display font-black text-base text-gray-950 dark:text-white leading-tight">
                                {item.name}
                              </h3>
                            </div>

                            {item.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium line-clamp-2 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            {!item.is_available && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-500 font-display font-black text-[10px] uppercase">
                                Sold Out Today
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Tag & Action Stepper Footer */}
                        <div className="flex items-center justify-between pt-3 border-t-2 border-black/10 dark:border-white/10 mt-auto">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#FEF08A] dark:bg-[#2CD6EB] text-black border-2 border-black font-display font-black text-sm sm:text-base shadow-[1.5px_1.5px_0px_0px_#000]">
                            ₦{item.price.toLocaleString()}
                          </span>

                          {/* Interactive Stepper or Add Button */}
                          <div>
                            {currentQty > 0 ? (
                              <div className="flex items-center gap-1.5 bg-[#FAF7EE] dark:bg-[#11141D] border-2 border-black dark:border-white rounded-xl p-1 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
                                <button
                                  type="button"
                                  onClick={() => decrementQuantity(item.id)}
                                  className="w-7 h-7 rounded-lg bg-white dark:bg-[#1C2230] text-black dark:text-white font-black text-xs border border-black dark:border-white flex items-center justify-center hover:bg-[#FA6131] hover:text-white active:scale-95 transition-all cursor-pointer"
                                  title="Decrease quantity"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={13} className="stroke-[3]" />
                                </button>
                                <span className="w-6 text-center font-display font-black text-xs sm:text-sm text-black dark:text-white select-none">
                                  {currentQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(item, vendor.slug, vendor.name, vendor.id)}
                                  className="w-7 h-7 rounded-lg bg-[#FA6131] text-white font-black text-xs border border-black flex items-center justify-center hover:bg-[#ff7244] active:scale-95 transition-all cursor-pointer"
                                  title="Add one more"
                                  aria-label="Add one more"
                                >
                                  <Plus size={13} className="stroke-[3]" />
                                </button>
                              </div>
                            ) : item.is_available && vendor.isOpen ? (
                              <button
                                type="button"
                                onClick={() => addToCart(item, vendor.slug, vendor.name, vendor.id)}
                                className="inline-flex items-center gap-1 bg-[#FA6131] hover:bg-[#ff7244] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl px-4 py-2 border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                              >
                                <Plus size={14} className="stroke-[3]" />
                                <span>Add</span>
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-500 font-display font-black text-xs uppercase border-2 border-black">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="bg-white dark:bg-[#1C2230] border-3 border-black dark:border-white rounded-3xl p-8 text-center shadow-[6px_6px_0px_0px_#000] space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="font-display font-black text-xl text-black dark:text-white">
                No Dishes Match Your Search
              </h3>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                {searchQuery
                  ? `Nothing matched "${searchQuery}". Try searching for rice, swallow, chicken, or drink.`
                  : 'No food items are currently listed in this category.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs uppercase tracking-wide px-4 py-2 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </main>

      </div>

      {/* Floating Bottom Cart Summary Bar */}
      <CartSummaryBar />
    </div>
  );
};

export default VendorMenu;
