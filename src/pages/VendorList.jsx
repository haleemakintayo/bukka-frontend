import React from 'react';
import { Plus, Download, MoreHorizontal } from 'lucide-react';

const vendors = [
  {
    id: 'VEN-1001',
    name: 'Iya Basira Canteen',
    whatsapp: '08012345678',
    status: 'Active',
    sales: '₦145,000',
  },
  {
    id: 'VEN-1002',
    name: 'White House Bukka',
    whatsapp: '08198765432',
    status: 'Active',
    sales: '₦89,500',
  },
  {
    id: 'VEN-1003',
    name: 'Amala Phase 2',
    whatsapp: '09011223344',
    status: 'Inactive',
    sales: '₦0',
  },
];

const VendorList = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-wrap items-center justify-between gap-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">vendor directory</h2>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 bg-bukka-orange text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg rounded-full font-bold px-6 py-3"
      >
        <Plus size={18} />
        Add New Vendor
      </button>
    </div>

    <div className="bg-white dark:bg-bukka-card-surface shadow-sm border border-gray-100 dark:border-gray-800 rounded-3xl p-6 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Business Name</th>
              <th className="px-6 py-4">WhatsApp</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Sales</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-bukka-dark-surface/50 transition-colors group">
                <td className="px-6 py-6 font-medium text-gray-900 dark:text-bukka-soft-white">{vendor.id}</td>
                <td className="px-6 py-6 font-bold">{vendor.name}</td>
                <td className="px-6 py-6 font-mono text-xs">{vendor.whatsapp}</td>
                <td className="px-6 py-6">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      vendor.status === 'Active'
                        ? 'bg-bukka-cyan/10 text-bukka-cyan'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-6 font-bold text-gray-900 dark:text-bukka-soft-white">{vendor.sales}</td>
                <td className="px-6 py-6 border-b-transparent">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm"
                    >
                      <Download size={14} />
                      Get QR
                    </button>
                    <button className="text-gray-400 hover:text-bukka-cyan transition-colors" aria-label="More options">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default VendorList;
