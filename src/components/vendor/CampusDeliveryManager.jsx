import React, { useState, useEffect, useCallback } from 'react';
import {
  Bike,
  Store,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Building2,
  GraduationCap,
  MapPin,
  Compass,
  CheckCircle2,
  PauseCircle,
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';

const QUICK_PRICE_PILLS = [150, 200, 250, 300, 400, 500];

const CAMPUS_SUGGESTION_CHIPS = [
  'Male Hostels',
  'Female Hostels',
  'Science Complex',
  'Engineering Annex',
  'Campus Main Gate',
  'Off-Campus Lodges',
];

const getZoneIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('faculty') || lower.includes('lecture') || lower.includes('theatre') || lower.includes('dept') || lower.includes('class')) {
    return GraduationCap;
  }
  if (lower.includes('gate') || lower.includes('junction') || lower.includes('roundabout')) {
    return Store;
  }
  if (lower.includes('off-campus') || lower.includes('lodge') || lower.includes('distance')) {
    return Compass;
  }
  if (lower.includes('hostel') || lower.includes('hall') || lower.includes('block') || lower.includes('room')) {
    return Building2;
  }
  return MapPin;
};

const CampusDeliveryManager = ({ onSettingsUpdated }) => {
  const [storeSettings, setStoreSettings] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingFulfillment, setTogglingFulfillment] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal State (Add or Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null); // null = add, object = edit
  const [areaName, setAreaName] = useState('');
  const [areaPrice, setAreaPrice] = useState(200);
  const [areaActive, setAreaActive] = useState(true);
  const [savingArea, setSavingArea] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [settingsData, areasData] = await Promise.all([
        vendorService.getStoreSettings(),
        vendorService.getDeliveryAreas(),
      ]);
      setStoreSettings(settingsData);
      setAreas(areasData || []);
    } catch {
      showToast('error', 'Failed to load delivery configuration.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Toggle Fulfillment (Delivery or Pickup) ──────────────────────────
  const handleToggleFulfillment = async (field) => {
    if (!storeSettings || togglingFulfillment) return;

    const currentDelivery = Boolean(storeSettings.offers_delivery);
    const currentPickup = Boolean(storeSettings.offers_pickup);

    let nextDelivery = currentDelivery;
    let nextPickup = currentPickup;

    if (field === 'delivery') {
      nextDelivery = !currentDelivery;
    } else if (field === 'pickup') {
      nextPickup = !currentPickup;
    }

    if (!nextDelivery && !nextPickup) {
      showToast('error', 'Your store must offer at least one fulfillment method (Delivery or Pickup).');
      return;
    }

    setTogglingFulfillment(true);
    try {
      const updated = await vendorService.updateStoreSettings({
        offers_delivery: nextDelivery,
        offers_pickup: nextPickup,
      });
      setStoreSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      showToast(
        'success',
        field === 'delivery'
          ? nextDelivery
            ? 'Campus Delivery enabled! 🚚'
            : 'Campus Delivery paused.'
          : nextPickup
          ? 'Store Pickup enabled! 🛍️'
          : 'Store Pickup disabled (Delivery-Only mode).'
      );
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update fulfillment settings.';
      showToast('error', msg);
    } finally {
      setTogglingFulfillment(false);
    }
  };

  // ── Open Add/Edit Modal ──────────────────────────────────────────────
  const openAddModal = () => {
    setEditingArea(null);
    setAreaName('');
    setAreaPrice(200);
    setAreaActive(true);
    setModalOpen(true);
  };

  const openEditModal = (area) => {
    setEditingArea(area);
    setAreaName(area.name);
    setAreaPrice(Number(area.price));
    setAreaActive(Boolean(area.is_active));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArea(null);
  };

  // ── Save Area (Create or Update) ─────────────────────────────────────
  const handleSaveArea = async (e) => {
    if (e) e.preventDefault();
    const trimmedName = areaName.trim();
    if (!trimmedName) {
      showToast('error', 'Please enter a campus area or hostel name.');
      return;
    }
    const parsedPrice = Math.max(0, Number(areaPrice) || 0);

    setSavingArea(true);
    try {
      if (editingArea) {
        // Update existing area
        const updated = await vendorService.updateDeliveryArea(editingArea.id, {
          name: trimmedName,
          price: parsedPrice,
          is_active: areaActive,
        });
        setAreas((prev) =>
          prev.map((a) => (a.id === editingArea.id ? updated : a))
        );
        showToast('success', `Updated "${trimmedName}" (₦${parsedPrice.toLocaleString()})`);
      } else {
        // Create new area
        const created = await vendorService.createDeliveryArea({
          name: trimmedName,
          price: parsedPrice,
        });
        setAreas((prev) => [...prev, created]);
        showToast('success', `Added "${trimmedName}" (₦${parsedPrice.toLocaleString()})`);
      }
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save delivery zone.';
      showToast('error', msg);
    } finally {
      setSavingArea(false);
    }
  };

  // ── Toggle Zone Active Status Inline ─────────────────────────────────
  const handleToggleZoneActive = async (area) => {
    const nextStatus = !area.is_active;
    try {
      const updated = await vendorService.updateDeliveryArea(area.id, {
        is_active: nextStatus,
      });
      setAreas((prev) =>
        prev.map((a) => (a.id === area.id ? updated : a))
      );
      showToast(
        'success',
        nextStatus
          ? `Zone "${area.name}" is now active.`
          : `Zone "${area.name}" paused.`
      );
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update zone status.';
      showToast('error', msg);
    }
  };

  // ── Delete Area ──────────────────────────────────────────────────────
  const handleDeleteArea = async (areaId, areaName) => {
    if (!window.confirm(`Are you sure you want to remove "${areaName}"?`)) return;
    setDeletingId(areaId);
    try {
      await vendorService.deleteDeliveryArea(areaId);
      setAreas((prev) => prev.filter((a) => a.id !== areaId));
      showToast('success', `Removed "${areaName}".`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to remove area.';
      showToast('error', msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#171B26] border border-white/10 rounded-2xl p-6 flex items-center justify-center gap-3">
        <Loader2 size={18} className="animate-spin text-gray-500" />
        <span className="text-xs text-gray-400 font-semibold">Loading campus delivery setup…</span>
      </div>
    );
  }

  const offersDelivery = Boolean(storeSettings?.offers_delivery);
  const offersPickup = Boolean(storeSettings?.offers_pickup);
  const activeAreas = areas.filter((a) => a.is_active);
  const prices = activeAreas.map((a) => Number(a.price));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          {feedback.msg}
        </div>
      )}

      {/* ── Top Level Fulfillment Channels Card ── */}
      <div className="bg-[#171B26] border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <Bike size={16} className="text-[#2CD6EB]" />
              Fulfillment Channels
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Control how students receive orders. Most campus vendors operate delivery-only.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                offersDelivery && !offersPickup
                  ? 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/30'
                  : offersDelivery && offersPickup
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {offersDelivery && !offersPickup
                ? '🚚 Delivery-Only Mode'
                : offersDelivery && offersPickup
                ? '🚚 Delivery + 🛍️ Pickup'
                : '🛍️ Pickup-Only Mode'}
            </span>
          </div>
        </div>

        {/* Dual Switch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {/* Switch 1: Campus Delivery */}
          <div
            onClick={() => handleToggleFulfillment('delivery')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              offersDelivery
                ? 'bg-[#2CD6EB]/5 border-[#2CD6EB]/30 hover:border-[#2CD6EB]/50'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  offersDelivery
                    ? 'bg-[#2CD6EB]/20 text-[#2CD6EB]'
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                <Bike size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Campus Delivery</p>
                <p className="text-[11px] text-gray-400 truncate">
                  Deliver to hostels & faculty buildings
                </p>
              </div>
            </div>

            {/* Toggle Pill */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                offersDelivery ? 'bg-[#2CD6EB]' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#0F1118] absolute top-1 transition-transform ${
                  offersDelivery ? 'left-6' : 'left-1'
                }`}
              />
            </div>
          </div>

          {/* Switch 2: Store Pickup */}
          <div
            onClick={() => handleToggleFulfillment('pickup')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              offersPickup
                ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  offersPickup
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                <Store size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Store Pickup</p>
                <p className="text-[11px] text-gray-400 truncate">
                  Collect in person at physical shop
                </p>
              </div>
            </div>

            {/* Toggle Pill */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                offersPickup ? 'bg-amber-400' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#0F1118] absolute top-1 transition-transform ${
                  offersPickup ? 'left-6' : 'left-1'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Campus Delivery Areas & Tiered Pricing ── */}
      {offersDelivery && (
        <div className="bg-[#171B26] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Campus Delivery Zones & Pricing
                </h3>
                {activeAreas.length > 0 && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {activeAreas.length} active • ₦{minPrice.toLocaleString()}
                    {minPrice !== maxPrice ? ` – ₦${maxPrice.toLocaleString()}` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Students choose their hall or faculty on WhatsApp & Web to calculate instant delivery fees.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={openAddModal}
                className="px-3.5 py-2 rounded-xl bg-[#FA6131] hover:bg-[#e55225] text-white text-xs font-extrabold shadow-md shadow-[#FA6131]/20 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} />
                Add Area
              </button>
            </div>
          </div>

          {/* Empty State */}
          {areas.length === 0 ? (
            <div className="bg-[#0F1219] border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 flex items-center justify-center mx-auto text-[#2CD6EB]">
                <MapPin size={22} />
              </div>
              <div className="max-w-sm mx-auto">
                <p className="text-xs font-bold text-white">No delivery areas configured yet</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Set prices for campus hostels and faculty lecture halls so students pay the right delivery fee.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-4 py-2.5 rounded-xl bg-[#FA6131] hover:bg-[#e55225] text-white text-xs font-extrabold shadow-md shadow-[#FA6131]/20 transition-all inline-flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  Add Delivery Area
                </button>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {areas.map((area) => {
                const IconComponent = getZoneIcon(area.name);
                const isPaused = !area.is_active;

                return (
                  <div
                    key={area.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isPaused
                        ? 'bg-[#0F1219]/60 border-white/5 opacity-60'
                        : 'bg-[#0F1219] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isPaused
                              ? 'bg-white/5 text-gray-500'
                              : 'bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 text-[#2CD6EB]'
                          }`}
                        >
                          <IconComponent size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{area.name}</p>
                          <span
                            className={`inline-block text-[10px] font-mono font-bold mt-0.5 ${
                              isPaused ? 'text-gray-500' : 'text-[#FA6131]'
                            }`}
                          >
                            +₦{Number(area.price).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleZoneActive(area)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border transition-colors ${
                          area.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                        title="Click to toggle active / paused"
                      >
                        {area.is_active ? 'Active' : 'Paused'}
                      </button>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggleZoneActive(area)}
                        className="text-[11px] text-gray-400 hover:text-gray-200 flex items-center gap-1"
                      >
                        {area.is_active ? (
                          <>
                            <PauseCircle size={12} className="text-amber-400" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(area)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Edit price or name"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteArea(area.id, area.name)}
                          disabled={deletingId === area.id}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40"
                          title="Delete area"
                        >
                          {deletingId === area.id ? (
                            <Loader2 size={12} className="animate-spin text-red-400" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#171B26] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FA6131]/15 text-[#FA6131] flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {editingArea ? 'Edit Campus Zone' : 'Add Campus Zone'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Hostel, faculty complex, or campus gate
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveArea} className="space-y-4">
              {/* Area Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Zone / Destination Name</label>
                <input
                  type="text"
                  required
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="e.g. Moremi & New Hall Hostels"
                  className="w-full bg-[#0F1219] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]"
                />

                {/* Suggestions Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-semibold">Quick picks:</span>
                  {CAMPUS_SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAreaName(chip)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-gray-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Price Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300">Delivery Fee (₦)</label>

                {/* Quick Price Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {QUICK_PRICE_PILLS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAreaPrice(preset)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        Number(areaPrice) === preset
                          ? 'bg-[#FA6131] border-[#FA6131] text-white shadow-sm'
                          : 'bg-[#0F1219] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      ₦{preset}
                    </button>
                  ))}
                </div>

                {/* Custom Number Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={areaPrice}
                    onChange={(e) => setAreaPrice(e.target.value)}
                    className="w-full bg-[#0F1219] border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#FA6131]"
                    placeholder="200"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              {editingArea && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F1219] border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">Zone Availability</p>
                    <p className="text-[11px] text-gray-400">Available to students right now</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAreaActive((prev) => !prev)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                      areaActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {areaActive ? 'Active' : 'Paused'}
                  </button>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingArea}
                  className="px-5 py-2.5 rounded-xl bg-[#FA6131] hover:bg-[#e55225] text-white text-xs font-extrabold shadow-md shadow-[#FA6131]/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingArea ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  {editingArea ? 'Save Changes' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusDeliveryManager;
