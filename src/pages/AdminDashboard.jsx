import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, ShoppingBag, Wallet, UserPlus, ArrowRight, Loader2, RefreshCw, Percent } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { adminService } from '../services/adminService';
import { getApiErrorMessage } from '../services/api';

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
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load analytics.'));
      // Fallback to dummy data so dashboard isn't empty
      setAnalytics({
        platform_gmv: 0,
        platform_revenue: 0,
        total_vendors: 0,
        conversion_rate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatMoney = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
    return `₦${amount.toLocaleString()}`;
  };

  const metrics = [
    {
      label: 'Total Vendors',
      value: analytics?.total_vendors ?? '—',
      icon: Users,
      color: '#2CD6EB',
      bgColor: 'rgba(44, 214, 235, 0.08)',
      borderColor: 'rgba(44, 214, 235, 0.15)',
    },
    {
      label: 'Platform GMV',
      value: formatMoney(analytics?.platform_gmv),
      icon: Wallet,
      color: '#FA6131',
      bgColor: 'rgba(250, 97, 49, 0.08)',
      borderColor: 'rgba(250, 97, 49, 0.15)',
    },
    {
      label: 'Platform Revenue',
      value: formatMoney(analytics?.platform_revenue),
      icon: TrendingUp,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Conversion Rate',
      value: analytics?.conversion_rate != null ? `${(analytics.conversion_rate * 100).toFixed(1)}%` : '—',
      icon: Percent,
      color: '#a78bfa',
      bgColor: 'rgba(167, 139, 250, 0.08)',
      borderColor: 'rgba(167, 139, 250, 0.15)',
    }
  ];

  const quickActions = [
    {
      title: 'Onboard New Vendor',
      description: 'Add a new vendor with menu and payment setup',
      icon: UserPlus,
      path: '/admin/onboard',
      color: '#FA6131',
    },
    {
      title: 'Vendor Directory',
      description: 'View and manage all onboarded vendors',
      icon: Users,
      path: '/admin/vendors',
      color: '#2CD6EB',
    },
  ];

  // Custom tooltips to match dark theme cleanly
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e2333] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="text-gray-400 text-xs mb-1 font-semibold">{label}</p>
          <p className="text-[#2CD6EB] font-bold text-sm">
            ₦{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* ── Welcome Header ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {getGreeting()} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's your platform overview for today.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-all self-start"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Loading Skeleton ───────────────────────── */}
      {loading && !analytics && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
        </div>
      )}

      {/* ── Error Banner ───────────────────────────── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          <strong className="font-bold">Note: </strong>{error}
        </div>
      )}

      {/* ── Metrics Grid ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: metric.bgColor,
              border: `1px solid ${metric.borderColor}`,
            }}
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${metric.color}15` }}
              >
                <metric.icon size={18} style={{ color: metric.color }} />
              </div>
            </div>
            <h3 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
              {metric.value}
            </h3>
            <p className="text-[11px] md:text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ─────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="group flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all duration-300 text-left w-full"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ background: `${action.color}15` }}
              >
                <action.icon size={22} style={{ color: action.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">{action.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{action.description}</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts Section ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Chart (Area) */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6">Revenue Trajectory</h3>
          <div className="h-56 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2CD6EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2CD6EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2CD6EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="sales" stroke="#2CD6EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart (Bar) */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col">
          <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6">Peak Order Days</h3>
          <div className="flex-1 w-full h-full min-h-[200px] md:min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummySalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#FA6131" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
