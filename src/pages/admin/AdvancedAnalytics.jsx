import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Wallet, Percent, Users, Calendar, Loader2, RefreshCw,
  ShoppingBag, ArrowUpRight, Award, Truck, Store, BarChart2, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/api';

const COLORS = ['#2CD6EB', '#FA6131', '#10b981', '#a78bfa', '#f59e0b'];

const AdvancedAnalytics = () => {
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const data = await adminService.getDetailedAnalytics(days);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to load detailed analytics.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatMoney = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e2333] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl space-y-1">
          <p className="text-gray-400 text-xs font-semibold">{label}</p>
          <p className="text-[#2CD6EB] font-bold text-sm">
            GMV: {formatMoney(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-gray-300 text-xs">
              Orders: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const metrics = [
    {
      label: 'Platform GMV',
      value: formatMoney(analytics?.platform_gmv),
      subtext: `Past ${days} days`,
      icon: Wallet,
      color: '#FA6131',
      bgColor: 'rgba(250, 97, 49, 0.08)',
      borderColor: 'rgba(250, 97, 49, 0.15)',
    },
    {
      label: 'Platform Revenue',
      value: formatMoney(analytics?.platform_revenue),
      subtext: '₦50 fee per paid order',
      icon: TrendingUp,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Avg Order Value (AOV)',
      value: formatMoney(analytics?.average_order_value),
      subtext: 'Per successful basket',
      icon: ShoppingBag,
      color: '#2CD6EB',
      bgColor: 'rgba(44, 214, 235, 0.08)',
      borderColor: 'rgba(44, 214, 235, 0.15)',
    },
    {
      label: 'Conversion Rate',
      value: analytics?.conversion_rate != null ? `${(analytics.conversion_rate * 100).toFixed(1)}%` : '—',
      subtext: 'Paid / Total Checkout Initiated',
      icon: Percent,
      color: '#a78bfa',
      bgColor: 'rgba(167, 139, 250, 0.08)',
      borderColor: 'rgba(167, 139, 250, 0.15)',
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#FA6131]/10 border border-[#FA6131]/20 flex items-center justify-center text-[#FA6131]">
              <BarChart2 size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Advanced Platform Analytics
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Real-time financial performance, GMV trajectories, conversion rates, and vendor leaderboards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Window Buttons */}
          <div className="flex items-center gap-1 bg-[#1e2333] border border-white/5 p-1 rounded-2xl">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  days === d
                    ? 'bg-[#FA6131] text-white shadow-md shadow-[#FA6131]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Analytics"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Calculating platform analytics…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* ── Key Metrics Grid ──────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                style={{ background: m.bgColor, border: `1px solid ${m.borderColor}` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: `${m.color}15` }}
                  >
                    <m.icon size={20} style={{ color: m.color }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {m.value}
                  </h3>
                  <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{m.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sales & GMV Timeline Chart ───────────── */}
          <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">GMV Trajectory</h3>
                <p className="text-xs text-gray-500">Daily gross merchandise volume over past {days} days</p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              {analytics?.sales_timeline && analytics.sales_timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.sales_timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2CD6EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2CD6EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(val) => `₦${val / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2CD6EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="gmv" stroke="#2CD6EB" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
                  No sales timeline data available for this window.
                </div>
              )}
            </div>
          </div>

          {/* ── Top Vendors & Order Type Distribution ───── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Top Vendors Leaderboard */}
            <div className="lg:col-span-2 bg-[#1e2333] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-[#FA6131]" />
                  <h3 className="text-lg font-extrabold text-white">Top Performing Vendors</h3>
                </div>
                <span className="text-xs text-gray-500 font-semibold">Ranked by GMV</span>
              </div>

              {analytics?.top_vendors && analytics.top_vendors.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {analytics.top_vendors.map((vendor, idx) => (
                    <div key={vendor.vendor_id || idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : idx === 1
                            ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30'
                            : 'bg-white/5 text-gray-500 border border-white/5'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-white truncate">{vendor.business_name}</h4>
                          <p className="text-xs text-gray-500">{vendor.paid_orders_count || 0} paid orders</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-[#2CD6EB]">{formatMoney(vendor.total_gmv)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-6 text-center">No vendor rankings recorded yet.</p>
              )}
            </div>

            {/* Order Type Split (Delivery vs Pickup) */}
            <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white mb-1">Fulfillment Split</h3>
                <p className="text-xs text-gray-500">Pickup vs Delivery breakdown</p>
              </div>

              <div className="space-y-4">
                {/* Delivery */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#FA6131] flex items-center gap-1.5">
                      <Truck size={14} /> Delivery
                    </span>
                    <span className="text-white">{analytics?.delivery_orders_count || 0} orders</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FA6131] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (analytics?.delivery_orders_count /
                            ((analytics?.delivery_orders_count || 0) + (analytics?.pickup_orders_count || 1))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Pickup */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#2CD6EB] flex items-center gap-1.5">
                      <Store size={14} /> Pickup
                    </span>
                    <span className="text-white">{analytics?.pickup_orders_count || 0} orders</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2CD6EB] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (analytics?.pickup_orders_count /
                            ((analytics?.delivery_orders_count || 0) + (analytics?.pickup_orders_count || 1))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Total Orders (Paid)</span>
                  <strong className="text-white">{analytics?.total_paid_orders || 0}</strong>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Pending Confirmation</span>
                  <strong className="text-amber-400">{analytics?.total_pending_orders || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
