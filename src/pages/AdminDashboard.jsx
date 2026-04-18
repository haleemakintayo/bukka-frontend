import React from 'react';
import { Users, TrendingUp, ShoppingBag, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dummySalesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 5500 },
  { name: 'Wed', sales: 3000 },
  { name: 'Thu', sales: 8000 },
  { name: 'Fri', sales: 15000 },
  { name: 'Sat', sales: 22000 },
  { name: 'Sun', sales: 18000 },
];

const AdminDashboard = () => {
  const metrics = [
    {
      label: 'Active Vendors',
      value: '142',
      trend: '+12% this week',
      icon: Users,
      trendUp: true
    },
    {
      label: 'Gross Volume (Monthly)',
      value: '₦4.8M',
      trend: '+24% this week',
      icon: Wallet,
      trendUp: true
    },
    {
      label: 'Total Orders',
      value: '1,240',
      trend: '+18% this week',
      icon: ShoppingBag,
      trendUp: true
    },
    {
      label: 'Avg Order Value',
      value: '₦1,850',
      trend: '-2% this week',
      icon: TrendingUp,
      trendUp: false
    }
  ];

  // Custom tooltips to match dark theme cleanly
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bukka-dark-surface border border-gray-800 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1 font-semibold">{label}</p>
          <p className="text-bukka-cyan font-bold text-sm">
            ₦{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">overview</h2>
        <div className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-full px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
          Last 7 Days
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{metric.label}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-bukka-soft-white mt-2 tracking-tight">{metric.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-bukka-orange/10 flex items-center justify-center">
                <metric.icon size={20} className="text-bukka-orange" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-xs font-bold ${metric.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Area) */}
        <div className="lg:col-span-2 bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-bukka-soft-white mb-6">Revenue Trajectory</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2CD6EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2CD6EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2CD6EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="sales" stroke="#2CD6EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart (Bar) */}
        <div className="bg-white dark:bg-bukka-card-surface border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-bukka-soft-white mb-6">Peak Order Days</h3>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummySalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#FA6131" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
