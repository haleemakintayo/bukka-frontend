import React, { useState } from 'react';
import axios from 'axios';
import { Trash, Plus } from 'lucide-react';

const OnboardVendorForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerFullName: '',
    whatsappNumber: '',
    bankName: '',
    accountNumber: '',
  });

  // Dynamic Array for Menu Items
  const [menuItems, setMenuItems] = useState([{ name: '', price: '', category: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setSuccess(false);

    // Filter out completely empty items
    const validMenu = menuItems.filter(item => item.name || item.price);
    
    // Simulate API request structure
    const payload = {
      ...formData,
      menu: validMenu,
    };

    try {
      // Intentionally simulated backend delay since this is a static UI wireframe
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('API Payload ready for backend:', payload);
      setSuccess(true);
      
      // Reset
      setFormData({
        businessName: '',
        ownerFullName: '',
        whatsappNumber: '',
        bankName: '',
        accountNumber: '',
      });
      setMenuItems([{ name: '', price: '', category: '' }]);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-bukka-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-bukka-soft-white placeholder-gray-400 shadow-sm focus:border-bukka-cyan focus:ring-bukka-cyan focus:outline-none focus:ring-1 transition-colors';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-bukka-card-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-bukka-soft-white">60-Second Vendor Onboarding</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Capture vendor details and automatically allocate the interactive dynamic web menu.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center justify-between" role="alert">
          <span>Vendor onboarded successfully! Mock details printed to console.</span>
          <button onClick={() => setSuccess(false)} className="text-green-700 dark:text-green-400 hover:opacity-70 font-bold">dismiss</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column (Profile & Bank) */}
          <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white border-b border-gray-100 dark:border-gray-800 pb-3">Vendor Profile & Bank Structure</h3>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Iya Basira Amala"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="ownerFullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  name="ownerFullName"
                  id="ownerFullName"
                  value={formData.ownerFullName}
                  onChange={handleFormChange}
                  required
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  id="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleFormChange}
                  placeholder="08012345678"
                  required
                  className={inputClassName}
                />
              </div>
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

          {/* Right Column (Dynamic Menu Array) */}
          <div className="bg-white dark:bg-bukka-card-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-bukka-soft-white">Dynamic AI Menu Setup</h3>
              <span className="text-xs font-bold text-bukka-cyan bg-bukka-cyan/10 px-2 py-1 rounded-md">Field Array</span>
            </div>
            
            <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
              className="mt-6 w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-bukka-cyan hover:text-bukka-cyan dark:hover:border-bukka-cyan dark:hover:text-bukka-cyan transition-all flex justify-center items-center gap-2"
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
              {loading ? 'Processing & Building AI Profile...' : 'Save Vendor & Generate QR Code'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardVendorForm;
