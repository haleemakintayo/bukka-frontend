import React, { useState } from 'react';
import { Ban, AlertTriangle, Loader2, X } from 'lucide-react';

const REASON_PRESETS = [
  'Out of key ingredients / dish sold out',
  'Kitchen is at maximum capacity',
  'Delivery address outside coverage area',
  'Store closing early due to emergency',
  'Power / equipment malfunction',
];

const RejectOrderModal = ({ order, isOpen, onClose, onConfirm, isSubmitting }) => {
  const [selectedPreset, setSelectedPreset] = useState(REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !order) return null;

  const orderId = order.order_id || order.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = customReason.trim() || selectedPreset;
    onConfirm(orderId, {
      reason: finalReason,
      reason_category: customReason ? 'custom' : 'preset',
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
      <div className="relative w-full max-w-md bg-[#171B26] border border-red-500/20 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white p-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <Ban size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Decline Order #{String(orderId).toUpperCase()}
            </h3>
            <p className="text-xs text-gray-400">
              Customer: <span className="text-white font-semibold">{order.customer_name || 'Customer'}</span>
            </p>
          </div>
        </div>

        {/* Automatic Actions Notice */}
        <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-red-300">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Declining will <strong className="text-red-200 font-semibold">automatically restore stock</strong> in your inventory and notify the customer via message.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Presets */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Select Reason
            </label>
            <div className="space-y-1.5">
              {REASON_PRESETS.map((reason) => {
                const isSelected = !customReason && selectedPreset === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(reason);
                      setCustomReason('');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-red-500/15 border-red-500/30 text-white font-bold'
                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Reason */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Or specify custom reason
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="e.g. Generator issues, closing in 5 mins"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
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
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Ban size={16} />
                  Confirm Decline
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectOrderModal;
