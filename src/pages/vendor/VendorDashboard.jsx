import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import {
  Loader2, TrendingUp, ShoppingBag, Clock, LayoutList,
  Wallet, Package, Power, PauseCircle, CheckCircle2, XCircle, AlertTriangle,
  X, MapPin, Phone, CreditCard, FileText, ChevronRight, Eye, Truck, Store,
  Search, Ban, RefreshCw, Filter, Check, ChefHat, ShieldCheck, Copy,
  Settings, Bell, Archive, Flame
} from 'lucide-react';

import OrderDetailDrawer from '../../components/vendor/OrderDetailDrawer';
import AcceptOrderModal from '../../components/vendor/AcceptOrderModal';
import DispatchOrderModal from '../../components/vendor/DispatchOrderModal';
import RejectOrderModal from '../../components/vendor/RejectOrderModal';
import StoreStatusWidget from '../../components/vendor/StoreStatusWidget';


// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
const VendorDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [showSettlementLedger, setShowSettlementLedger] = useState(false);
  const [copiedRef, setCopiedRef] = useState(null);
  const [availabilityRefreshKey, setAvailabilityRefreshKey] = useState(0);
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

  const handleCopyRef = (ref, e) => {
    if (e) e.stopPropagation();
    if (!ref) return;
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [dashData, ordersData, settlementData] = await Promise.all([
        vendorService.getDashboard(),
        vendorService.getOrders({ limit: 30, payment_status: 'PAID' }),
        vendorService.getTodaySettlement().catch(() => null),
      ]);
      setDashboard(dashData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      if (settlementData) setSettlement(settlementData);
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
    const numericIdStr = String(o.order_id || o.id || '').toLowerCase();
    const orderNumStr = String(o.order_number || '').toLowerCase();
    const custName = String(o.customer_name || '').toLowerCase();
    const custPhone = String(o.customer_phone || '').toLowerCase();
    const payRef = String(o.payment_reference || '').toLowerCase();

    if (statusFilter !== 'REJECTED' && (o.payment_status || '').toUpperCase() !== 'PAID') {
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

    // Search query (supports numeric ID e.g. 1082 or #1082, order_number, phone, name, payment ref)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim().replace(/^#/, '');
      return (
        numericIdStr.includes(q) ||
        orderNumStr.includes(q) ||
        custName.includes(q) ||
        custPhone.includes(q) ||
        payRef.includes(q)
      );
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

      {/* ── Today's Settlement (Live Bachs Tally) ─────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FA6131] to-[#d44520] rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-xl shadow-[#FA6131]/15 space-y-4">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Wallet size={90} className="transform translate-x-3 -translate-y-3" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <p className="text-white/80 font-extrabold uppercase tracking-wider text-[10px] md:text-xs flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-white" />
              Today&apos;s Settlement · Live Bachs Tally
            </p>
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white/90 text-[10px] font-bold">
              Next Transfer: {settlement?.next_settlement_label || 'Today at 06:00 PM WAT'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {formatMoney(settlement?.unsettled_amount ?? dashboard?.pending_payout)}
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <ShoppingBag size={13} className="text-white" />
                <span className="text-xs font-bold text-white">
                  {settlement?.unsettled_orders_count ?? dashboard?.orders_count ?? 0} Verified Txns Awaiting Transfer
                </span>
              </div>
              {settlement?.bank_account_summary && (
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <CreditCard size={12} className="text-white/80" />
                  <span className="text-[11px] font-bold text-white/90">
                    {settlement.bank_account_summary}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {settlement?.transactions?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSettlementLedger((prev) => !prev)}
                  className="px-3 py-1.5 rounded-full bg-white text-[#d44520] text-xs font-extrabold shadow-sm hover:bg-white/90 transition-colors"
                >
                  {showSettlementLedger ? 'Hide Tally' : `View Tally (${settlement.transactions.length})`}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/vendor/earnings')}
                className="px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/35 text-white text-xs font-bold border border-white/15 transition-colors"
              >
                Full Ledger →
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Live Bachs Transactions Tally */}
        {showSettlementLedger && settlement?.transactions?.length > 0 && (
          <div className="relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 space-y-2 max-h-64 overflow-y-auto">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">
              Verified Bachs Transactions Today
            </p>
            {settlement.transactions.map((tx) => (
              <div
                key={tx.order_id}
                onClick={() => setSelectedOrderId(tx.order_id)}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/20 hover:bg-black/30 cursor-pointer transition-colors text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-extrabold text-white">#{tx.order_id}</span>
                    <span className="font-bold text-white/90 truncate">{tx.customer_name}</span>
                    <span className="text-[10px] text-white/70">
                      {tx.created_at ? fmtTime(tx.created_at) : ''}
                    </span>
                  </div>
                  {tx.payment_reference && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-emerald-200 truncate">
                        Ref: {tx.payment_reference}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyRef(tx.payment_reference, e)}
                        className="text-white/70 hover:text-white p-0.5"
                        title="Copy Payment Reference"
                      >
                        {copiedRef === tx.payment_reference ? <Check size={11} /> : <Copy size={11} />}
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-extrabold text-white">{formatMoney(tx.total_amount)}</p>
                  <span className="text-[9px] uppercase font-bold text-white/80">
                    {tx.settlement_status === 'settled' ? '✓ Settled' : '⏳ Awaiting 6PM'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Navigation & Operation Hub ────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/vendor/orders')}
          className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-[#171B26] border border-white/5 hover:border-[#FA6131]/30 hover:bg-[#FA6131]/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FA6131]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Flame size={20} className="text-[#FA6131]" />
          </div>
          <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Live Orders</span>
        </button>

        <button
          onClick={() => navigate('/vendor/menu')}
          className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-[#171B26] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <LayoutList size={20} className="text-emerald-400" />
          </div>
          <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Menu Items</span>
        </button>

        <button
          onClick={() => navigate('/vendor/earnings')}
          className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-[#171B26] border border-white/5 hover:border-[#2CD6EB]/30 hover:bg-[#2CD6EB]/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2CD6EB]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet size={20} className="text-[#2CD6EB]" />
          </div>
          <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Payouts</span>
        </button>

        <button
          onClick={() => navigate('/vendor/settings')}
          className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-[#171B26] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings size={20} className="text-purple-400" />
          </div>
          <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Fleet & Settings</span>
        </button>
      </div>

      {/* ── Store Live Status Control ──────────────────────── */}
      <StoreStatusWidget externalRefreshKey={availabilityRefreshKey} />

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
            placeholder="Search by Order ID (e.g. 1082), customer phone, name, or payment ref..."
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
                ? 'Try adjusting your search query or check the full Order History Archive.'
                : 'Orders will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const orderId = order.order_id || order.id;
              const st = (order.status || '').toLowerCase();
              const isPaid = (order.payment_status || '').toUpperCase() === 'PAID';
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
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-mono font-extrabold text-[#2CD6EB] tracking-wider">
                          #{String(orderId).toUpperCase()}
                        </span>
                        {order.order_number && (
                          <span className="text-[10px] font-mono text-gray-400 font-bold">
                            {order.order_number}
                          </span>
                        )}
                      </div>
                      <h4 className="text-white font-bold text-sm">{order.customer_name || 'Customer'}</h4>
                      {order.customer_phone && (
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          📞 {order.customer_phone}
                        </p>
                      )}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isPaid
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
                      {order.payment_reference && (
                        <span
                          onClick={(e) => handleCopyRef(order.payment_reference, e)}
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20"
                          title="Click to copy verified payment reference"
                        >
                          Ref: {order.payment_reference}
                          {copiedRef === order.payment_reference ? (
                            <Check size={10} className="text-emerald-400" />
                          ) : (
                            <Copy size={10} />
                          )}
                        </span>
                      )}
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
