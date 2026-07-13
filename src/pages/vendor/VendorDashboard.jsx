import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import {
  Loader2, TrendingUp, ShoppingBag, Clock, LayoutList,
  Wallet, Package, Power, PauseCircle, CheckCircle2, XCircle, AlertTriangle,
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
// Main Dashboard
// ─────────────────────────────────────────────
const VendorDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, ordersData] = await Promise.all([
          vendorService.getDashboard(),
          vendorService.getOrders(),
        ]);
        setDashboard(dashData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load dashboard data.'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            onClick={() => window.location.reload()}
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

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-4xl mx-auto pb-24">
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

      {/* ── Orders List ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-base md:text-lg font-bold text-white">Today's Orders</h3>
          {orders.length > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
              {orders.length} total
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No orders yet today.</p>
            <p className="text-gray-600 text-xs mt-1">They'll appear here in real time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id || order.order_id}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
              >
                {/* Order header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#2CD6EB] tracking-wider mb-0.5">
                      #{String(order.order_id || order.id || '').toUpperCase()}
                    </p>
                    <h4 className="text-white font-bold text-sm">{order.customer_name || 'Customer'}</h4>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-base md:text-lg font-extrabold text-white">
                      {formatMoney(order.total_amount || order.total_price)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600 mt-0.5">
                      <Clock size={10} />
                      {fmtTime(order.created_at)}
                    </div>
                  </div>
                </div>

                {/* Order items */}
                {order.items && order.items.length > 0 && (
                  <div className="text-sm text-gray-400 mb-3 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          <span className="text-gray-600 font-bold mr-1.5">{item.quantity}×</span>
                          {item.menu_item_name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status badges */}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    order.payment_status === 'PAID'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {order.payment_status || 'PENDING'}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#2CD6EB]/10 text-[#2CD6EB] border border-[#2CD6EB]/20 uppercase tracking-wider">
                    {order.status || 'Received'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
