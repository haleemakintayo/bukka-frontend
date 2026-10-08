import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings, Bell, Clock, Package, Check, Loader2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const StoreSettingsWidget = ({ onSettingsSaved }) => {
  const [settings, setSettings] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [openingTime, setOpeningTime] = useState('08:30 AM');
  const [closingTime, setClosingTime] = useState('06:30 PM');
  const [containerCost, setContainerCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vendorService.getStoreSettings();
      setSettings(data);
      setWhatsappNumber(data?.whatsapp_number || '');
      setOpeningTime(data?.opening_time || '08:30 AM');
      setClosingTime(data?.closing_time || '06:30 PM');
      setContainerCost(Number(data?.container_cost || 0));
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await vendorService.updateStoreSettings({
        whatsapp_number: whatsappNumber.trim(),
        opening_time: openingTime.trim(),
        closing_time: closingTime.trim(),
        container_cost: Math.max(0, Number(containerCost) || 0),
      });
      setSettings(updated);
      setWhatsappNumber(updated.whatsapp_number || '');
      setOpeningTime(updated.opening_time || openingTime);
      setClosingTime(updated.closing_time || closingTime);
      setContainerCost(Number(updated.container_cost || 0));
      setFeedback({
        type: 'success',
        msg: 'Store settings saved! Operating hours, WhatsApp alerts & Takeaway Pack fee updated.',
      });
      if (onSettingsSaved) onSettingsSaved(updated);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: getApiErrorMessage(err, 'Failed to update store settings.'),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#171B26] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
        <Loader2 size={16} className="animate-spin text-gray-500" />
        <span className="text-xs text-gray-500">Loading store configuration…</span>
      </div>
    );
  }

  return (
    <div className="bg-[#171B26] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden">
      {/* Summary Header Bar */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FA6131]/15 border border-[#FA6131]/30 flex items-center justify-center shrink-0">
            <Settings size={18} className="text-[#FA6131]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">
              Hours, WhatsApp Alerts & Packaging
            </h4>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 mt-0.5">
              <span>
                📦 Takeaway Pack: <strong className="text-[#FA6131]">{containerCost > 0 ? `₦${containerCost}` : 'Off (₦0)'}</strong>
              </span>
              <span>
                🕒 Hours: <strong className="text-gray-200">{settings?.hours || `${openingTime} – ${closingTime}`}</strong>
              </span>
              <span>
                📱 Alerts: <strong className="text-emerald-400 font-mono">{whatsappNumber || 'Not set'}</strong>
              </span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
          {expanded ? 'Hide' : 'Configure'}
        </span>
      </button>

      {expanded && (
        <form onSubmit={handleSave} className="p-4 sm:p-5 pt-2 border-t border-white/5 space-y-4">
          {feedback && (
            <div
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {feedback.msg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notification Phone Number */}
            <div className="bg-[#0F1219] border border-white/10 rounded-2xl p-3.5 space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-300">
                <Bell size={13} className="text-emerald-400" />
                Notification Phone Number
              </label>
              <p className="text-[11px] text-gray-500">
                WhatsApp number that receives instant paid order alerts & Login OTPs.
              </p>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 08031234567 or 2348031234567"
                className="w-full bg-[#171B26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Operating Hours */}
            <div className="bg-[#0F1219] border border-white/10 rounded-2xl p-3.5 space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-300">
                <Clock size={13} className="text-[#2CD6EB]" />
                Default Operating Hours
              </label>
              <p className="text-[11px] text-gray-500">
                Displayed to students on WhatsApp (e.g. 08:30 AM – 06:30 PM).
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Opens</span>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    placeholder="08:30 AM"
                    className="w-full bg-[#171B26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#2CD6EB]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Closes</span>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    placeholder="06:30 PM"
                    className="w-full bg-[#171B26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#2CD6EB]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Global Container Cost */}
          <div className="bg-[#0F1219] border border-white/10 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-300">
                <Package size={13} className="text-[#FA6131]" />
                Global Container Cost (Takeaway Pack)
              </label>
              <span className="text-[11px] font-bold text-[#FA6131]">
                Auto-injected into WhatsApp Flow Screen 2
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[0, 150, 200, 300, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setContainerCost(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    Number(containerCost) === preset
                      ? 'bg-[#FA6131] border-[#FA6131] text-white'
                      : 'bg-[#171B26] border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {preset === 0 ? '₦0 (Off)' : `₦${preset}`}
                </button>
              ))}
              <div className="relative w-28">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₦</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={containerCost}
                  onChange={(e) => setContainerCost(e.target.value)}
                  className="w-full bg-[#171B26] border border-white/10 rounded-xl pl-7 pr-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#FA6131]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#FA6131] hover:bg-[#e55225] text-white text-xs font-extrabold shadow-lg shadow-[#FA6131]/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Store Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StoreSettingsWidget;
