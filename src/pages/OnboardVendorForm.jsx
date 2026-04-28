import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash, Plus, CheckCircle, ExternalLink, QrCode, Smartphone } from 'lucide-react';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');      // Replace multiple - with single -
};

const OnboardVendorForm = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
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
      setFormData({ ...formData, [name]: slugify(value) }); // Sanitize on client
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

    // Filter out completely empty items
    const validMenu = menuItems.filter(item => item.name || item.price);
    
    const payload = {
      business_name: formData.business_name,
      owner_name: formData.owner_name,
      slug: formData.slug,
      bank_details: {
        bank_name: formData.bankName,
        account_number: formData.accountNumber
      },
      email: formData.email,
      password: formData.password,
      menu_items: validMenu,
    };

    try {
      const token = localStorage.getItem('admin_token');
      // If token is exactly 'mock_token_for_prototype', we mock the API response for prototype demonstration
      if (token === 'mock_token_for_prototype') {
          console.log("Mocking vendor onboarding for prototype...", payload);
          await new Promise(r => setTimeout(r, 1000));
          setSuccessData({
              vendor_id: "VEN-" + Math.floor(1000 + Math.random() * 9000),
              slug: payload.slug,
              qr_image_url: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://bukkaai.com.ng/order/" + payload.slug,
              pairing_code: Math.random().toString(36).substring(2, 10).toUpperCase()
          });
      } else {
          const response = await axios.post('/api/v1/admin/vendors/onboard', payload, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          setSuccessData(response.data);
      }
      
      // Keep form intact to allow for quick re-entry if needed, or clear it.
      // Usually better to clear it, but leaving it helps during rapid testing.
      setFormData({
        business_name: '',
        owner_name: '',
        slug: '',
        bankName: '',
        accountNumber: '',
        email: '',
        password: ''
      });
      setMenuItems([{ name: '', price: '', category: '' }]);
      setIsSlugEditedManually(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting form:', err);
      // Detailed error handling depending on backend validation structure
      if (err.response?.data?.detail) {
          const detail = err.response.data.detail;
          if (Array.isArray(detail)) {
              setError(detail.map(e => e.msg).join(', '));
          } else {
              setError(detail);
          }
      } else {
          setError('An unexpected error occurred while communicating with the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-bukka-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-bukka-soft-white placeholder-gray-400 shadow-sm focus:border-bukka-cyan focus:ring-bukka-cyan focus:outline-none focus:ring-1 transition-colors';

  if (successData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-bukka-card-surface p-10 rounded-2xl shadow-sm border border-green-200 dark:border-green-900/30 text-center transition-colors">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Vendor Onboarded Successfully</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The digital menu and interactive commerce system are now active.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-10">
                <div className="bg-gray-50 dark:bg-bukka-dark-surface p-6 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                    <QrCode size={48} className="text-gray-400 mb-4" />
                    <img src={successData.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bukkaai.com.ng/order/${successData.slug}`} alt="Store QR" className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Storefront QR</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Print this and place it on tables</p>
                    <a href={`/order/${successData.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-bukka-cyan hover:underline">
                        bukkaai.com.ng/order/{successData.slug} <ExternalLink size={14} />
                    </a>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Smartphone size={100} />
                    </div>
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                            Action Required
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-xl">Device Pairing Code</h3>
                        <div className="bg-white dark:bg-bukka-dark-surface font-mono text-3xl font-bold tracking-widest text-center py-4 rounded-lg shadow-inner mb-4 text-blue-600 dark:text-blue-400">
                            {successData.pairing_code}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            To start receiving orders, the vendor must message our central bot on WhatsApp (or Telegram) and send this exact code:<br/><br/>
                            <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 font-mono text-gray-900 dark:text-white font-bold select-all">/link {successData.pairing_code}</span>
                        </p>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-bukka-card-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">vendor onboarding</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create a new digital storefront and allocate an interactive web menu for a vendor.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
          <strong>Validation Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column (Profile, Auth & Bank) */}
          <div className="space-y-6">
              <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white border-b border-gray-100 dark:border-gray-800 pb-3">Business Profile & Auth</h3>
                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      id="business_name"
                      value={formData.business_name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Iya Basira Amala"
                      className={inputClassName}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Public Store Link (Slug)
                        </label>
                        {formData.slug && (
                            <span className="text-xs text-gray-400 flex items-center">
                                Preview: bukkaai.com.ng/order/<strong className="text-bukka-cyan ml-1">{formData.slug}</strong>
                            </span>
                        )}
                    </div>
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      value={formData.slug}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. iya-basira-amala"
                      className={inputClassName}
                    />
                    <p className="text-xs text-gray-500 mt-1">This link is public-facing. Backend will ensure final uniqueness.</p>
                  </div>

                  <div>
                    <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Owner Full Name
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={handleFormChange}
                      required
                      className={inputClassName}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Vendor Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Initial Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          required
                          className={inputClassName}
                        />
                      </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white border-b border-gray-100 dark:border-gray-800 pb-3">Financial Structure</h3>
                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bank Name
                        </label>
                        <select
                        name="bankName"
                        id="bankName"
                        value={formData.bankName}
                        onChange={handleFormChange}
                        required
                        className={inputClassName}
                        >
                        <option value="">Select a bank</option>
                        {nigerianBanks.map((bank) => (
                            <option key={bank} value={bank}>
                            {bank}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Account Number
                        </label>
                        <input
                        type="number"
                        name="accountNumber"
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleFormChange}
                        required
                        className={inputClassName}
                        />
                    </div>
                </div>
              </div>
          </div>

          {/* Right Column (Dynamic Menu Array) */}
          <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors flex flex-col h-[calc(100vh-250px)] lg:h-auto min-h-[500px]">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white">Dynamic AI Menu Setup</h3>
              <span className="text-xs font-bold text-bukka-cyan bg-bukka-cyan/10 px-2 py-1 rounded-md">Required</span>
            </div>
            
            <div className="mt-6 space-y-4 flex-1 overflow-y-auto pr-2 pb-4">
              {menuItems.map((item, index) => (
                <div
                  key={`menu-item-${index}`}
                  className="p-3 bg-gray-50 dark:bg-bukka-dark-surface border border-gray-100 dark:border-gray-800 rounded-xl relative group transition-colors flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Item #{index + 1}</span>
                     {menuItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMenuItem(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove menu item"
                        >
                          <Trash size={16} />
                        </button>
                     )}
                  </div>
                  
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleMenuChange(index, e)}
                    placeholder="Item Name (e.g. Jollof Rice)"
                    required
                    className={inputClassName}
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="category"
                      value={item.category}
                      onChange={(e) => handleMenuChange(index, e)}
                      placeholder="Category"
                      className={`flex-1 ${inputClassName}`}
                    />
                    <input
                      type="number"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleMenuChange(index, e)}
                      placeholder="Price (₦)"
                      required
                      className={`w-1/3 ${inputClassName}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMenuItem}
              className="mt-4 w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-bukka-cyan hover:text-bukka-cyan dark:hover:border-bukka-cyan dark:hover:text-bukka-cyan transition-all flex justify-center items-center gap-2 shrink-0"
            >
              <Plus size={16} /> Add Another Menu Item
            </button>
          </div>
        </div>

        <div className="sticky bottom-4 z-10 pt-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-bukka-card-surface/90 px-6 py-4 shadow-sm backdrop-blur transition-colors">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-bukka-orange py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing & Building AI Profile...' : 'Save Vendor & Generate Storefront'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardVendorForm;
