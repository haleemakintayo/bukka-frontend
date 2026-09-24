import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import {
  Loader2, TrendingUp, ShoppingBag, Clock, LayoutList,
  Wallet, Package, Power, PauseCircle, CheckCircle2, XCircle, AlertTriangle,
  X, MapPin, Phone, CreditCard, FileText, ChevronRight, Eye, Truck, Store,
  Search, Ban, RefreshCw, Filter, Check, ChefHat
} from 'lucide-react';

import OrderDetailDrawer from '../../components/vendor/OrderDetailDrawer';
import AcceptOrderModal from '../../components/vendor/AcceptOrderModal';
import DispatchOrderModal from '../../components/vendor/DispatchOrderModal';
import RejectOrderModal from '../../components/vendor/RejectOrderModal';

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [dispatchingOrder, setDispatchingOrder] = useState(null);
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
        vendorService.getOrders({ limit: 20, payment_status: 'PAID' }),
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
  const handleConfirmAccept = async (orderId, data) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.acceptOrder(orderId, data);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Preparing' } : o))
      );
      setAcceptingOrder(null);
      showToast('success', `Order #${String(orderId).toUpperCase()} accepted! 👨‍🍳`);
      fetchData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to accept order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkReady = async (orderId, e) => {
    if (e) e.stopPropagation();
    setActionLoadingId(orderId);
    try {
      await vendorService.markOrderReady(orderId);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Ready' } : o))
      );
      showToast('success', `Order #${String(orderId).toUpperCase()} marked as Ready! 🚀`);
      fetchData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to mark order as ready.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDispatch = async (orderId, data) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.dispatchOrder(orderId, data);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Dispatched' } : o))
      );
      setDispatchingOrder(null);
      showToast('success', `Order #${String(orderId).toUpperCase()} dispatched! 🚚`);
      fetchData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to dispatch order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeliver = async (orderId, e) => {
    if (e) e.stopPropagation();
    setActionLoadingId(orderId);
    try {
      await vendorService.deliverOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Delivered' } : o))
      );
      showToast('success', `Order #${String(orderId).toUpperCase()} completed! 🎉`);
      fetchData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to complete order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async (orderId, data) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.rejectOrder(orderId, data);
      setOrders((prev) =>
        prev.map((o) => ((o.order_id || o.id) === orderId ? { ...o, status: 'Rejected' } : o))
      );
      setRejectingOrder(null);
      showToast('info', `Order #${String(orderId).toUpperCase()} rejected. 🛑`);
      fetchData(true);
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
    const idStr = String(o.order_number || o.order_id || o.id || '').toLowerCase();
    const custName = String(o.customer_name || '').toLowerCase();

    if (statusFilter !== 'REJECTED' && o.payment_status !== 'PAID') {
      return false;
    }

    // Status tab filter
    if (statusFilter === 'PENDING') {
      if (['ready', 'completed', 'delivered', 'rejected', 'cancelled', 'abandoned'].includes(st)) return false;
    } else if (statusFilter === 'READY') {
      if (st !== 'ready') return false;
    } else if (statusFilter === 'COMPLETED') {
      if (!['completed', 'delivered'].includes(st)) return false;
    } else if (statusFilter === 'REJECTED') {
      if (!['rejected', 'cancelled', 'abandoned'].includes(st)) return false;
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
              const isPaid = order.payment_status === 'PAID';
              const isPaidOrPending = isPaid && ['pending', 'paid', 'received', ''].includes(st);
              const isPreparing = isPaid && ['preparing', 'confirmed', 'cooking'].includes(st);
              const isReady = isPaid && st === 'ready';
              const isDelivery = (order.order_type || '').toLowerCase() === 'delivery';
              const isDispatched = isPaid && (st === 'dispatched' || st === 'out_for_delivery');
              const isRejectActionable = !['rejected', 'refunded', 'cancelled', 'completed', 'delivered', 'abandoned'].includes(st);
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
                      {isPaidOrPending && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAcceptingOrder(order);
                          }}
                          disabled={isActionExecuting}
                          className="px-3 py-1.5 bg-[#FA6131] hover:bg-[#e05327] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FA6131]/15 flex items-center gap-1 disabled:opacity-50"
                        >
                          <ChefHat size={13} />
                          Accept ({order.estimated_prep_minutes || 15}m)
                        </button>
                      )}

                      {isPreparing && (
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

                      {isReady && isDelivery && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDispatchingOrder(order);
                          }}
                          disabled={isActionExecuting}
                          className="px-3 py-1.5 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl text-xs font-bold transition-all shadow-md shadow-[#2CD6EB]/15 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Truck size={13} />
                          Dispatch
                        </button>
                      )}

                      {((isReady && !isDelivery) || isDispatched) && (
                        <button
                          onClick={(e) => handleDeliver(orderId, e)}
                          disabled={isActionExecuting}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/15 flex items-center gap-1 disabled:opacity-50"
                        >
                          {isActionExecuting ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 size={13} />
                              Complete
                            </>
                          )}
                        </button>
                      )}

                      {isRejectActionable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectingOrder(order);
                          }}
                          disabled={isActionExecuting}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <Ban size={13} />
                          Decline
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

      {/* ── Order Detail Drawer ───────────────── */}
      <OrderDetailDrawer
        orderId={selectedOrderId}
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
        onOpenAcceptModal={(o) => {
          setSelectedOrderId(null);
          setAcceptingOrder(o);
        }}
        onOpenDispatchModal={(o) => {
          setSelectedOrderId(null);
          setDispatchingOrder(o);
        }}
        onOpenRejectModal={(o) => {
          setSelectedOrderId(null);
          setRejectingOrder(o);
        }}
        onMarkReady={handleMarkReady}
        onDeliver={handleDeliver}
        isExecuting={actionLoadingId === selectedOrderId}
      />

      {/* ── Accept Order Modal ────────────────── */}
      <AcceptOrderModal
        order={acceptingOrder}
        isOpen={Boolean(acceptingOrder)}
        onClose={() => setAcceptingOrder(null)}
        onConfirm={handleConfirmAccept}
        isSubmitting={actionLoadingId === (acceptingOrder?.order_id || acceptingOrder?.id)}
      />

      {/* ── Dispatch Order Modal ──────────────── */}
      <DispatchOrderModal
        order={dispatchingOrder}
        isOpen={Boolean(dispatchingOrder)}
        onClose={() => setDispatchingOrder(null)}
        onConfirm={handleConfirmDispatch}
        isSubmitting={actionLoadingId === (dispatchingOrder?.order_id || dispatchingOrder?.id)}
      />

      {/* ── Reject / Cancel Modal ─────────────── */}
      <RejectOrderModal
        order={rejectingOrder}
        isOpen={Boolean(rejectingOrder)}
        onClose={() => setRejectingOrder(null)}
        onConfirm={handleConfirmReject}
        isSubmitting={actionLoadingId === (rejectingOrder?.order_id || rejectingOrder?.id)}
      />
    </div>
  );
};

export default VendorDashboard;
