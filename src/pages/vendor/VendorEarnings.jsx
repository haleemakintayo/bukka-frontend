import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet, TrendingUp, Calendar, ShoppingBag, Award, Clock, Loader2,
  RefreshCw, CheckCircle2, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const VendorEarnings = () => {
  const [days, setDays] = useState(7);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const data = await vendorService.getAnalytics(days);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to fetch vendor earnings.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [days]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto pb-24 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Earnings & Disbursals</h2>
          <p className="text-xs text-gray-500 mt-1">Track your store revenue, today's payout balance, and top-selling items.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time window selector */}
          <div className="flex items-center gap-1 bg-[#1e2333] border border-white/5 p-1 rounded-2xl">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  days === d
                    ? 'bg-[#FA6131] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchEarnings(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Calculating store earnings…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Hero Earnings Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FA6131] to-[#c73b18] rounded-3xl p-6 md:p-8 shadow-xl shadow-[#FA6131]/15 space-y-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet size={120} className="transform translate-x-4 -translate-y-4" />
            </div>

            <div className="relative z-10 space-y-2">
              <p className="text-white/70 font-semibold uppercase tracking-wider text-xs">Today's Disbursal Balance</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                {formatMoney(analytics?.pending_payout)}
              </h2>
              <p className="text-xs text-white/80">
                Sum of paid orders since midnight today (Lagos timezone). Automatically disbursed at 6:00 PM WAT.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Total Sales ({days} days)</p>
                <p className="text-xl font-extrabold text-white">{formatMoney(analytics?.total_revenue)}</p>
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Completed Orders</p>
                <p className="text-xl font-extrabold text-white">{analytics?.total_orders || 0} orders</p>
              </div>
            </div>
          </div>

          {/* Disbursal Schedule Notice */}
          <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-5 flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#2CD6EB] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">Same-Day Automated Disbursals</h4>
              <p className="text-gray-400 leading-relaxed">
                Earnings from completed orders are automatically credited directly to your registered NUBAN bank account daily at 6:00 PM WAT via Paystack Direct Transfers.
              </p>
            </div>
          </div>

          {/* Top Selling Items Ranking */}
          <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              <h3 className="text-lg font-extrabold text-white">Top Selling Menu Items</h3>
            </div>

            {analytics?.top_items && analytics.top_items.length > 0 ? (
              <div className="divide-y divide-white/5">
                {analytics.top_items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-bold text-gray-400">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">{item.menu_item_name}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-[#2CD6EB]">{item.quantity_sold} sold</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">No top items recorded for this timeframe yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorEarnings;
