import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store, Phone, KeyRound, MapPin, Clock, Package,
  Truck, CreditCard, ChefHat, Check, CheckCircle2,
  ChevronRight, ChevronLeft, Loader2, Sparkles, Plus,
  Trash2, Copy, ExternalLink, QrCode, ArrowRight,
  ShieldCheck, AlertCircle, MessageCircle
} from 'lucide-react';
import { vendorService } from '../services/vendorService';
import { adminService } from '../services/adminService';
import { getApiErrorMessage, resolveAssetUrl } from '../services/api';

/* ── Nigerian Banks Catalog ─────────────────────────────────────────── */
const NIGERIAN_BANKS = [
  { name: 'Opay', code: '090267' },
  { name: 'Palmpay', code: '090275' },
  { name: 'Moniepoint', code: '090405' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Access Bank', code: '044' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'Wema Bank / ALAT', code: '035' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First City Monument Bank (FCMB)', code: '214' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Keystone Bank', code: '082' },
];

/* ── Campus Presets ──────────────────────────────────────────────────── */
const CAMPUS_PRESETS = [
  'UNILAG — New Hall Quadrangle',
  'UNILAG — Faculty of Science',
  'UI — Queen Idia / Mellanby',
  'FUTA — South Gate',
  'OAU — Mozambique / Angola',
  'Babcock — Amphitheatre',
  'Covenant — Cafeteria 1',
];

/* ── Menu Preset Starters ────────────────────────────────────────────── */
const STARTER_MENU_PRESETS = [
  { name: 'Jollof Rice & Chicken', price: 2500, category: 'Rice' },
  { name: 'Fried Rice & Beef', price: 2200, category: 'Rice' },
  { name: 'Amala & Gbegiri / Ewedu', price: 2000, category: 'Swallow' },
  { name: 'Chicken Shawarma', price: 1800, category: 'Grills & Snacks' },
  { name: 'Cold Soft Drink', price: 500, category: 'Drinks' },
];

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const STEPS = [
  { id: 'profile', title: 'Store & WhatsApp', icon: Store },
  { id: 'fulfillment', title: 'Campus Delivery', icon: Truck },
  { id: 'banking', title: 'Bank Account', icon: CreditCard },
  { id: 'menu', title: 'Starter Menu', icon: ChefHat },
];

const OnboardVendorForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [pin, setPin] = useState('');
  const [location, setLocation] = useState('');

  // Fulfillment State
  const [containerCost, setContainerCost] = useState(150);
  const [offersDelivery, setOffersDelivery] = useState(true);
  const [offersPickup, setOffersPickup] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(300);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('22:00');

  // Banking State
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [resolvingBank, setResolvingBank] = useState(false);
  const [bankResolved, setBankResolved] = useState(false);
  const [bankResolveError, setBankResolveError] = useState(null);

  // Menu State
  const [menuItems, setMenuItems] = useState([
    { name: 'Jollof Rice & Chicken', price: 2500, category: 'Rice' },
  ]);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-slug generation
  useEffect(() => {
    if (!isSlugManual && businessName) {
      setSlug(slugify(businessName));
    }
  }, [businessName, isSlugManual]);

  // Real-time Bank Resolution
  const handleResolveBank = useCallback(async (num, code) => {
    if (num.length === 10 && code) {
      setResolvingBank(true);
      setBankResolveError(null);
      try {
        const res = await vendorService.resolveBank(num, code);
        if (res?.account_name) {
          setAccountName(res.account_name);
          setBankResolved(true);
        }
      } catch (err) {
        setBankResolved(false);
        setBankResolveError('Could not auto-verify account name. You can enter it manually below.');
      } finally {
        setResolvingBank(false);
      }
    } else {
      setBankResolved(false);
    }
  }, []);

  const handleAccountNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);
    if (val.length === 10 && bankCode) {
      handleResolveBank(val, bankCode);
    }
  };

  const handleBankCodeChange = (e) => {
    const val = e.target.value;
    setBankCode(val);
    if (accountNumber.length === 10 && val) {
      handleResolveBank(accountNumber, val);
    }
  };

  // Add / Remove Starter Menu Items
  const handleAddPresetItem = (preset) => {
    if (!menuItems.some((i) => i.name.toLowerCase() === preset.name.toLowerCase())) {
      setMenuItems([...menuItems, { ...preset }]);
    }
  };

  const handleCustomItemChange = (index, field, value) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const handleRemoveMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleAddNewMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', category: 'Main Meal' }]);
  };

  // Form Validation per Step
  const canAdvance = () => {
    if (currentStep === 0) {
      return businessName.trim().length >= 2 &&
        ownerName.trim().length >= 2 &&
        whatsappNumber.replace(/\D/g, '').length >= 10 &&
        pin.trim().length === 4;
    }
    if (currentStep === 1) {
      return (offersDelivery || offersPickup) && openingTime && closingTime;
    }
    if (currentStep === 2) {
      return bankCode && accountNumber.length === 10 && accountName.trim().length >= 2;
    }
    return true;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedHours = `${openingTime} – ${closingTime}`;
    const cleanPhone = whatsappNumber.replace(/\D/g, '');

    const payload = {
      business_name: businessName.trim(),
      owner_name: ownerName.trim(),
      slug: slug || slugify(businessName),
      whatsapp_number: cleanPhone,
      pin: pin.trim(),
      location: location.trim() || undefined,
      hours: formattedHours,
      container_cost: Number(containerCost) || 0,
      offers_delivery: Boolean(offersDelivery),
      offers_pickup: Boolean(offersPickup),
      delivery_fee: offersDelivery ? Number(deliveryFee) || 0 : 0,
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName.trim(),
      menu_items: menuItems
        .filter((item) => item.name && item.price !== '')
        .map((item) => ({
          name: item.name.trim(),
          price: Number(item.price),
          category: item.category?.trim() || 'General',
        })),
    };

    try {
      const isAdmin = Boolean(sessionStorage.getItem('admin_access_token'));
      let res;
      if (isAdmin) {
        res = await adminService.onboardVendor(payload);
      } else {
        res = await vendorService.selfRegister(payload);
      }

      setSuccessData({
        ...res,
        business_name: businessName,
        whatsapp_number: cleanPhone,
        slug: res.slug || slug || slugify(businessName),
        pin: pin.trim(),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Onboarding failed:', err);
      setError(getApiErrorMessage(err, 'Failed to complete registration. Please check details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (successData?.pairing_code) {
      navigator.clipboard.writeText(`/link ${successData.pairing_code}`);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyOrderLink = () => {
    if (successData?.slug) {
      const link = `https://wa.me/?text=Hello,%20I%20want%20to%20order%20from%20${successData.slug}`;
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     SUCCESS STATE (1-Tap WhatsApp Connect & Launchpad)
     ═══════════════════════════════════════════════════════════════════════ */
  if (successData) {
    const qrImageUrl = resolveAssetUrl(successData.qr_image_url);
    const waLinkUrl = successData.whatsapp_link_url || `https://wa.me/?text=%2Flink%20${successData.pairing_code}`;

    return (
      <div className="min-h-screen bg-[#0f1118] text-white flex flex-col justify-center py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400 shadow-xl shadow-green-500/10">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {successData.business_name} is Ready! 🚀
            </h1>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Your store is provisioned for WhatsApp food ordering. Follow the simple step below to link your WhatsApp alerts.
            </p>
          </div>

          {/* Step 1: 1-Tap WhatsApp Link Button (Hero Action) */}
          <div className="bg-[#171B26] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-widest text-[#25D366]">
              <MessageCircle size={16} />
              Step 1 · Connect WhatsApp Bot
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Link Incoming Kitchen Alerts
              </h3>
              <p className="text-xs text-gray-400">
                Tap below to open WhatsApp on this device and send the pre-filled verification command.
              </p>
            </div>

            <a
              href={waLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-base shadow-xl shadow-[#25D366]/25 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle size={22} className="text-black" />
              <span>Connect WhatsApp in 1 Tap</span>
            </a>

            {/* Manual Code Fallback */}
            <div className="bg-[#0f1118] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-gray-500 font-medium">Or send manually on WhatsApp:</span>
                <div className="font-mono font-bold text-white tracking-wider">
                  /link {successData.pairing_code}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedCode ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Vendor Dashboard & Storefront */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Enter Dashboard */}
            <div className="bg-[#171B26] border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Vendor PWA Portal
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Manage Live Orders & Menu
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Sign in using your WhatsApp number and the 4-digit PIN you just created.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/vendor/login')}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Go to Vendor Login</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Customer Storefront Link */}
            <div className="bg-[#171B26] border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FA6131] flex items-center gap-1">
                  <ExternalLink size={12} />
                  Ordering Storefront
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Your WhatsApp Menu Link
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-mono truncate">
                  bukka.ai/order/{successData.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/order/${successData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#FA6131]/10 hover:bg-[#FA6131]/20 border border-[#FA6131]/30 text-[#FA6131] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Preview</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyOrderLink}
                  className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs transition-colors shrink-0"
                  title="Copy ordering link"
                >
                  {copiedLink ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Presentation if available */}
          {qrImageUrl && (
            <div className="bg-[#171B26] border border-white/10 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <QrCode size={15} className="text-[#2CD6EB]" />
                  Table Order QR Code
                </span>
                <p className="text-xs text-gray-500 max-w-xs">
                  Print and place this on your student counter or dining tables for 1-tap WhatsApp ordering.
                </p>
              </div>
              <img
                src={qrImageUrl}
                alt="Store QR"
                className="w-16 h-16 rounded-xl bg-white p-1 object-contain shrink-0 border border-white/10"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MULTI-STEP FORM STATE
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0f1118] text-white py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="text-right">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FA6131]">
              WhatsApp-First Kitchen
            </span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Set Up Your Bukka in 2 Minutes ⚡
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Receive orders on WhatsApp, charge campus pack fees, and get automated daily bank payouts.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-[#171B26] border border-white/10 rounded-2xl p-2.5 grid grid-cols-4 gap-1.5 shadow-xl">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (idx < currentStep) setCurrentStep(idx);
                }}
                disabled={idx > currentStep}
                className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-center transition-all ${
                  isActive
                    ? 'bg-[#FA6131]/15 text-[#FA6131] border border-[#FA6131]/30'
                    : isDone
                    ? 'text-green-400 hover:bg-white/[0.03]'
                    : 'text-gray-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center">
                  {isDone ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight line-clamp-1">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-4 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-[#171B26] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* ── STEP 0: Store & WhatsApp Profile ────────────────────────────── */}
          {currentStep === 0 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Store size={18} className="text-[#FA6131]" />
                  Kitchen & WhatsApp Details
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Basic store identity and the phone number that will receive incoming order notifications.
                </p>
              </div>

              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Business / Kitchen Name <span className="text-[#FA6131]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iya Basira Amala, Taste of Ghana"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#0f1118] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FA6131] transition-colors"
                />
                {slug && (
                  <p className="text-[11px] text-gray-500 font-mono">
                    Store URL: bukka.ai/order/{slug}
                  </p>
                )}
              </div>

              {/* Owner Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Owner / Manager Full Name <span className="text-[#FA6131]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sade Afolabi"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-[#0f1118] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FA6131] transition-colors"
                />
              </div>

              {/* Campus Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#2CD6EB]" />
                  Campus & Kitchen Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. UNILAG New Hall Quadrangle, OAU Mozambique"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0f1118] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#2CD6EB] transition-colors"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {CAMPUS_PRESETS.slice(0, 3).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setLocation(p)}
                      className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded-lg border border-white/5 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Number & PIN Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Phone size={13} className="text-green-400" />
                    WhatsApp Phone <span className="text-[#FA6131]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      🇳🇬 +234
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="8012345678"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-[#0f1118] border border-white/10 rounded-2xl pl-20 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Order notifications will be sent to this WhatsApp.
                  </p>
                </div>

                {/* 4-Digit Security PIN */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <KeyRound size={13} className="text-purple-400" />
                    4-Digit Dashboard PIN <span className="text-[#FA6131]">*</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full bg-[#0f1118] border border-white/10 rounded-2xl px-4 py-3 text-sm font-extrabold text-white tracking-[0.4em] text-center focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <p className="text-[10px] text-gray-500">
                    Used to log in to your vendor dashboard with your phone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Campus Fulfillment & Hours ───────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck size={18} className="text-[#2CD6EB]" />
                  Fulfillment & Takeaway Pack
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure your takeaway container fee and student delivery options for campus hostels.
                </p>
              </div>

              {/* Takeaway Pack Fee (Flow Screen 2) */}
              <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
                    <Package size={14} className="text-[#FA6131]" />
                    Takeaway Container Fee (Per Pack)
                  </label>
                  <span className="text-[10px] font-bold text-[#FA6131] bg-[#FA6131]/10 px-2 py-0.5 rounded-full border border-[#FA6131]/20">
                    Auto-Charged in WhatsApp Flow
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[0, 150, 200, 250, 300].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setContainerCost(preset)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        Number(containerCost) === preset
                          ? 'bg-[#FA6131] border-[#FA6131] text-white shadow-lg shadow-[#FA6131]/20'
                          : 'bg-[#171B26] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {preset === 0 ? 'Free (₦0)' : `₦${preset}`}
                    </button>
                  ))}
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₦</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={containerCost}
                      onChange={(e) => setContainerCost(e.target.value)}
                      className="w-full bg-[#171B26] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FA6131]"
                    />
                  </div>
                </div>
              </div>

              {/* Service Modes: Delivery vs Pickup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Delivery Toggle Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  offersDelivery ? 'bg-white/[0.03] border-white/15' : 'bg-[#0f1118] border-white/5 opacity-70'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Truck size={14} className="text-[#2CD6EB]" />
                      Campus Delivery
                    </span>
                    <input
                      type="checkbox"
                      checked={offersDelivery}
                      onChange={(e) => setOffersDelivery(e.target.checked)}
                      className="w-4 h-4 accent-[#2CD6EB] rounded"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Deliver food around student hostels and campus faculties.
                  </p>
                  {offersDelivery && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Base Hostel Delivery Fee
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₦</span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={deliveryFee}
                          onChange={(e) => setDeliveryFee(e.target.value)}
                          className="w-full bg-[#0f1118] border border-white/10 rounded-xl pl-7 pr-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#2CD6EB]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pickup Toggle Card */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  offersPickup ? 'bg-white/[0.03] border-white/15' : 'bg-[#0f1118] border-white/5 opacity-70'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Store size={14} className="text-green-400" />
                      Pickup / Dine-In
                    </span>
                    <input
                      type="checkbox"
                      checked={offersPickup}
                      onChange={(e) => setOffersPickup(e.target.checked)}
                      className="w-4 h-4 accent-green-400 rounded"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Students can pick up their orders directly at your kitchen spot.
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#FA6131]" />
                  Daily Kitchen Operating Schedule
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 mb-1">Kitchen Opens</span>
                    <input
                      type="time"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      className="w-full bg-[#171B26] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FA6131]"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 mb-1">Kitchen Closes</span>
                    <input
                      type="time"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      className="w-full bg-[#171B26] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FA6131]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Daily Payouts & Settlement Bank ─────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard size={18} className="text-green-400" />
                  Bank Account for Daily Payouts
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verified student payments are disbursed directly to this Nigerian bank account every day.
                </p>
              </div>

              {/* Bank Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Select Your Bank <span className="text-[#FA6131]">*</span>
                </label>
                <select
                  required
                  value={bankCode}
                  onChange={handleBankCodeChange}
                  className="w-full bg-[#0f1118] border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                  <option value="">Choose bank or fintech…</option>
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 10-Digit Account Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  10-Digit NUBAN Account Number <span className="text-[#FA6131]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    placeholder="0123456789"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    className="w-full bg-[#0f1118] border border-white/10 rounded-2xl px-4 py-3 text-base font-mono font-bold tracking-wider text-white focus:outline-none focus:border-green-400 transition-colors"
                  />
                  {resolvingBank && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                      <Loader2 size={14} className="animate-spin text-green-400" />
                      <span>Verifying…</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolved / Manual Account Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Account Holder Name <span className="text-[#FA6131]">*</span>
                  </label>
                  {bankResolved && (
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                      <Check size={11} />
                      Verified
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. SADE AFOLABI"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={`w-full bg-[#0f1118] border rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none transition-colors ${
                    bankResolved
                      ? 'border-green-500/40 bg-green-500/[0.02]'
                      : 'border-white/10 focus:border-green-400'
                  }`}
                />
                {bankResolveError && (
                  <p className="text-[11px] text-amber-400">{bankResolveError}</p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Starter Menu ────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-white/5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ChefHat size={18} className="text-amber-400" />
                      Starter Food Menu
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Add a few popular items to launch your digital catalog. You can edit full menus anytime.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#FA6131] bg-[#FA6131]/10 px-2.5 py-1 rounded-full border border-[#FA6131]/20">
                    {menuItems.length} {menuItems.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
              </div>

              {/* 1-Tap Campus Presets */}
              <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-400" />
                  1-Tap Popular Campus Favorites
                </span>
                <div className="flex flex-wrap gap-2">
                  {STARTER_MENU_PRESETS.map((preset) => {
                    const alreadyAdded = menuItems.some(
                      (i) => i.name.toLowerCase() === preset.name.toLowerCase()
                    );
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleAddPresetItem(preset)}
                        disabled={alreadyAdded}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                          alreadyAdded
                            ? 'bg-white/5 border-white/5 text-gray-500 cursor-default'
                            : 'bg-[#171B26] border-white/10 text-gray-300 hover:text-white hover:border-[#FA6131]/40'
                        }`}
                      >
                        <span>{preset.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">₦{preset.price}</span>
                        {alreadyAdded ? <Check size={12} className="text-green-400" /> : <Plus size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Items List */}
              <div className="space-y-2.5">
                {menuItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0f1118] border border-white/10 rounded-2xl p-3.5 flex items-center gap-2.5"
                  >
                    <span className="text-xs font-bold text-gray-500 w-5 text-center">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Jollof Rice)"
                        value={item.name}
                        onChange={(e) => handleCustomItemChange(idx, 'name', e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">₦</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleCustomItemChange(idx, 'price', e.target.value)}
                        className="w-full bg-[#171B26] border border-white/10 rounded-xl pl-6 pr-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#FA6131]"
                      />
                    </div>
                    {menuItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(idx)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Item Button */}
              <button
                type="button"
                onClick={handleAddNewMenuItem}
                className="w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/15 text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Another Dish</span>
              </button>
            </div>
          )}

          {/* ── Form Navigation Buttons ───────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canAdvance()}
                className="px-6 py-3 rounded-2xl bg-[#FA6131] hover:bg-[#ff7244] text-white text-xs font-extrabold shadow-xl shadow-[#FA6131]/25 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !canAdvance()}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#FA6131] to-[#e04e1f] text-white text-xs font-extrabold shadow-xl shadow-[#FA6131]/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{loading ? 'Launching Bukka…' : 'Launch My WhatsApp Kitchen'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardVendorForm;
