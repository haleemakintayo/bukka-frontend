import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Loader2, ShoppingBag, Clock, CheckCircle2, XCircle, AlertTriangle,
  X, MapPin, Phone, RefreshCw, Ban, Search, Truck, Store, Flame,
  Volume2, VolumeX, LayoutGrid, List, ChefHat, CheckSquare, Filter
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import { playNewOrderChime, playActionSuccessChime } from '../../utils/audioAlert';

import OrderCard from '../../components/vendor/OrderCard';
import AcceptOrderModal from '../../components/vendor/AcceptOrderModal';
import DispatchOrderModal from '../../components/vendor/DispatchOrderModal';
import RejectOrderModal from '../../components/vendor/RejectOrderModal';
import OrderDetailDrawer from '../../components/vendor/OrderDetailDrawer';
import BatchActionBar from '../../components/vendor/BatchActionBar';

const VendorOrdersFulfillment = () => {
  const [viewMode, setViewMode] = useState('board'); // 'board' (Kanban) | 'list'
  const [boardData, setBoardData] = useState({
    new_paid: [],
    preparing: [],
    ready_for_pickup: [],
    out_for_delivery: [],
    counts: {},
  });
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    new_unaccepted_count: 0,
    active_total_count: 0,
    ready_count: 0,
    latest_order_id: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [statusTab, setStatusTab] = useState('ACTIVE'); // 'ACTIVE' | 'NEW' | 'PREPARING' | 'READY' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED'
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // 'all' | 'pickup' | 'delivery'
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Selection for batch actions
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Modals & Drawer States
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [dispatchingOrder, setDispatchingOrder] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [isBatchExecuting, setIsBatchExecuting] = useState(false);
  const [toast, setToast] = useState(null);

  // Ref to track last seen highest order ID for sound trigger
  const lastOrderIdRef = useRef(0);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Main data fetcher
  const fetchAllData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const [boardRes, listRes, sumRes] = await Promise.all([
        vendorService.getOrdersBoard(),
        vendorService.getOrders({ limit: 100 }),
        vendorService.getOrdersSummary(),
      ]);

      setBoardData(boardRes || {});
      setOrders(Array.isArray(listRes) ? listRes : []);
      setSummary(sumRes || {});

      // Trigger audio chime if new unaccepted order arrived
      if (
        soundEnabled &&
        sumRes &&
        sumRes.latest_order_id > lastOrderIdRef.current &&
        lastOrderIdRef.current > 0
      ) {
        playNewOrderChime();
        const displayId = sumRes.latest_order_number || `#${sumRes.latest_order_id}`;
        showToast('info', `🔔 New Order ${displayId} received!`);
      }

      if (sumRes?.latest_order_id) {
        lastOrderIdRef.current = sumRes.latest_order_id;
      }

      setError(null);
    } catch (err) {
      if (!isSilent) {
        setError(getApiErrorMessage(err, 'Failed to fetch fulfillment queue.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [soundEnabled]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fast 5-second polling for live summary and updates
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAllData]);

  // Selection toggle
  const handleToggleSelect = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleClearSelection = () => {
    setSelectedOrderIds([]);
  };

  // ── Action Handlers ───────────────────────────────────────────────────────

  const handleConfirmAccept = async (orderId, data) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.acceptOrder(orderId, data);
      setAcceptingOrder(null);
      if (soundEnabled) playActionSuccessChime();
      showToast('success', `Order #${String(orderId).toUpperCase()} accepted! Kitchen notified. 👨‍🍳`);
      await fetchAllData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to accept order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkReady = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.markOrderReady(orderId);
      if (soundEnabled) playActionSuccessChime();
      showToast('success', `Order #${String(orderId).toUpperCase()} is Ready! Customer alerted. 🚀`);
      await fetchAllData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to mark order ready.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDispatch = async (orderId, data) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.dispatchOrder(orderId, data);
      setDispatchingOrder(null);
      if (soundEnabled) playActionSuccessChime();
      showToast('success', `Order #${String(orderId).toUpperCase()} dispatched on the road! 🚚`);
      await fetchAllData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to dispatch order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeliver = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      await vendorService.deliverOrder(orderId);
      if (soundEnabled) playActionSuccessChime();
      showToast('success', `Order #${String(orderId).toUpperCase()} marked as Delivered! 🎉`);
      await fetchAllData(true);
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
      setRejectingOrder(null);
      showToast('info', `Order #${String(orderId).toUpperCase()} declined. Stock restored.`);
      await fetchAllData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to decline order.'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBatchAction = async (action) => {
    if (!selectedOrderIds || selectedOrderIds.length === 0) return;
    setIsBatchExecuting(true);
    try {
      const res = await vendorService.batchFulfillOrders({
        order_ids: selectedOrderIds,
        action,
        estimated_prep_minutes: action === 'accept' ? 15 : undefined,
      });

      if (soundEnabled) playActionSuccessChime();
      showToast(
        'success',
        `Batch ${action} completed for ${res.updated_count || selectedOrderIds.length} orders!`
      );
      handleClearSelection();
      await fetchAllData(true);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, `Failed to execute batch ${action}.`));
    } finally {
      setIsBatchExecuting(false);
    }
  };

  // ── Filtering for List View ───────────────────────────────────────────────

  const filteredOrders = orders.filter((o) => {
    const st = (o.status || '').toLowerCase();
    const idStr = String(o.order_number || o.order_id || o.id || '').toLowerCase();
    const custName = String(o.customer_name || '').toLowerCase();
    const custPhone = String(o.customer_phone || '').toLowerCase();
    const orderType = (o.order_type || 'pickup').toLowerCase();

    // Tab filtering
    if (statusTab === 'ACTIVE') {
      if (['completed', 'delivered', 'rejected', 'cancelled', 'abandoned'].includes(st)) return false;
    } else if (statusTab === 'NEW') {
      if (o.payment_status !== 'PAID' || !['paid', 'pending'].includes(st)) return false;
    } else if (statusTab === 'PREPARING') {
      if (!['preparing', 'confirmed'].includes(st)) return false;
    } else if (statusTab === 'READY') {
      if (st !== 'ready') return false;
    } else if (statusTab === 'DISPATCHED') {
      if (st !== 'dispatched') return false;
    } else if (statusTab === 'COMPLETED') {
      if (!['completed', 'delivered'].includes(st)) return false;
    } else if (statusTab === 'CANCELLED') {
      if (!['rejected', 'cancelled', 'abandoned'].includes(st)) return false;
    }

    // Order type filter
    if (orderTypeFilter !== 'all' && orderType !== orderTypeFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return idStr.includes(q) || custName.includes(q) || custPhone.includes(q);
    }

    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-32 relative text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[120] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl border animate-in slide-in-from-top-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#171B26] border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
              : toast.type === 'info'
              ? 'bg-[#171B26] border-[#2CD6EB]/30 text-[#2CD6EB] shadow-[#2CD6EB]/10'
              : 'bg-[#171B26] border-red-500/30 text-red-400 shadow-red-500/10'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : toast.type === 'info' ? (
            <Flame size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Top Header & Live Summary Bar ───────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#171B26] border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FA6131]/10 border border-[#FA6131]/20 flex items-center justify-center text-[#FA6131]">
            <Flame size={26} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              Orders & Kitchen Fulfillment
              {summary.new_unaccepted_count > 0 && (
                <span className="px-3 py-0.5 rounded-full bg-[#FA6131] text-white text-xs font-bold animate-pulse shadow-md shadow-[#FA6131]/30">
                  {summary.new_unaccepted_count} NEW
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Live workflow board, fast kitchen actions & customer automated updates
            </p>
          </div>
        </div>

        {/* Live Controls & Polling */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Status Pill */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'
              }`}
            />
            {autoRefresh ? 'Live Queue (5s)' : 'Paused'}
          </button>

          {/* Sound Alert Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playNewOrderChime();
            }}
            className={`p-2.5 rounded-2xl border transition-all ${
              soundEnabled
                ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/20 text-[#2CD6EB]'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
            }`}
            title={soundEnabled ? 'Audio chime active' : 'Muted'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* View Mode Toggle: Kanban Board vs Queue List */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'board'
                  ? 'bg-[#FA6131] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#FA6131] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchAllData(true)}
            disabled={refreshing}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-[#FA6131]' : ''} />
          </button>
        </div>
      </div>

      {/* ── Summary Counters Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {/* Needs Action */}
        <div
          onClick={() => {
            setViewMode('list');
            setStatusTab('NEW');
          }}
          className={`cursor-pointer bg-[#171B26] border rounded-3xl p-4 transition-all hover:border-[#FA6131]/40 ${
            summary.new_unaccepted_count > 0
              ? 'border-[#FA6131]/40 bg-[#FA6131]/5 shadow-lg shadow-[#FA6131]/10'
              : 'border-white/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Needs Action
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#FA6131]/15 text-[#FA6131] flex items-center justify-center font-extrabold text-xs">
              !
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">
            {summary.new_unaccepted_count}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Click to view new orders</p>
        </div>

        {/* In Kitchen Cooking */}
        <div
          onClick={() => {
            setViewMode('list');
            setStatusTab('PREPARING');
          }}
          className="cursor-pointer bg-[#171B26] border border-white/5 rounded-3xl p-4 transition-all hover:border-amber-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              In Kitchen
            </span>
            <ChefHat size={14} className="text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">
            {boardData.counts?.preparing || 0}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Actively preparing</p>
        </div>

        {/* Ready at Counter / Out */}
        <div
          onClick={() => {
            setViewMode('list');
            setStatusTab('READY');
          }}
          className="cursor-pointer bg-[#171B26] border border-white/5 rounded-3xl p-4 transition-all hover:border-[#2CD6EB]/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Ready / Out
            </span>
            <Truck size={14} className="text-[#2CD6EB]" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">
            {(boardData.counts?.ready_for_pickup || 0) +
              (boardData.counts?.out_for_delivery || 0)}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Pickup & dispatched</p>
        </div>

        {/* Active Total */}
        <div
          onClick={() => {
            setViewMode('list');
            setStatusTab('ACTIVE');
          }}
          className="cursor-pointer bg-[#171B26] border border-white/5 rounded-3xl p-4 transition-all hover:border-emerald-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Active Total
            </span>
            <ShoppingBag size={14} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">
            {summary.active_total_count}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Total in-flight orders</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (#), customer name, or phone…"
            className="w-full bg-[#171B26] border border-white/10 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FA6131]/50 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Order Type Filter */}
        <div className="flex items-center gap-1.5 bg-[#171B26] border border-white/10 rounded-2xl p-1.5 shrink-0">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'pickup', label: '🏪 Pickup' },
            { id: 'delivery', label: '🚚 Delivery' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setOrderTypeFilter(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                orderTypeFilter === type.id
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── VIEW MODE 1: KANBAN BOARD ───────────────────────────────────── */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {/* Column 1: New / Needs Action */}
          <div className="bg-[#131722] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FA6131] animate-pulse" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  1. Needs Action
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FA6131]/20 text-[#FA6131] font-mono text-xs font-bold">
                {boardData.new_paid?.length || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 size={24} className="animate-spin text-[#FA6131]" />
                </div>
              ) : !boardData.new_paid || boardData.new_paid.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-medium">
                  No new orders awaiting acceptance
                </div>
              ) : (
                boardData.new_paid.map((order) => (
                  <OrderCard
                    key={order.order_id || order.id}
                    order={order}
                    layout="kanban"
                    isSelected={selectedOrderIds.includes(order.order_id || order.id)}
                    onToggleSelect={handleToggleSelect}
                    onOpenDetail={(id) => setDetailOrderId(id)}
                    onOpenAcceptModal={(o) => setAcceptingOrder(o)}
                    onOpenRejectModal={(o) => setRejectingOrder(o)}
                    isActionExecuting={actionLoadingId === (order.order_id || order.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Kitchen Preparing */}
          <div className="bg-[#131722] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  2. In Kitchen
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold">
                {boardData.preparing?.length || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 size={24} className="animate-spin text-amber-400" />
                </div>
              ) : !boardData.preparing || boardData.preparing.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-medium">
                  Kitchen queue is currently clear
                </div>
              ) : (
                boardData.preparing.map((order) => (
                  <OrderCard
                    key={order.order_id || order.id}
                    order={order}
                    layout="kanban"
                    isSelected={selectedOrderIds.includes(order.order_id || order.id)}
                    onToggleSelect={handleToggleSelect}
                    onOpenDetail={(id) => setDetailOrderId(id)}
                    onMarkReady={handleMarkReady}
                    onOpenRejectModal={(o) => setRejectingOrder(o)}
                    isActionExecuting={actionLoadingId === (order.order_id || order.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready for Pickup */}
          <div className="bg-[#131722] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2CD6EB]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  3. Ready (Pickup)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#2CD6EB]/20 text-[#2CD6EB] font-mono text-xs font-bold">
                {boardData.ready_for_pickup?.length || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 size={24} className="animate-spin text-[#2CD6EB]" />
                </div>
              ) : !boardData.ready_for_pickup || boardData.ready_for_pickup.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-medium">
                  No pickup orders awaiting collection
                </div>
              ) : (
                boardData.ready_for_pickup.map((order) => (
                  <OrderCard
                    key={order.order_id || order.id}
                    order={order}
                    layout="kanban"
                    isSelected={selectedOrderIds.includes(order.order_id || order.id)}
                    onToggleSelect={handleToggleSelect}
                    onOpenDetail={(id) => setDetailOrderId(id)}
                    onDeliver={handleDeliver}
                    isActionExecuting={actionLoadingId === (order.order_id || order.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 4: Out for Delivery / Dispatch */}
          <div className="bg-[#131722] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  4. Out for Delivery
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-xs font-bold">
                {boardData.out_for_delivery?.length || 0}
              </span>
            </div>

            <div className="space-y-3 min-h-[160px]">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 size={24} className="animate-spin text-emerald-400" />
                </div>
              ) : !boardData.out_for_delivery || boardData.out_for_delivery.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-medium">
                  No delivery orders on the road
                </div>
              ) : (
                boardData.out_for_delivery.map((order) => (
                  <OrderCard
                    key={order.order_id || order.id}
                    order={order}
                    layout="kanban"
                    isSelected={selectedOrderIds.includes(order.order_id || order.id)}
                    onToggleSelect={handleToggleSelect}
                    onOpenDetail={(id) => setDetailOrderId(id)}
                    onOpenDispatchModal={(o) => setDispatchingOrder(o)}
                    onDeliver={handleDeliver}
                    isActionExecuting={actionLoadingId === (order.order_id || order.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── VIEW MODE 2: QUEUE LIST ─────────────────────────────────────── */
        <div className="space-y-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ACTIVE', label: `🔥 Active Queue (${summary.active_total_count || 0})` },
              { id: 'NEW', label: `⚡ Needs Action (${summary.new_unaccepted_count || 0})` },
              { id: 'PREPARING', label: '👨‍🍳 In Kitchen' },
              { id: 'READY', label: '🚀 Ready' },
              { id: 'DISPATCHED', label: '🚚 Dispatched' },
              { id: 'COMPLETED', label: '✅ Completed' },
              { id: 'CANCELLED', label: '🛑 Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  statusTab === tab.id
                    ? 'bg-[#FA6131]/15 border-[#FA6131]/30 text-[#FA6131]'
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards List */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#FA6131]" />
              <p className="text-xs text-gray-500 font-medium">Loading orders list…</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl p-6 text-center text-xs">
              <p>{error}</p>
              <button
                onClick={() => fetchAllData()}
                className="mt-3 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl font-bold"
              >
                Retry
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#171B26] border border-white/5 rounded-3xl space-y-2">
              <ShoppingBag size={28} className="mx-auto text-gray-600" />
              <p className="text-gray-400 font-bold text-sm">No orders matching this filter.</p>
              <p className="text-gray-600 text-xs">Incoming customer orders appear here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.order_id || order.id}
                  order={order}
                  layout="card"
                  isSelected={selectedOrderIds.includes(order.order_id || order.id)}
                  onToggleSelect={handleToggleSelect}
                  onOpenDetail={(id) => setDetailOrderId(id)}
                  onOpenAcceptModal={(o) => setAcceptingOrder(o)}
                  onOpenDispatchModal={(o) => setDispatchingOrder(o)}
                  onOpenRejectModal={(o) => setRejectingOrder(o)}
                  onMarkReady={handleMarkReady}
                  onDeliver={handleDeliver}
                  isActionExecuting={actionLoadingId === (order.order_id || order.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modals & Drawers ────────────────────────────────────────────── */}
      <AcceptOrderModal
        order={acceptingOrder}
        isOpen={Boolean(acceptingOrder)}
        onClose={() => setAcceptingOrder(null)}
        onConfirm={handleConfirmAccept}
        isSubmitting={actionLoadingId === (acceptingOrder?.order_id || acceptingOrder?.id)}
      />

      <DispatchOrderModal
        order={dispatchingOrder}
        isOpen={Boolean(dispatchingOrder)}
        onClose={() => setDispatchingOrder(null)}
        onConfirm={handleConfirmDispatch}
        isSubmitting={actionLoadingId === (dispatchingOrder?.order_id || dispatchingOrder?.id)}
      />

      <RejectOrderModal
        order={rejectingOrder}
        isOpen={Boolean(rejectingOrder)}
        onClose={() => setRejectingOrder(null)}
        onConfirm={handleConfirmReject}
        isSubmitting={actionLoadingId === (rejectingOrder?.order_id || rejectingOrder?.id)}
      />

      <OrderDetailDrawer
        orderId={detailOrderId}
        isOpen={Boolean(detailOrderId)}
        onClose={() => setDetailOrderId(null)}
        onOpenAcceptModal={(o) => {
          setDetailOrderId(null);
          setAcceptingOrder(o);
        }}
        onOpenDispatchModal={(o) => {
          setDetailOrderId(null);
          setDispatchingOrder(o);
        }}
        onOpenRejectModal={(o) => {
          setDetailOrderId(null);
          setRejectingOrder(o);
        }}
        onMarkReady={handleMarkReady}
        onDeliver={handleDeliver}
        isExecuting={actionLoadingId === detailOrderId}
      />

      {/* Floating Batch Action Toolbar */}
      <BatchActionBar
        selectedOrderIds={selectedOrderIds}
        onClearSelection={handleClearSelection}
        onBatchAction={handleBatchAction}
        isExecuting={isBatchExecuting}
      />
    </div>
  );
};

export default VendorOrdersFulfillment;
