import React, { useState } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';

const OnboardVendorForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerFullName: '',
    whatsappNumber: '',
    bankName: '',
    accountNumber: '',
  });
  const [menuItems, setMenuItems] = useState([{ name: '', price: '' }]);
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
    setMenuItems([...menuItems, { name: '', price: '' }]);
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

    const payload = {
      ...formData,
      menu: menuItems,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/vendors/onboard', payload);
      console.log('Success:', response.data);
      setSuccess(true);
      // Reset form
      setFormData({
        businessName: '',
        ownerFullName: '',
        whatsappNumber: '',
        bankName: '',
        accountNumber: '',
      });
      setMenuItems([{ name: '', price: '' }]);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response ? err.response.data.detail || 'An unexpected error occurred.' : 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-bukka-green focus:ring-bukka-green';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">60-Second Vendor Onboarding</h2>
        <p className="mt-2 text-sm text-gray-600">
          Capture vendor details and build a starter menu in one flow.
        </p>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          Vendor onboarded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Vendor Profile & Bank</h3>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleFormChange}
                  required
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="ownerFullName" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  type="text"
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
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
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

          {/* Right Column */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Digital Menu Setup</h3>
            <div className="mt-6 space-y-3">
              {menuItems.map((item, index) => (
                <div
                  key={`menu-item-${index}`}
                  className="flex flex-col md:flex-row md:items-center gap-3"
                >
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleMenuChange(index, e)}
                    placeholder="Item Name"
                    required
                    className={inputClassName}
                  />
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleMenuChange(index, e)}
                    placeholder="Price"
                    required
                    className={`md:w-40 ${inputClassName}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="inline-flex items-center justify-center rounded-md border border-red-100 bg-red-50 p-2 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all"
                    aria-label="Remove menu item"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMenuItem}
              className="mt-4 w-full rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-bukka-green hover:text-bukka-green transition-all"
            >
              + Add Menu Item
            </button>
          </div>
        </div>

        <div className="sticky bottom-4 z-10">
          <div className="rounded-2xl border border-gray-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-bukka-green py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? 'Creating Vendor...' : 'Create Vendor & Generate QR'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardVendorForm;
