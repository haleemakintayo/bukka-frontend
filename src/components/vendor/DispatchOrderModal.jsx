import React, { useState, useEffect } from 'react';
import { Truck, Phone, User, Loader2, X, Bike, Check, CheckCircle2 } from 'lucide-react';
import { vendorService } from '../../services/vendorService';

const DispatchOrderModal = ({ order, isOpen, onClose, onConfirm, isSubmitting }) => {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [trackingNote, setTrackingNote] = useState('');
  const [savedRiders, setSavedRiders] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [saveToFleet, setSaveToFleet] = useState(false);
  const [loadingRiders, setLoadingRiders] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDriverName('');
      setDriverPhone('');
      setTrackingNote('');
      setSelectedRiderId(null);
      setSaveToFleet(false);
      return;
    }

    let isMounted = true;
    const loadRiders = async () => {
      try {
        setLoadingRiders(true);
        const data = await vendorService.getRiders();
        if (isMounted) {
          const list = Array.isArray(data) ? data.filter((r) => r.is_active) : [];
          setSavedRiders(list);
        }
      } catch {
        // Fallback silently if rider fetch fails
      } finally {
        if (isMounted) setLoadingRiders(false);
      }
    };

    loadRiders();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const orderId = order.order_id || order.id;

  const handleSelectRider = (rider) => {
    if (selectedRiderId === rider.id) {
      // Deselect
      setSelectedRiderId(null);
      setDriverName('');
      setDriverPhone('');
    } else {
      // Select rider
      setSelectedRiderId(rider.id);
      setDriverName(rider.name);
      setDriverPhone(rider.phone_number);
      setSaveToFleet(false);
    }
  };

  const handleNameChange = (val) => {
    setDriverName(val);
    if (selectedRiderId) setSelectedRiderId(null);
  };

  const handlePhoneChange = (val) => {
    setDriverPhone(val);
    if (selectedRiderId) setSelectedRiderId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = driverName.trim();
    const trimmedPhone = driverPhone.trim();

    // If vendor checked "Save to fleet" and typed a new rider, save in background
    if (saveToFleet && !selectedRiderId && trimmedName && trimmedPhone) {
      vendorService.createRider({
        name: trimmedName,
        phone_number: trimmedPhone,
      }).catch(() => {});
    }

    onConfirm(orderId, {
      driver_name: trimmedName || undefined,
      driver_phone: trimmedPhone || undefined,
      tracking_note: trackingNote.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#171B26] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 text-[#2CD6EB] flex items-center justify-center shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Dispatch Order #{String(orderId).toUpperCase()}
            </h3>
            <p className="text-xs text-gray-400">
              Assign dispatch rider. Customer will receive delivery notifications.
            </p>
          </div>
        </div>

        {/* Delivery Destination Reminder */}
        {order.delivery_address && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Destination Address
            </p>
            <p className="text-xs text-white font-medium">{order.delivery_address}</p>
            {(order.delivery_note || order.notes) && (
              <p className="text-[11px] text-gray-400 italic">
                "{order.delivery_note || order.notes}"
              </p>
            )}
          </div>
        )}

        {/* ── 1-Tap Rider Fleet Selector ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bike size={13} className="text-[#2CD6EB]" />
              Select Saved Rider (1-Tap)
            </label>
            {loadingRiders && (
              <Loader2 size={12} className="animate-spin text-gray-500" />
            )}
          </div>

          {savedRiders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedRiders.map((rider) => {
                const isSelected = selectedRiderId === rider.id;
                return (
                  <button
                    key={rider.id}
                    type="button"
                    onClick={() => handleSelectRider(rider)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#2CD6EB]/15 border-[#2CD6EB] text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold truncate">{rider.name}</p>
                      <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">
                        {rider.phone_number}
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#2CD6EB] text-[#0F121C] flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-500">
              No saved riders yet. Type below and check the box to save this rider for future orders.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Driver Name */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Rider / Driver Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Tunde (Campus Express)"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]/50"
              />
            </div>
          </div>

          {/* Driver Phone */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Rider Phone Number
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                required
                value={driverPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]/50"
              />
            </div>
          </div>

          {/* Checkbox: Save new rider to fleet */}
          {!selectedRiderId && driverName.trim().length > 1 && (
            <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer text-xs text-gray-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={saveToFleet}
                onChange={(e) => setSaveToFleet(e.target.checked)}
                className="w-4 h-4 rounded text-[#2CD6EB] bg-white/5 border-white/20 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] font-semibold">
                Save "{driverName.trim()}" to my fleet for 1-tap dispatches
              </span>
            </label>
          )}

          {/* Tracking / Dispatch Note */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Dispatch Note <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={trackingNote}
              onChange={(e) => setTrackingNote(e.target.value)}
              placeholder="e.g. Red bike, helmet on, calling from gate"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-[#2CD6EB]/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Truck size={16} />
                  Dispatch Order 🚚
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchOrderModal;
