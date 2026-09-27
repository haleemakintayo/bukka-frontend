import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet, TrendingUp, Calendar, ShoppingBag, Award, Clock, Loader2,
  RefreshCw, CheckCircle2, ShieldCheck, ArrowUpRight, Copy, Check, CreditCard
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const VendorEarnings = () => {
  const [days, setDays] = useState(7);
  const [analytics, setAnalytics] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [copiedRef, setCopiedRef] = useState(null);

  const fetchEarnings = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [analyticsData, settlementData] = await Promise.all([
        vendorService.getAnalytics(days),
        vendorService.getTodaySettlement(),
      ]);
      setAnalytics(analyticsData);
      setSettlement(settlementData);
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
    const interval = setInterval(() => fetchEarnings(true), 20_000);
    return () => clearInterval(interval);
  }, [fetchEarnings]);

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopyRef = (ref) => {
    if (!ref) return;
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const unsettledAmount = settlement?.unsettled_amount ?? analytics?.pending_payout ?? 0;
  const unsettledCount = settlement?.unsettled_orders_count ?? 0;
  const transactions = settlement?.transactions || [];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto pb-24 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Today's Settlement & Earnings
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Live tally of verified Paystack transactions waiting for end-of-day bank transfer.
          </p>
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
            title="Refresh live settlement"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Calculating live settlement…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Hero Today's Settlement Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FA6131] to-[#c73b18] rounded-3xl p-6 md:p-8 shadow-xl shadow-[#FA6131]/15 space-y-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet size={120} className="transform translate-x-4 -translate-y-4" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-white/80 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Today's Settlement (Awaiting EOD Bank Transfer)
                </p>
                <span className="text-[11px] font-bold bg-black/25 text-white px-3 py-1 rounded-full border border-white/15">
                  {unsettledCount} Verified {unsettledCount === 1 ? 'Transaction' : 'Transactions'}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                {formatMoney(unsettledAmount)}
              </h2>

              <p className="text-xs text-white/85">
                Live tally of verified Paystack transactions since midnight WAT waiting for your{' '}
                <strong>{settlement?.next_settlement_label || '06:00 PM WAT'}</strong> automated bank transfer.
                {settlement?.bank_account_summary && (
                  <span className="block mt-1 text-white/95 font-semibold">
                    🏦 Destination: {settlement.bank_account_summary}
                  </span>
                )}
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15">
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Verified Today
                </p>
                <p className="text-lg md:text-xl font-extrabold text-white">
                  {formatMoney(settlement?.today_verified_total ?? unsettledAmount)}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Total Sales ({days}d)
                </p>
                <p className="text-lg md:text-xl font-extrabold text-white">
                  {formatMoney(analytics?.total_revenue)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Paid Orders ({days}d)
                </p>
                <p className="text-lg md:text-xl font-extrabold text-white">
                  {analytics?.total_orders || 0} orders
                </p>
              </div>
            </div>
          </div>

          {/* Live Verified Paystack Transactions Ledger */}
          <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-[#2CD6EB]" />
                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-white">
                    Verified Paystack Transactions Today
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Every transaction below is verified by Paystack and queued for end-of-day settlement.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl self-start sm:self-auto">
                {transactions.length} Verified Today
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Wallet size={28} className="mx-auto text-gray-600" />
                <p className="text-sm font-bold text-gray-400">
                  No verified Paystack transactions recorded since midnight yet.
                </p>
                <p className="text-xs text-gray-500">
                  Paid customer orders appear here immediately upon Paystack verification.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map((tx) => {
                  const isSettled = tx.settlement_status === 'settled';
                  const isProcessing = tx.settlement_status === 'processing';
                  return (
                    <div
                      key={tx.order_id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-extrabold text-[#2CD6EB] text-sm">
                            #{tx.order_id}
                          </span>
                          {tx.order_number && (
                            <span className="font-mono text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                              {tx.order_number}
                            </span>
                          )}
                          <span className="font-bold text-white text-sm">
                            {tx.customer_name || 'Customer'}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1 text-[11px]">
                            <Clock size={11} /> {formatTime(tx.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-gray-400 bg-[#0f1118] border border-white/10 px-2.5 py-0.5 rounded-lg">
                            Ref: <strong className="text-gray-200">{tx.payment_reference || 'N/A'}</strong>
                          </span>
                          {tx.payment_reference && (
                            <button
                              type="button"
                              onClick={() => handleCopyRef(tx.payment_reference)}
                              className="text-[10px] font-bold text-[#2CD6EB] hover:underline flex items-center gap-1"
                            >
                              {copiedRef === tx.payment_reference ? (
                                <>
                                  <Check size={11} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>Copy Ref</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                        <span className="text-base font-extrabold text-white font-mono">
                          {formatMoney(tx.total_amount)}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                            isSettled
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : isProcessing
                              ? 'bg-[#2CD6EB]/15 text-[#2CD6EB] border-[#2CD6EB]/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {isSettled
                            ? '✓ Transferred'
                            : isProcessing
                            ? '⏳ Transferring'
                            : '⏳ Awaiting EOD Transfer'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Disbursal Schedule Notice */}
          <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-5 flex items-start gap-4">
            <ShieldCheck size={24} className="text-[#2CD6EB] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">Same-Day Automated Disbursals</h4>
              <p className="text-gray-400 leading-relaxed">
                Earnings from verified Paystack orders are automatically credited directly to your registered NUBAN bank account daily at 6:00 PM WAT via Paystack Direct Transfers.
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
