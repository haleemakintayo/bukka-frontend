import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, CreditCard, Truck, Store, Clock, Eye, X,
  CheckCircle2, XCircle, RefreshCw, Loader2, AlertCircle, ShoppingBag, MapPin, Phone, Hash
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/api';

const OrderAuditTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [orderTypeFilter, setOrderTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxId, setSelectedTxId] = useState(null);

  const fetchTransactions = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const params = {};
      if (paymentStatusFilter !== 'ALL') params.payment_status = paymentStatusFilter;
      if (orderTypeFilter !== 'ALL') params.order_type = orderTypeFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await adminService.getTransactions(params);
      if (Array.isArray(data)) {
        setTransactions(data);
        setTotalCount(data.length);
      } else if (data && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        setTotalCount(data.total ?? data.transactions.length);
      } else {
        setTransactions([]);
        setTotalCount(0);
      }
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to fetch transactions.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [paymentStatusFilter, orderTypeFilter, searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const selectedTx = transactions.find((t) => (t.order_id || t.id) === selectedTxId);

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 flex items-center justify-center text-[#2CD6EB]">
              <CreditCard size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Order Audit & Transactions
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Real-time platform ledger to search, filter, and audit customer orders across all stores.
          </p>
        </div>

        <button
          onClick={() => fetchTransactions(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-all self-start"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh Ledger
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#1e2333] border border-white/5 rounded-3xl p-5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, or Paystack reference..."
            className="w-full bg-[#0f1118] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2CD6EB]/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Payment Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Payments' },
              { id: 'PAID', label: 'PAID' },
              { id: 'PENDING', label: 'PENDING' },
              { id: 'FAILED', label: 'FAILED' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPaymentStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  paymentStatusFilter === tab.id
                    ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/30 text-[#2CD6EB]'
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Order Type Tabs */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Types' },
              { id: 'delivery', label: '🚚 Delivery' },
              { id: 'pickup', label: '🏪 Pickup' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setOrderTypeFilter(type.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  orderTypeFilter === type.id
                    ? 'bg-[#FA6131]/10 border-[#FA6131]/30 text-[#FA6131]'
                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/5'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading transaction records…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchTransactions()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <ShoppingBag size={28} />
          </div>
          <p className="text-gray-400 font-bold text-base">No transactions found.</p>
          <p className="text-gray-600 text-xs max-w-sm mx-auto">
            {searchQuery || paymentStatusFilter !== 'ALL' || orderTypeFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter tabs.'
              : 'Customer orders will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs text-gray-500 font-semibold">
            <span>Showing {transactions.length} of {totalCount} records</span>
          </div>

          <div className="divide-y divide-white/5 bg-[#1e2333] border border-white/5 rounded-3xl overflow-hidden">
            {transactions.map((tx) => {
              const orderId = tx.order_id || tx.id;
              const isPaid = tx.payment_status === 'PAID';
              const isFailed = tx.payment_status === 'FAILED';

              return (
                <div
                  key={orderId}
                  onClick={() => setSelectedTxId(orderId)}
                  className="p-5 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isPaid
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : isFailed
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      <CreditCard size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#2CD6EB] font-bold">#{String(orderId).toUpperCase()}</span>
                        <span className="text-sm font-bold text-white group-hover:text-[#2CD6EB] transition-colors truncate">
                          {tx.vendor_name || tx.vendor_slug || 'Vendor Store'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          tx.order_type === 'delivery'
                            ? 'bg-[#FA6131]/10 text-[#FA6131] border-[#FA6131]/20'
                            : 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/20'
                        }`}>
                          {tx.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        Customer: <strong className="text-white">{tx.customer_name || 'Customer'}</strong>
                        {tx.customer_phone && <span className="text-gray-500 font-mono ml-2">({tx.customer_phone})</span>}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 font-mono">
                        <span>{fmtDate(tx.created_at)}</span>
                        {tx.payment_reference && (
                          <span className="truncate">Ref: {tx.payment_reference}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <span className="text-base md:text-lg font-extrabold text-white">
                      {formatMoney(tx.total_amount || tx.total_price)}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      isPaid
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : isFailed
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {tx.payment_status || 'PENDING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTxId(null)} />
          <div className="relative w-full max-w-lg bg-[#171B26] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 flex items-center justify-center text-[#2CD6EB]">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Transaction Details</h3>
                  <p className="text-xs font-mono text-[#2CD6EB]">#{String(selectedTxId).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTxId(null)} className="text-gray-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Store / Vendor</p>
                  <p className="text-base font-bold text-white">{selectedTx.vendor_name || selectedTx.vendor_slug || 'Vendor'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Status</p>
                  <span className="text-xs font-bold text-green-400">{selectedTx.payment_status || 'PENDING'}</span>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer Information</p>
                <p className="text-sm font-bold text-white">{selectedTx.customer_name || 'Customer'}</p>
                {selectedTx.customer_phone && (
                  <p className="text-xs text-[#2CD6EB] font-mono flex items-center gap-1">
                    <Phone size={12} /> {selectedTx.customer_phone}
                  </p>
                )}
                {selectedTx.delivery_address && (
                  <p className="text-xs text-gray-400 flex items-start gap-1 mt-1">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-[#FA6131]" />
                    {selectedTx.delivery_address}
                  </p>
                )}
              </div>

              {/* Items list */}
              {selectedTx.items && selectedTx.items.length > 0 && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Items Snapshot</p>
                  <div className="divide-y divide-white/5">
                    {selectedTx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 text-xs">
                        <span className="text-gray-300 font-medium">
                          <strong className="text-white mr-1.5">{item.quantity}×</strong>
                          {item.menu_item_name}
                        </span>
                        <span className="font-bold text-white">{formatMoney(item.line_total || item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Paystack Settlement Ref</p>
                <p className="text-xs font-mono text-gray-300 select-all">{selectedTx.payment_reference || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAuditTransactions;
