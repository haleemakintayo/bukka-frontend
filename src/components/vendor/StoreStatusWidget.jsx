import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Power, PauseCircle, CheckCircle2, XCircle, AlertTriangle,
  Clock, Phone
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const StoreStatusWidget = ({ externalRefreshKey = 0, onStatusChanged }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pauseMinutes, setPauseMinutes] = useState(30);
  const [showPausePanel, setShowPausePanel] = useState(false);
  const [conflictOrders, setConflictOrders] = useState(null); // in-flight order IDs on 409
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const data = await vendorService.getAvailability();
      setAvailability(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 30_000);
    return () => clearInterval(id);
  }, [fetchStatus, externalRefreshKey]);

  const handleOpen = async () => {
    setActionLoading(true);
    setConflictOrders(null);
    try {
      const data = await vendorService.openStore();
      setAvailability(data);
      setShowPausePanel(false);
      showToast('success', 'Store is now open! 🟢');
      if (onStatusChanged) onStatusChanged(data);
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
      if (onStatusChanged) onStatusChanged(data);
    } catch (err) {
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
      if (onStatusChanged) onStatusChanged(data);
    } catch (err) {
      showToast('error', getApiErrorMessage(err, 'Failed to pause store.'));
    } finally {
      setActionLoading(false);
    }
  };

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
            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-gray-400">
              {availability?.hours && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} className="text-[#2CD6EB]" />
                  Hours: <strong className="text-gray-200">{availability.hours}</strong>
                </span>
              )}
              {availability?.whatsapp_number && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={11} className="text-emerald-400" />
                  Alerts: <strong className="text-gray-200 font-mono">{availability.whatsapp_number}</strong>
                </span>
              )}
            </div>
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
            : <Power size={16} />}
          Close
        </button>
      </div>

      {/* Pause Panel */}
      {showPausePanel && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">Pause duration</span>
            <span className="text-xs font-mono font-bold text-white">{pauseMinutes} min</span>
          </div>
          {/* Quick presets */}
          <div className="flex gap-2">
            {[15, 30, 45, 60, 120].map((m) => (
              <button
                key={m}
                onClick={() => setPauseMinutes(m)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  pauseMinutes === m
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
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

export default StoreStatusWidget;
