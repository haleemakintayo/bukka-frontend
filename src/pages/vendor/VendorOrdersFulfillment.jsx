import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2, ShoppingBag, Clock, CheckCircle2, XCircle, AlertTriangle,
  X, MapPin, Phone, RefreshCw, Ban, Search, Truck, Store, Flame, Volume2, VolumeX
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const VendorOrdersFulfillment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [statusTab, setStatusTab] = useState('ACTIVE'); // 'ACTIVE' | 'READY' | 'COMPLETED' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOrders = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const data = await vendorService.getOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to fetch kitchen order queue.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh interval (15s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 15_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders]);

  const handleMarkReady = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.markOrderReady(orderId);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Ready' } : o))
      );
      showToast('success', `Order #${String(orderId).toUpperCase()} marked as Ready! 🚀`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to mark order as ready.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.rejectOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Rejected' } : o))
      );
      setRejectingOrder(null);
      showToast('success', `Order #${String(orderId).toUpperCase()} rejected. Stock reversed. 🛑`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to reject order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const fmtTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const st = (o.status || '').toLowerCase();
    const idStr = String(o.order_id || o.id || '').toLowerCase();
    const custName = String(o.customer_name || '').toLowerCase();

    if (statusTab === 'ACTIVE') {
      if (['ready', 'completed', 'delivered', 'rejected', 'cancelled'].includes(st)) return false;
    } else if (statusTab === 'READY') {
      if (st !== 'ready') return false;
    } else if (statusTab === 'COMPLETED') {
      if (!['completed', 'delivered'].includes(st)) return false;
    } else if (statusTab === 'REJECTED') {
      if (!['rejected', 'cancelled'].includes(st)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return idStr.includes(q) || custName.includes(q);
    }

    return true;
  });

  const activeQueueCount = orders.filter(
    (o) => !['ready', 'completed', 'delivered', 'rejected', 'cancelled'].includes((o.status || '').toLowerCase())
  ).length;

  return (
    <div className="p-4 md:p-8 space-y-5 max-w-4xl mx-auto pb-24 relative">
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

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FA6131]/10 border border-[#FA6131]/20 flex items-center justify-center text-[#FA6131]">
            <Flame size={22} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Kitchen Cooking Queue
              {activeQueueCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FA6131] text-white text-xs font-bold animate-pulse">
                  {activeQueueCount} active
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500">Real-time fulfillment queue & instant order controls</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Indicator */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
              autoRefresh
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
            {autoRefresh ? 'Live Queue' : 'Paused'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all"
            title={soundEnabled ? 'Chime sound enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 size={16} className="text-[#2CD6EB]" /> : <VolumeX size={16} />}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter queue by order ID or customer name..."
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FA6131]/40 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Queue Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ACTIVE', label: `🔥 Cooking Queue (${activeQueueCount})` },
          { id: 'READY', label: '🚀 Ready for Pickup/Dispatch' },
          { id: 'COMPLETED', label: '✅ Completed' },
          { id: 'REJECTED', label: '🛑 Rejected' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              statusTab === tab.id
                ? 'bg-[#FA6131]/10 border-[#FA6131]/30 text-[#FA6131]'
                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading kitchen queue…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
          <ShoppingBag size={28} className="mx-auto text-gray-600" />
          <p className="text-gray-400 font-bold text-sm">No orders in this queue tab.</p>
          <p className="text-gray-600 text-xs">New incoming customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderId = order.order_id || order.id;
            const st = (order.status || '').toLowerCase();
            const isReadyActionable = ['paid', 'confirmed'].includes(st);
            const isRejectActionable = !['rejected', 'refunded', 'cancelled', 'completed', 'delivered'].includes(st);
            const isExecuting = actionLoadingId === orderId;

            return (
              <div
                key={orderId}
                className="bg-[#1e2333] border border-white/10 hover:border-white/20 rounded-3xl p-5 shadow-xl space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-[#2CD6EB]">#{String(orderId).toUpperCase()}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        order.order_type === 'delivery'
                          ? 'bg-[#FA6131]/10 text-[#FA6131] border-[#FA6131]/20'
                          : 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/20'
                      }`}>
                        {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1">{order.customer_name || 'Customer'}</h3>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-extrabold text-white">{formatMoney(order.total_amount || order.total_price)}</p>
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                      <Clock size={10} /> {fmtTime(order.created_at)}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ordered Items</p>
                  <div className="divide-y divide-white/5">
                    {order.items &&
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 text-sm">
                          <span className="text-white font-semibold">
                            <span className="w-6 h-6 inline-flex items-center justify-center rounded-lg bg-white/5 text-[#FA6131] font-extrabold mr-2 text-xs">
                              {item.quantity}×
                            </span>
                            {item.menu_item_name}
                          </span>
                          <span className="text-xs font-bold text-gray-400">
                            {formatMoney(item.line_total || item.unit_price * item.quantity)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Delivery details if any */}
                {order.order_type === 'delivery' && order.delivery_address && (
                  <div className="flex items-start gap-2.5 text-xs text-gray-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <MapPin size={14} className="text-[#FA6131] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{order.delivery_address}</p>
                      {(order.delivery_note || order.notes) && (
                        <p className="text-gray-500 italic mt-0.5">"{order.delivery_note || order.notes}"</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  {isReadyActionable && (
                    <button
                      onClick={() => handleMarkReady(orderId)}
                      disabled={isExecuting}
                      className="flex-1 py-3 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-2xl font-extrabold text-xs shadow-lg shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isExecuting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Mark Order as Ready 🚀
                        </>
                      )}
                    </button>
                  )}

                  {isRejectActionable && (
                    <button
                      onClick={() => setRejectingOrder(order)}
                      disabled={isExecuting}
                      className="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Ban size={15} /> Reject
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Confirm Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setRejectingOrder(null)} />
          <div className="relative w-full max-w-md bg-[#171B26] border border-red-500/20 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Ban size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-white">
                Reject Order #{String(rejectingOrder.order_id || rejectingOrder.id).toUpperCase()}?
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Are you sure you want to reject this order for <span className="text-white font-semibold">{rejectingOrder.customer_name || 'Customer'}</span>?
                Stock deductions will be reversed and the customer notified automatically.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRejectingOrder(null)}
                disabled={actionLoadingId === (rejectingOrder.order_id || rejectingOrder.id)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReject(rejectingOrder.order_id || rejectingOrder.id)}
                disabled={actionLoadingId === (rejectingOrder.order_id || rejectingOrder.id)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoadingId === (rejectingOrder.order_id || rejectingOrder.id) ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersFulfillment;
