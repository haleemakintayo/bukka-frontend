import React from 'react';
import { CheckSquare, ChefHat, CheckCircle2, Truck, X, Loader2 } from 'lucide-react';

const BatchActionBar = ({
  selectedOrderIds = [],
  onClearSelection,
  onBatchAction,
  isExecuting,
}) => {
  if (!selectedOrderIds || selectedOrderIds.length === 0) return null;

  const count = selectedOrderIds.length;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#171B26]/95 backdrop-blur-md border border-[#FA6131]/30 rounded-3xl p-3 md:p-4 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 text-white">
        {/* Selection Count */}
        <div className="flex items-center gap-2.5 shrink-0 pl-1">
          <div className="w-8 h-8 rounded-xl bg-[#FA6131]/20 border border-[#FA6131]/30 text-[#FA6131] flex items-center justify-center font-extrabold text-xs">
            {count}
          </div>
          <span className="text-xs md:text-sm font-bold text-gray-200 hidden sm:inline">
            {count} {count === 1 ? 'order' : 'orders'} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Deselect all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Batch Accept */}
          <button
            onClick={() => onBatchAction('accept')}
            disabled={isExecuting}
            className="px-3 md:px-4 py-2 bg-[#FA6131] hover:bg-[#e05327] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#FA6131]/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExecuting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <ChefHat size={14} />
                <span>Accept All</span>
              </>
            )}
          </button>

          {/* Batch Ready */}
          <button
            onClick={() => onBatchAction('ready')}
            disabled={isExecuting}
            className="px-3 md:px-4 py-2 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl text-xs font-extrabold transition-all shadow-md shadow-[#2CD6EB]/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExecuting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>Mark Ready</span>
              </>
            )}
          </button>

          {/* Batch Deliver */}
          <button
            onClick={() => onBatchAction('deliver')}
            disabled={isExecuting}
            className="px-3 md:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExecuting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <CheckSquare size={14} />
                <span>Complete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchActionBar;
