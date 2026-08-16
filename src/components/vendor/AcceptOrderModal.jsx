import React, { useState } from 'react';
import { ChefHat, Clock, Loader2, X } from 'lucide-react';

const PRESET_TIMES = [10, 15, 20, 30, 45];

const AcceptOrderModal = ({ order, isOpen, onClose, onConfirm, isSubmitting }) => {
  const [prepMinutes, setPrepMinutes] = useState(15);
  const [customTime, setCustomTime] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !order) return null;

  const orderId = order.order_id || order.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalMinutes = customTime ? parseInt(customTime, 10) : prepMinutes;
    onConfirm(orderId, {
      estimated_prep_minutes: finalMinutes || 15,
      notes: notes.trim() || undefined,
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
          <div className="w-12 h-12 rounded-2xl bg-[#FA6131]/10 border border-[#FA6131]/20 text-[#FA6131] flex items-center justify-center shrink-0">
            <ChefHat size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Accept Order #{String(orderId).toUpperCase()}
            </h3>
            <p className="text-xs text-gray-400">
              Set kitchen preparation time. The customer will be notified.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prep Time Selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Estimated Prep Time
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {PRESET_TIMES.map((mins) => {
                const isSelected = !customTime && prepMinutes === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setPrepMinutes(mins);
                      setCustomTime('');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#FA6131] text-white border-[#FA6131] shadow-lg shadow-[#FA6131]/25'
                        : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>

            {/* Custom Minutes Input */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 font-medium">Or custom:</span>
              <input
                type="number"
                min="5"
                max="180"
                value={customTime}
                onChange={(e) => {
                  setCustomTime(e.target.value);
                }}
                placeholder="e.g. 25"
                className="w-24 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FA6131]/50"
              />
              <span className="text-xs text-gray-500 font-medium">minutes</span>
            </div>
          </div>

          {/* Kitchen Notes */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Internal Kitchen Note <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra spicy sauce requested, prep on burner 2"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FA6131]/50 resize-none"
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
              className="flex-1 py-3 bg-[#FA6131] hover:bg-[#e05327] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FA6131]/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <ChefHat size={16} />
                  Start Cooking 👨‍🍳
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptOrderModal;
