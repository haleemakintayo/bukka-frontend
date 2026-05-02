import React, { useState, useEffect } from 'react';
import { Trash, Plus, CheckCircle, ExternalLink, QrCode, Smartphone, Link2, Globe } from 'lucide-react';
import { getApiErrorMessage, onboardVendor, resolveAssetUrl } from '../services/api';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const OnboardVendorForm = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    whatsapp_number: '',
    slug: '',
    bankName: '',
    accountNumber: '',
    email: '',
    password: ''
  });

  const [isSlugEditedManually, setIsSlugEditedManually] = useState(false);
  const [menuItems, setMenuItems] = useState([{ name: '', price: '', category: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const nigerianBanks = [
    'Access Bank',
    'Guaranty Trust Bank',
    'First Bank',
    'United Bank for Africa',
    'Zenith Bank',
    'Kuda Bank',
    'Opay',
    'Palmpay',
  ];

  // Auto-suggest slug when business name changes, unless manually edited
  useEffect(() => {
    if (!isSlugEditedManually && formData.business_name) {
      setFormData(prev => ({ ...prev, slug: slugify(prev.business_name) }));
    }
  }, [formData.business_name, isSlugEditedManually]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      setIsSlugEditedManually(true);
      setFormData({ ...formData, [name]: slugify(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMenuChange = (index, e) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index][e.target.name] = e.target.value;
    setMenuItems(newMenuItems);
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', category: '' }]);
  };

  const removeMenuItem = (index) => {
    const newMenuItems = [...menuItems];
    newMenuItems.splice(index, 1);
    setMenuItems(newMenuItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessData(null);

    const validMenu = menuItems.filter(item => item.name || item.price);

    const payload = {
      business_name: formData.business_name,
      owner_name: formData.owner_name,
      whatsapp_number: formData.whatsapp_number,
      slug: formData.slug,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      email: formData.email,
      password: formData.password,
      menu_items: validMenu,
    };

    try {
      const response = await onboardVendor(payload);
      setSuccessData({
        ...response,
        submitted_slug: payload.slug || slugify(payload.business_name),
      });

      setFormData({
        business_name: '', owner_name: '', whatsapp_number: '', slug: '',
        bankName: '', accountNumber: '', email: '', password: ''
      });
      setMenuItems([{ name: '', price: '', category: '' }]);
      setIsSlugEditedManually(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(getApiErrorMessage(err, 'An unexpected error occurred while communicating with the server.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-bukka-dark-surface px-4 py-2.5 text-sm text-gray-900 dark:text-bukka-soft-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-bukka-cyan focus:ring-bukka-cyan focus:outline-none focus:ring-1 transition-colors';

  const storefrontSlug = successData?.slug || successData?.submitted_slug;
  const qrImageUrl = resolveAssetUrl(successData?.qr_image_url);

  // ─── Success State ─────────────────────────────────────────────────
  if (successData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-bukka-card-surface p-10 rounded-2xl shadow-sm border border-green-200 dark:border-green-900/30 text-center transition-colors">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Vendor Onboarded Successfully</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The digital menu and interactive commerce system are now active.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-10">
            {/* QR Panel */}
            <div className="bg-gray-50 dark:bg-bukka-dark-surface p-6 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
              <QrCode size={32} className="text-gray-400 mb-3" />
              {qrImageUrl && (
                <img
                  src={qrImageUrl}
                  alt="Store QR"
                  className="w-36 h-36 bg-white p-2 rounded-lg shadow-sm mb-4"
                />
              )}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Storefront QR</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Print this and place it on tables</p>
              {storefrontSlug ? (
                <a href={`/order/${storefrontSlug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-bukka-cyan hover:underline">
                  bukkaai.com.ng/order/{storefrontSlug} <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">The storefront slug will appear in the vendor directory after provisioning.</p>
              )}
            </div>

            {/* Pairing Panel */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone size={100} />
              </div>
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                  Action Required
                </span>
                {successData.pairing_code ? (
                  <>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-xl">Device Pairing Code</h3>
                    <div className="bg-white dark:bg-bukka-dark-surface font-mono text-3xl font-bold tracking-widest text-center py-4 rounded-lg shadow-inner mb-4 text-blue-600 dark:text-blue-400">
                      {successData.pairing_code}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      To start receiving orders, the vendor must message our central bot on WhatsApp (or Telegram) and send this exact code:<br /><br />
                      <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 font-mono text-gray-900 dark:text-white font-bold select-all">/link {successData.pairing_code}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-xl">Provisioning Complete</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      This backend response did not include a pairing code, so the vendor can now be managed from the directory using the generated vendor ID.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button onClick={() => setSuccessData(null)} className="rounded-full bg-bukka-orange px-8 py-3 font-bold text-white shadow hover:opacity-90 transition-opacity">
            Onboard Another Vendor
          </button>
        </div>
      </div>
    );
  }

  // ─── Form State ────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-bukka-card-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">vendor onboarding</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create a new digital storefront and allocate an interactive web menu for a vendor.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm" role="alert">
          <strong className="font-bold">Validation Error: </strong>{error}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Left Column ─────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Business Profile & Auth Card */}
            <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white border-b border-gray-100 dark:border-gray-800 pb-3">Business Profile</h3>
              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor="onboard_business_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                  <input type="text" name="business_name" id="onboard_business_name" value={formData.business_name} onChange={handleFormChange} required placeholder="e.g. Iya Basira Amala" autoComplete="off" className={inputClassName} />
                </div>

                {/* Slug Field */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label htmlFor="onboard_slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-1.5"><Link2 size={14} className="text-bukka-cyan" /> Public Store Link (Slug)</span>
                    </label>
                  </div>
                  <input type="text" name="slug" id="onboard_slug" value={formData.slug} onChange={handleFormChange} placeholder="e.g. iya-basira-amala" autoComplete="off" className={inputClassName} />
                  {formData.slug && (
                    <div className="mt-2 flex items-center gap-2 text-xs bg-gray-50 dark:bg-bukka-dark-surface border border-gray-100 dark:border-gray-700/50 rounded-lg px-3 py-2">
                      <Globe size={12} className="text-gray-400 shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400">bukkaai.com.ng/order/<strong className="text-bukka-cyan">{formData.slug}</strong></span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">This link is public-facing. Backend enforces final uniqueness.</p>
                </div>

                <div>
                  <label htmlFor="onboard_owner_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner Full Name</label>
                  <input type="text" name="owner_name" id="onboard_owner_name" value={formData.owner_name} onChange={handleFormChange} required autoComplete="off" className={inputClassName} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="onboard_whatsapp_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Number</label>
                    <input type="tel" name="whatsapp_number" id="onboard_whatsapp_number" value={formData.whatsapp_number} onChange={handleFormChange} required autoComplete="off" placeholder="2348012345678" className={inputClassName} />
                  </div>
                  <div>
                    <label htmlFor="onboard_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor Email (Optional)</label>
                    <input type="email" name="email" id="onboard_email" value={formData.email} onChange={handleFormChange} autoComplete="off" className={inputClassName} />
                  </div>
                </div>

                <div>
                  <label htmlFor="onboard_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Password (Optional)</label>
                  <input type="password" name="password" id="onboard_password" value={formData.password} onChange={handleFormChange} autoComplete="new-password" className={inputClassName} />
                </div>
              </div>
            </div>

            {/* Financial Structure Card */}
            <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white border-b border-gray-100 dark:border-gray-800 pb-3">Financial Structure</h3>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="onboard_bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                  <select name="bankName" id="onboard_bankName" value={formData.bankName} onChange={handleFormChange} required className={inputClassName}>
                    <option value="">Select a bank</option>
                    {nigerianBanks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="onboard_accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" name="accountNumber" id="onboard_accountNumber" value={formData.accountNumber} onChange={handleFormChange} required autoComplete="off" placeholder="10-digit account number" className={inputClassName} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column (Menu Builder) ──────────────────────── */}
          <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white">Dynamic AI Menu Setup</h3>
              <span className="text-xs font-bold text-bukka-cyan bg-bukka-cyan/10 px-2.5 py-1 rounded-full">{menuItems.length} item{menuItems.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="mt-5 space-y-4 flex-1 overflow-y-auto max-h-[520px] pr-1">
              {menuItems.map((item, index) => (
                <div
                  key={`menu-item-${index}`}
                  className="p-4 bg-gray-50 dark:bg-bukka-dark-surface border border-gray-100 dark:border-gray-800 rounded-xl transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Item #{index + 1}</span>
                    {menuItems.length > 1 && (
                      <button type="button" onClick={() => removeMenuItem(index)} className="text-gray-400 hover:text-red-500 transition-colors p-1" aria-label="Remove menu item">
                        <Trash size={15} />
                      </button>
                    )}
                  </div>

                  <input type="text" name="name" value={item.name} onChange={(e) => handleMenuChange(index, e)} placeholder="Item Name (e.g. Jollof Rice)" required className={inputClassName} />

                  <div className="grid grid-cols-5 gap-3 mt-3">
                    <input type="text" name="category" value={item.category} onChange={(e) => handleMenuChange(index, e)} placeholder="Category (e.g. Rice)" className={`col-span-3 ${inputClassName}`} />
                    <input type="number" name="price" value={item.price} onChange={(e) => handleMenuChange(index, e)} placeholder="₦ Price" required className={`col-span-2 ${inputClassName}`} />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMenuItem}
              className="mt-5 w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-bukka-cyan hover:text-bukka-cyan dark:hover:border-bukka-cyan dark:hover:text-bukka-cyan transition-all flex justify-center items-center gap-2 shrink-0"
            >
              <Plus size={16} /> Add Another Menu Item
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-bukka-card-surface px-6 py-4 shadow-sm transition-colors">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-bukka-orange py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing & Building AI Profile...' : 'Save Vendor & Generate Storefront'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardVendorForm;
