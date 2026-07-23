import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet, DollarSign, AlertCircle, CheckCircle2, XCircle, RefreshCw,
  Loader2, ArrowUpRight, ShieldAlert, CreditCard, Building2, Send, X, HelpCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/api';

const MerchantFloatPayouts = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Manual Payout trigger modal state
  const [selectedVendorForPayout, setSelectedVendorForPayout] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [balRes, vendorList] = await Promise.allSettled([
        adminService.getPaystackBalance(),
        adminService.getVendors(),
      ]);

      if (balRes.status === 'fulfilled') {
        setBalanceData(balRes.value);
      }
      if (vendorList.status === 'fulfilled') {
        setVendors(Array.isArray(vendorList.value) ? vendorList.value : []);
      }

      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to fetch float balance or vendor accounts.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const handleTriggerPayout = async (vendorId) => {
    setPayoutLoading(true);
    try {
      const res = await adminService.triggerVendorPayout(vendorId);
      setSelectedVendorForPayout(null);
      showToast(
        'success',
        `Same-day payout initiated! Reference: ${res.reference || res.transfer_code || 'Success'} 🚀`
      );
      fetchData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to trigger manual payout.'));
    } finally {
      setPayoutLoading(false);
    }
  };

  const isBelowThreshold = balanceData?.is_below_threshold ?? false;

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl border animate-in slide-in-from-top-3 duration-200 ${
          toast.type === 'success'
            ? 'bg-[#171B26] border-green-500/30 text-green-400 shadow-green-500/10'
            : 'bg-[#171B26] border-red-500/30 text-red-400 shadow-red-500/10'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Merchant Float & Disbursals
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Monitor Paystack float liquidity and trigger manual same-day payouts to vendors.
          </p>
        </div>

        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-all self-start"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh Balance
        </button>
      </div>

      {/* Mandatory Paystack Setting Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 flex items-start gap-4">
        <ShieldAlert size={22} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-extrabold text-amber-300 text-sm">Mandatory Paystack Setting</h4>
          <p className="text-gray-300 leading-relaxed">
            To enable automated API transfers and instant disbursals, ensure OTP requirement is disabled in your Paystack Dashboard:
            <span className="font-mono text-white bg-black/40 px-2 py-0.5 rounded border border-white/10 ml-1">
              Settings → Transfers → Disable OTP requirement
            </span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Checking Paystack float liquidity…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Paystack Float Balance Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#171B26] to-[#1e2333] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Paystack Merchant NGN Float Balance
                </p>
                <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {formatMoney(balanceData?.ngn_balance_naira)}
                </h3>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isBelowThreshold
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isBelowThreshold ? 'bg-red-500 animate-pulse' : 'bg-green-400'}`} />
                  {isBelowThreshold ? 'Low Liquidity Warning' : 'Healthy Float Liquidity'}
                </span>
                <p className="text-[11px] text-gray-500">
                  Threshold: {formatMoney(balanceData?.min_float_threshold_naira || 50000)}
                </p>
              </div>
            </div>
          </div>

          {/* Vendors Disbursal Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-extrabold text-white">Vendor Disbursal Directory</h3>
              <span className="text-xs font-bold text-gray-500">{vendors.length} vendors registered</span>
            </div>

            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-[#1e2333] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-[#2CD6EB] mt-0.5">
                      <Building2 size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-white truncate">{vendor.business_name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          vendor.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-gray-500 border-white/10'
                        }`}>
                          {vendor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        Owner: <strong className="text-white">{vendor.owner_name}</strong>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 font-mono">
                        {vendor.account_number && (
                          <span>Acct: <strong className="text-gray-300">{vendor.account_number}</strong> ({vendor.bank_code || 'Bank'})</span>
                        )}
                        {vendor.subaccount_code && (
                          <span>Subacct: <strong className="text-gray-300">{vendor.subaccount_code}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <button
                      onClick={() => setSelectedVendorForPayout(vendor)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Send size={14} /> Trigger Manual Payout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Manual Payout Confirmation Modal */}
      {selectedVendorForPayout && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedVendorForPayout(null)} />
          <div className="relative w-full max-w-md bg-[#171B26] border border-emerald-500/20 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Send size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-white">Trigger Payout for {selectedVendorForPayout.business_name}?</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                This will calculate unpaid completed orders for this vendor and initiate a Paystack transfer directly to their bank account ({selectedVendorForPayout.account_number || 'NUBAN'}).
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedVendorForPayout(null)}
                disabled={payoutLoading}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTriggerPayout(selectedVendorForPayout.id)}
                disabled={payoutLoading}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {payoutLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantFloatPayouts;
