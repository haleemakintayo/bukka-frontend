import React, { useState } from 'react';
import { Truck, Phone, User, Loader2, X, AlertCircle } from 'lucide-react';

const DispatchOrderModal = ({ order, isOpen, onClose, onConfirm, isSubmitting }) => {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [trackingNote, setTrackingNote] = useState('');

  if (!isOpen || !order) return null;

  const orderId = order.order_id || order.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(orderId, {
      driver_name: driverName.trim() || undefined,
      driver_phone: driverPhone.trim() || undefined,
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
      <div className="relative w-full max-w-md bg-[#171B26] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2CD6EB]/10 border border-[#2CD6EB]/20 text-[#2CD6EB] flex items-center justify-center shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Dispatch Order #{String(orderId).toUpperCase()}
            </h3>
            <p className="text-xs text-gray-400">
              Assign dispatch rider. Customer will receive delivery notifications.
            </p>
          </div>
        </div>

        {/* Delivery Address Reminder */}
        {order.delivery_address && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 space-y-1">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Driver Name */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Rider / Driver Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Tunde (Campus Express)"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]/50"
              />
            </div>
          </div>

          {/* Driver Phone */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Rider Phone Number
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]/50"
              />
            </div>
          </div>

          {/* Tracking / Dispatch Note */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Dispatch Note <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={trackingNote}
              onChange={(e) => setTrackingNote(e.target.value)}
              placeholder="e.g. Red bike, helmet on"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB]/50"
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
