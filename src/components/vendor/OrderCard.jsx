import React from 'react';
import {
  Clock, MapPin, Phone, CheckCircle2, ChefHat, Truck,
  Ban, ChevronRight, CheckSquare, Square, AlertCircle, Loader2
} from 'lucide-react';

const OrderCard = ({
  order,
  isSelected = false,
  onToggleSelect,
  onOpenDetail,
  onOpenAcceptModal,
  onOpenDispatchModal,
  onOpenRejectModal,
  onMarkReady,
  onDeliver,
  isActionExecuting = false,
  layout = 'card', // 'card' | 'kanban'
}) => {
  const orderId = order.order_id || order.id;
  const status = (order.status || '').toLowerCase();
  const isPaidOrPending = ['paid', 'pending'].includes(status);
  const isPreparing = status === 'preparing';
  const isReady = status === 'ready';
  const isDispatched = status === 'dispatched';
  const isDelivered = ['delivered', 'completed'].includes(status);
  const isRejectedOrCancelled = ['rejected', 'cancelled', 'abandoned'].includes(status);
  const isDelivery = (order.order_type || '').toLowerCase() === 'delivery';

  // Calculate elapsed minutes
  const getElapsedInfo = (iso) => {
    if (!iso) return { text: '', isUrgent: false };
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return { text: 'Just now', isUrgent: false };
    if (mins < 60) return { text: `${mins}m ago`, isUrgent: mins > 20 && !isDelivered && !isRejectedOrCancelled };
    const hrs = Math.floor(mins / 60);
    return { text: `${hrs}h ago`, isUrgent: false };
  };

  const elapsed = getElapsedInfo(order.created_at);

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div
      className={`relative bg-[#191D2B] border rounded-3xl p-4 md:p-5 shadow-xl transition-all duration-200 ${
        isSelected
          ? 'border-[#FA6131] shadow-[#FA6131]/10 bg-[#1e2335]'
          : 'border-white/10 hover:border-white/20'
      } ${layout === 'kanban' ? 'space-y-3' : 'space-y-4'}`}
    >
      {/* Top Row: Checkbox, ID, Type Badge, Time */}
      <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          {onToggleSelect && !isDelivered && !isRejectedOrCancelled && (
            <button
              onClick={() => onToggleSelect(orderId)}
              className="text-gray-500 hover:text-white p-0.5"
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-[#FA6131]" />
              ) : (
                <Square size={18} />
              )}
            </button>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-extrabold text-[#2CD6EB]">
                #{String(orderId).toUpperCase()}
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  isDelivery
                    ? 'bg-[#FA6131]/10 text-[#FA6131] border-[#FA6131]/20'
                    : 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/20'
                }`}
              >
                {isDelivery ? '🚚 Delivery' : '🏪 Pickup'}
              </span>
            </div>
            <p className="text-xs font-extrabold text-white mt-0.5 truncate max-w-[140px] md:max-w-[180px]">
              {order.customer_name || 'Customer'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm md:text-base font-extrabold text-white">
            {formatMoney(order.total_amount || order.total_price)}
          </p>
          <span
            className={`text-[10px] font-bold inline-flex items-center gap-1 mt-0.5 ${
              elapsed.isUrgent ? 'text-red-400 animate-pulse font-extrabold' : 'text-gray-400'
            }`}
          >
            <Clock size={10} /> {elapsed.text}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 space-y-1.5">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Items</p>
        <div className="space-y-1 divide-y divide-white/5 text-xs">
          {order.items &&
            order.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 text-gray-200">
                <span className="truncate pr-2 font-medium">
                  <span className="font-mono text-[#FA6131] font-bold mr-1">{item.quantity}×</span>
                  {item.menu_item_name}
                </span>
                <span className="text-[11px] font-bold text-gray-400 font-mono shrink-0">
                  {formatMoney(item.line_total || item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          {order.items && order.items.length > 3 && (
            <p className="text-[10px] text-gray-500 italic pt-1 text-right">
              +{order.items.length - 3} more items…
            </p>
          )}
        </div>
      </div>

      {/* Delivery / Prep Notice */}
      {isDelivery && order.delivery_address && (
        <div className="flex items-start gap-1.5 text-xs text-gray-300 bg-white/[0.01] px-2.5 py-1.5 rounded-xl border border-white/5">
          <MapPin size={12} className="text-[#FA6131] shrink-0 mt-0.5" />
          <span className="truncate">{order.delivery_address}</span>
        </div>
      )}

      {order.estimated_prep_minutes && isPreparing && (
        <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
          <ChefHat size={12} className="text-amber-400 shrink-0" />
          <span>Cooking: ~{order.estimated_prep_minutes} mins ETA</span>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 pt-1">
        {/* Contextual Action Button */}
        {isPaidOrPending && (
          <button
            onClick={() => onOpenAcceptModal(order)}
            disabled={isActionExecuting}
            className="flex-1 py-2.5 bg-[#FA6131] hover:bg-[#e05327] text-white rounded-xl font-bold text-xs shadow-md shadow-[#FA6131]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ChefHat size={14} /> Accept ({order.estimated_prep_minutes || 15}m)
          </button>
        )}

        {isPreparing && (
          <button
            onClick={() => onMarkReady(orderId)}
            disabled={isActionExecuting}
            className="flex-1 py-2.5 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl font-extrabold text-xs shadow-md shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isActionExecuting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Mark Ready 🚀
          </button>
        )}

        {isReady && isDelivery && (
          <button
            onClick={() => onOpenDispatchModal(order)}
            disabled={isActionExecuting}
            className="flex-1 py-2.5 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-xl font-extrabold text-xs shadow-md shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Truck size={14} /> Dispatch Rider 🚚
          </button>
        )}

        {((isReady && !isDelivery) || isDispatched) && (
          <button
            onClick={() => onDeliver(orderId)}
            disabled={isActionExecuting}
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isActionExecuting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Complete Order 🎉
          </button>
        )}

        {/* View Details / Decline Secondary Options */}
        <button
          onClick={() => onOpenDetail(orderId)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="View full details"
        >
          <ChevronRight size={14} />
        </button>

        {!isDelivered && !isRejectedOrCancelled && onOpenRejectModal && (
          <button
            onClick={() => onOpenRejectModal(order)}
            disabled={isActionExecuting}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
            title="Decline order"
          >
            <Ban size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
