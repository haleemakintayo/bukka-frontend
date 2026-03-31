import React from 'react';
import { Plus, Download } from 'lucide-react';

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
  <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-gray-900">Vendor Directory</h2>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-bukka-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
      >
        <Plus size={18} />
        + Add New Vendor
      </button>
    </div>

    <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Business Name</th>
              <th className="px-6 py-4">WhatsApp</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Sales</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="text-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900">{vendor.id}</td>
                <td className="px-6 py-4">{vendor.name}</td>
                <td className="px-6 py-4">{vendor.whatsapp}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      vendor.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{vendor.sales}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <Download size={14} />
                    Get QR
                  </button>
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
