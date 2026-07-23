import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import {
  Loader2, TrendingUp, ShoppingBag, Clock, LayoutList,
  Wallet, Package, Power, PauseCircle, CheckCircle2, XCircle, AlertTriangle,
  X, MapPin, Phone, CreditCard, FileText, ChevronRight, Eye, Truck, Store,
  Search, Ban, RefreshCw, Filter, Check
} from 'lucide-react';

// ─────────────────────────────────────────────
// Store Status Widget
// ─────────────────────────────────────────────
const StoreStatusWidget = () => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pauseMinutes, setPauseMinutes] = useState(30);
  const [showPausePanel, setShowPausePanel] = useState(false);
  const [conflictOrders, setConflictOrders] = useState(null); // in-flight order IDs on 409
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const data = await vendorService.getAvailability();
      setAvailability(data);
    } catch {
      // silently fail – user sees stale state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    // Refresh countdown every 30s
    const id = setInterval(fetchStatus, 30_000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  const handleOpen = async () => {
    setActionLoading(true);
    setConflictOrders(null);
    try {
      const data = await vendorService.openStore();
      setAvailability(data);
      setShowPausePanel(false);
      showToast('success', 'Store is now open! 🟢');
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to open store.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async (force = false) => {
    setActionLoading(true);
    try {
      const data = await vendorService.closeStore(force);
      setAvailability(data);
      setConflictOrders(null);
      setShowPausePanel(false);
      showToast('success', 'Store closed.');
    } catch (err) {
      // 409 — in-flight orders exist
      if (err.response?.status === 409) {
        const detail = err.response.data?.detail;
        setConflictOrders(detail?.in_flight_order_ids || []);
      } else {
        showToast('error', getApiErrorMessage(err, 'Failed to close store.'));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    setActionLoading(true);
    try {
      const data = await vendorService.pauseStore(pauseMinutes);
      setAvailability(data);
      setShowPausePanel(false);
      showToast('success', `Store paused for ${pauseMinutes} minutes. ⏸️`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to pause store.'));
    } finally {
      setActionLoading(false);
    }
  };

  // ── Derived state ─────────────────────────
  const isOpen = availability?.is_open;
  const isPaused = isOpen && (availability?.pause_remaining_seconds ?? 0) > 0;
  const isClosed = !isOpen;

  const statusColor = isClosed
    ? 'text-red-400'
    : isPaused
    ? 'text-amber-400'
    : 'text-green-400';

  const statusBg = isClosed
    ? 'bg-red-500/10 border-red-500/20'
    : isPaused
    ? 'bg-amber-500/10 border-amber-500/20'
    : 'bg-green-500/10 border-green-500/20';

  const StatusIcon = isClosed ? XCircle : isPaused ? PauseCircle : CheckCircle2;

  if (loading) {
    return (
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center gap-3">
        <Loader2 size={18} className="animate-spin text-gray-500" />
        <span className="text-sm text-gray-500">Loading store status…</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border ${
          toast.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Status Card */}
      <div className={`flex items-center justify-between p-4 rounded-2xl border ${statusBg}`}>
        <div className="flex items-center gap-3">
          <StatusIcon size={22} className={statusColor} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Store Status</p>
            <p className={`text-sm font-extrabold mt-0.5 ${statusColor}`}>
              {availability?.status_label ?? '—'}
            </p>
          </div>
        </div>
        {/* Pulse dot */}
        <span className={`w-2.5 h-2.5 rounded-full ${
          isClosed ? 'bg-red-500' : isPaused ? 'bg-amber-400 animate-pulse' : 'bg-green-400 animate-pulse'
        }`} />
      </div>

      {/* In-flight conflict modal */}
      {conflictOrders && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={18} />
            <p className="text-sm font-bold">In-flight orders detected</p>
          </div>
          <p className="text-xs text-gray-400">
            Orders <span className="text-white font-semibold">#{conflictOrders.join(', #')}</span> are
            still active. Closing now will not cancel them, but customers won't be able to start
            new orders.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleClose(true)}
              disabled={actionLoading}
              className="flex-1 py-2 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors disabled:opacity-50"
            >
              {actionLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Force Close'}
            </button>
            <button
              onClick={() => setConflictOrders(null)}
              className="flex-1 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* Open */}
        <button
          onClick={handleOpen}
          disabled={actionLoading || (!isClosed && !isPaused)}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all
            ${!isClosed && !isPaused
              ? 'bg-green-500/10 border-green-500/30 text-green-400 ring-1 ring-green-500/40 cursor-default'
              : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400'}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {actionLoading && !isClosed && !isPaused
            ? <Loader2 size={16} className="animate-spin" />
            : <Power size={16} />}
          Open
        </button>

        {/* Pause */}
        <button
          onClick={() => { setShowPausePanel(!showPausePanel); setConflictOrders(null); }}
          disabled={actionLoading || isClosed}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all
            ${isPaused
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 ring-1 ring-amber-500/40'
              : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400'}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <PauseCircle size={16} />
          Pause
        </button>

        {/* Close */}
        <button
          onClick={() => { handleClose(false); setConflictOrders(null); }}
          disabled={actionLoading || isClosed}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all
            ${isClosed
              ? 'bg-red-500/10 border-red-500/30 text-red-400 ring-1 ring-red-500/40 cursor-default'
              : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400'}
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {actionLoading && isClosed
            ? <Loader2 size={16} className="animate-spin" />
            : <XCircle size={16} />}
          Close
        </button>
      </div>

      {/* Pause Duration Panel */}
      {showPausePanel && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pause duration</p>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((m) => (
              <button
                key={m}
                onClick={() => setPauseMinutes(m)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  pauseMinutes === m
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-white/[0.03] border-white/5 text-gray-500 hover:border-white/10'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
          {/* Custom input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5}
              max={480}
              value={pauseMinutes}
              onChange={(e) => setPauseMinutes(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-amber-500/40"
              placeholder="Custom minutes"
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">min</span>
          </div>
          <button
            onClick={handlePause}
            disabled={actionLoading || pauseMinutes < 5 || pauseMinutes > 480}
            className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {actionLoading
              ? <Loader2 size={15} className="animate-spin" />
              : <PauseCircle size={15} />}
            Pause for {pauseMinutes}m
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Rejection Confirmation Modal
// ─────────────────────────────────────────────
const RejectionConfirmModal = ({ order, onClose, onConfirm, loading }) => {
  if (!order) return null;
  const orderId = order.order_id || order.id;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#171B26] border border-red-500/20 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <Ban size={24} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-white">Reject Order #{String(orderId).toUpperCase()}?</h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Are you sure you want to reject this order for <span className="text-white font-semibold">{order.customer_name || 'Customer'}</span>?
            This will reverse stock deductions and automatically notify the customer.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(orderId)}
            disabled={loading}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Order Detail Modal
// ─────────────────────────────────────────────
const OrderDetailModal = ({
  orderId,
  onClose,
  formatMoney,
  fmtTime,
  onMarkReady,
  onOpenRejectModal,
  actionLoadingId,
}) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await vendorService.getOrderDetail(orderId);
      setOrder(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load order details.'));
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (!orderId) return null;

  const fmtDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-NG', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'confirmed' || s === 'delivered' || s === 'completed') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (s === 'ready') return 'text-[#2CD6EB] bg-[#2CD6EB]/10 border-[#2CD6EB]/20';
    if (s === 'rejected' || s === 'cancelled' || s === 'failed') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  const getPaymentColor = (status) => {
    if (status === 'PAID') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (status === 'FAILED') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  const currentStatus = (order?.status || '').toLowerCase();
  const isReadyActionable = ['paid', 'confirmed'].includes(currentStatus);
  const isRejectActionable = !['rejected', 'refunded', 'cancelled', 'completed', 'delivered'].includes(currentStatus);
  const isActionExecuting = actionLoadingId === orderId;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-[#171B26] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2CD6EB]/10 flex items-center justify-center">
              <Eye size={16} className="text-[#2CD6EB]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Order Details</h3>
              <p className="text-[10px] font-bold text-[#2CD6EB] tracking-wider">#{String(orderId).toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={28} className="animate-spin text-[#FA6131]" />
              <p className="text-sm text-gray-500 font-medium">Loading order details…</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5 text-center">
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : order ? (
            <>
              {/* ── Customer & Status ────────── */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Customer</p>
                  <h4 className="text-lg font-extrabold text-white">{order.customer_name || 'Customer'}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <Clock size={11} />
                    <span>{fmtDate(order.created_at)} • {fmtTime(order.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                    {order.status || 'Received'}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${getPaymentColor(order.payment_status)}`}>
                    {order.payment_status || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* ── Order Type Badge ────────── */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold ${
                  order.order_type === 'delivery'
                    ? 'bg-[#FA6131]/10 border-[#FA6131]/20 text-[#FA6131]'
                    : 'bg-[#2CD6EB]/10 border-[#2CD6EB]/20 text-[#2CD6EB]'
                }`}>
                  {order.order_type === 'delivery' ? <Truck size={14} /> : <Store size={14} />}
                  {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
                </div>
              </div>

              {/* ── Items Breakdown ────────── */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Items Ordered</p>
                </div>
                <div className="divide-y divide-white/5">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                          {item.quantity}×
                        </span>
                        <span className="text-sm text-white font-medium truncate">{item.menu_item_name}</span>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-bold text-white">{formatMoney(item.line_total || (item.quantity * item.unit_price))}</p>
                        <p className="text-[10px] text-gray-600">@ {formatMoney(item.unit_price)} ea.</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-t border-white/5">
                  <span className="text-sm font-bold text-gray-400">Total</span>
                  <span className="text-lg font-extrabold text-white">{formatMoney(order.total_amount)}</span>
                </div>
              </div>

              {/* ── Delivery Info ────────── */}
              {order.order_type === 'delivery' && order.delivery_address && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Delivery Details</p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FA6131]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={14} className="text-[#FA6131]" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{order.delivery_address}</p>
                      {(order.delivery_note || order.notes) && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          "{order.delivery_note || order.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Customer Contact ────────── */}
              {order.customer_phone && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Customer Phone</p>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="text-sm text-[#2CD6EB] font-bold hover:underline"
                      >
                        {order.customer_phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Payment Reference ────────── */}
              {order.payment_reference && (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <CreditCard size={14} className="text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Payment Reference</p>
                      <p className="text-xs text-gray-300 font-mono truncate">{order.payment_reference}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Vendor Action Controls ────────── */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Order Actions</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {isReadyActionable && (
                    <button
                      onClick={async () => {
                        await onMarkReady(orderId);
                        fetchDetail();
                      }}
                      disabled={isActionExecuting}
                      className="flex-1 py-3 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl font-bold text-xs shadow-lg shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isActionExecuting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Mark Order as Ready
                        </>
                      )}
                    </button>
                  )}

                  {isRejectActionable && (
                    <button
                      onClick={() => onOpenRejectModal(order)}
                      disabled={isActionExecuting}
                      className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Ban size={16} />
                      Reject Order
                    </button>
                  )}

                  {!isReadyActionable && !isRejectActionable && (
                    <div className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-gray-400 font-medium">
                      Order status is <span className="text-white font-bold">{order.status}</span>. No further actions required.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
const VendorDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [dashData, ordersData] = await Promise.all([
        vendorService.getDashboard(),
        vendorService.getOrders(),
      ]);
      setDashboard(dashData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to load dashboard data.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval (15s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 15_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // ── Action Handlers ───────────────────────
  const handleMarkReady = async (orderId, e) => {
    if (e) e.stopPropagation();
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

  const handleInitiateReject = (order, e) => {
    if (e) e.stopPropagation();
    setRejectingOrder(order);
  };

  const handleConfirmReject = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.rejectOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Rejected' } : o))
      );
      setRejectingOrder(null);
      showToast('success', `Order #${String(orderId).toUpperCase()} rejected. 🛑`);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to reject order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const fmtTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filtered orders logic
  const filteredOrders = orders.filter((o) => {
    const st = (o.status || '').toLowerCase();
    const idStr = String(o.order_id || o.id || '').toLowerCase();
    const custName = String(o.customer_name || '').toLowerCase();

    // Status tab filter
    if (statusFilter === 'PENDING') {
      if (['ready', 'completed', 'delivered', 'rejected', 'cancelled'].includes(st)) return false;
    } else if (statusFilter === 'READY') {
      if (st !== 'ready') return false;
    } else if (statusFilter === 'COMPLETED') {
      if (!['completed', 'delivered'].includes(st)) return false;
    } else if (statusFilter === 'REJECTED') {
      if (!['rejected', 'cancelled'].includes(st)) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return idStr.includes(q) || custName.includes(q);
    }

    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-4xl mx-auto pb-24 relative">
      {/* Toast Notification */}
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

      {/* ── Greeting ─────────────────────────── */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          {getGreeting()} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">Here's your store overview for today.</p>
      </div>

      {/* ── Hero Payout Card ─────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FA6131] to-[#d44520] rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-xl shadow-[#FA6131]/15">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Wallet size={90} className="transform translate-x-3 -translate-y-3" />
        </div>
        <div className="relative z-10">
          <p className="text-white/70 font-semibold uppercase tracking-wider text-[10px] md:text-xs mb-1.5">
            Today's Payout
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
            {formatMoney(dashboard?.pending_payout)}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <ShoppingBag size={13} className="text-white" />
              <span className="text-xs font-bold text-white">{dashboard?.orders_count || 0} Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Store Status ──────────────────────── */}
      <div>
        <h3 className="text-base font-bold text-white mb-3 px-1">Store Availability</h3>
        <StoreStatusWidget />
      </div>

      {/* ── Quick Actions ────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/vendor/menu')}
          className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FA6131]/20 hover:bg-[#FA6131]/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FA6131]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <LayoutList size={20} className="text-[#FA6131]" />
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Manage Menu</span>
        </button>
        <button
          onClick={() => navigate('/vendor/menu')}
          className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#2CD6EB]/20 hover:bg-[#2CD6EB]/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2CD6EB]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package size={20} className="text-[#2CD6EB]" />
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Add Item</span>
        </button>
      </div>

      {/* ── Orders Management Section ──────────────────────── */}
      <div className="space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-bold text-white">Orders Management</h3>
            {refreshing && <Loader2 size={16} className="animate-spin text-[#2CD6EB]" />}
          </div>
          <div className="flex items-center gap-2">
            {/* Live Indicator Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                autoRefresh
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-white/5 border-white/10 text-gray-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              {autoRefresh ? 'Live' : 'Paused'}
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50"
              title="Refresh Orders"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or order ID..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2CD6EB]/40 transition-colors"
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PENDING', label: 'Pending / Paid' },
            { id: 'READY', label: 'Ready' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                statusFilter === tab.id
                  ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/30 text-[#2CD6EB]'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium text-sm">No orders found.</p>
            <p className="text-gray-600 text-xs">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filter tab.'
                : 'Orders will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const orderId = order.order_id || order.id;
              const st = (order.status || '').toLowerCase();
              const isReadyActionable = ['paid', 'confirmed'].includes(st);
              const isRejectActionable = !['rejected', 'refunded', 'cancelled', 'completed', 'delivered'].includes(st);
              const isActionExecuting = actionLoadingId === orderId;

              return (
                <div
                  key={orderId}
                  onClick={() => setSelectedOrderId(orderId)}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all cursor-pointer active:scale-[0.99] group/card space-y-3"
                >
                  {/* Order header */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#2CD6EB] tracking-wider mb-0.5">
                        #{String(orderId).toUpperCase()}
                      </p>
                      <h4 className="text-white font-bold text-sm">{order.customer_name || 'Customer'}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-base md:text-lg font-extrabold text-white">
                          {formatMoney(order.total_amount || order.total_price)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                          <Clock size={10} />
                          {fmtTime(order.created_at)}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-600 group-hover/card:text-gray-400 transition-colors shrink-0 ml-1" />
                    </div>
                  </div>

                  {/* Order items summary */}
                  {order.items && order.items.length > 0 && (
                    <div className="text-xs text-gray-400 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            <span className="text-gray-500 font-bold mr-1.5">{item.quantity}×</span>
                            {item.menu_item_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Badges & Quick Action Buttons */}
                  <div className="flex flex-wrap justify-between items-center pt-2 border-t border-white/5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        order.payment_status === 'PAID'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {order.payment_status || 'PENDING'}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        st === 'ready'
                          ? 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/20'
                          : st === 'rejected' || st === 'cancelled'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {order.status || 'Received'}
                      </span>
                    </div>

                    {/* Inline Actions */}
                    <div className="flex items-center gap-2">
                      {isReadyActionable && (
                        <button
                          onClick={(e) => handleMarkReady(orderId, e)}
                          disabled={isActionExecuting}
                          className="px-3 py-1.5 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl text-xs font-bold transition-all shadow-md shadow-[#2CD6EB]/15 flex items-center gap-1 disabled:opacity-50"
                        >
                          {isActionExecuting ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 size={13} />
                              Mark Ready
                            </>
                          )}
                        </button>
                      )}

                      {isRejectActionable && (
                        <button
                          onClick={(e) => handleInitiateReject(order, e)}
                          disabled={isActionExecuting}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <Ban size={13} />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ────────────────── */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          formatMoney={formatMoney}
          fmtTime={fmtTime}
          onMarkReady={handleMarkReady}
          onOpenRejectModal={setRejectingOrder}
          actionLoadingId={actionLoadingId}
        />
      )}

      {/* ── Rejection Confirm Modal ───────────── */}
      {rejectingOrder && (
        <RejectionConfirmModal
          order={rejectingOrder}
          onClose={() => setRejectingOrder(null)}
          onConfirm={handleConfirmReject}
          loading={actionLoadingId === (rejectingOrder.order_id || rejectingOrder.id)}
        />
      )}
    </div>
  );
};

export default VendorDashboard;
