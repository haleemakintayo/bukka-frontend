import React, { useState, useEffect } from 'react';
import {
  X, Clock, Phone, MapPin, CreditCard, ChefHat, Truck,
  CheckCircle2, AlertCircle, Ban, Printer, MessageSquare,
  Loader2, ExternalLink, Copy, Check, ShieldCheck, Bike
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';

const OrderDetailDrawer = ({
  orderId,
  isOpen,
  onClose,
  onOpenAcceptModal,
  onOpenDispatchModal,
  onOpenRejectModal,
  onMarkReady,
  onDeliver,
  onCancel,
  isExecuting,
}) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchDetail();
    } else {
      setOrder(null);
      setError(null);
      setCopiedRef(false);
    }
  }, [isOpen, orderId]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendorService.getOrderDetail(orderId);
      setOrder(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to fetch order details.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDateTime = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyRef = (refText) => {
    if (!refText) return;
    navigator.clipboard?.writeText(refText);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const status = (order?.status || '').toLowerCase();
  const isPaid = order?.payment_status === 'PAID';
  const isPaidOrPending = isPaid && ['paid', 'pending'].includes(status);
  const isPreparing = isPaid && ['preparing', 'confirmed'].includes(status);
  const isReady = isPaid && status === 'ready';
  const isDispatched = isPaid && status === 'dispatched';
  const isDelivered = ['delivered', 'completed'].includes(status);
  const isRejectedOrCancelled = ['rejected', 'cancelled', 'abandoned'].includes(status);
  const isDelivery = (order?.order_type || '').toLowerCase() === 'delivery';

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[105] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-[#131722] border-l border-white/10 h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#171B26] shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-base font-extrabold text-[#2CD6EB]">
              #{String(order?.order_id || orderId)}
            </span>
            {order?.order_number && (
              <span className="font-mono text-xs font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                {order.order_number}
              </span>
            )}
            {order && (
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  order.order_type === 'delivery'
                    ? 'bg-[#FA6131]/10 text-[#FA6131] border-[#FA6131]/20'
                    : 'bg-[#2CD6EB]/10 text-[#2CD6EB] border-[#2CD6EB]/20'
                }`}
              >
                {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintTicket}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Print Kitchen Ticket"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-[#FA6131]" />
              <p className="text-xs text-gray-500 font-medium">Loading details…</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5 text-center text-xs">
              <p>{error}</p>
              <button
                onClick={fetchDetail}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl font-bold"
              >
                Retry
              </button>
            </div>
          ) : order ? (
            <>
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDelivered
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : isRejectedOrCancelled
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : isDispatched
                    ? 'bg-[#2CD6EB]/10 border-[#2CD6EB]/20 text-[#2CD6EB]'
                    : isReady
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-[#FA6131]/10 border-[#FA6131]/20 text-[#FA6131]'
                }`}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Fulfillment Status
                  </p>
                  <p className="text-base font-extrabold capitalize mt-0.5">{order.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold">
                    {formatMoney(order.total_amount || order.total_price)}
                  </p>
                  <p
                    className={`text-[10px] uppercase font-bold ${
                      isPaid ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {order.payment_status || 'PENDING'}
                  </p>
                </div>
              </div>

              {/* Payment Verification & Dispute Resolution Card */}
              <div className="bg-[#171B26] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={14} className={isPaid ? 'text-emerald-400' : 'text-amber-400'} />
                    Bachs Verification Record
                  </p>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      isPaid
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isPaid ? '✓ Verified Paid' : order.payment_status || 'Unverified / Pending'}
                  </span>
                </div>

                <div className="bg-[#0f1118] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      Payment Reference
                    </p>
                    <p className="text-xs font-mono font-bold text-[#2CD6EB] truncate mt-0.5">
                      {order.payment_reference || 'No payment reference recorded'}
                    </p>
                  </div>
                  {order.payment_reference && (
                    <button
                      type="button"
                      onClick={() => handleCopyRef(order.payment_reference)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
                      title="Copy Payment Reference"
                    >
                      {copiedRef ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>Order ID: <strong className="text-white font-mono">#{order.order_id}</strong></span>
                  <span>Timestamp: <strong className="text-white">{formatDateTime(order.created_at)}</strong></span>
                </div>
              </div>

              {/* Rejection / Cancellation Reason if any */}
              {(order.rejection_reason || order.cancellation_reason) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-1 text-xs text-red-300">
                  <p className="font-bold text-red-400 uppercase text-[10px] tracking-wider">
                    Reason
                  </p>
                  <p>{order.rejection_reason || order.cancellation_reason}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Order Timeline
                </p>
                <div className="space-y-2 text-xs divide-y divide-white/5">
                  <div className="flex justify-between py-1 text-gray-400">
                    <span>Order Placed</span>
                    <span className="text-gray-200 font-medium">{formatDateTime(order.created_at)}</span>
                  </div>
                  {order.accepted_at && (
                    <div className="flex justify-between py-1 text-gray-400">
                      <span>Kitchen Accepted (~{order.estimated_prep_minutes || 15}m ETA)</span>
                      <span className="text-gray-200 font-medium">{formatDateTime(order.accepted_at)}</span>
                    </div>
                  )}
                  {order.ready_at && (
                    <div className="flex justify-between py-1 text-gray-400">
                      <span>Food Ready</span>
                      <span className="text-gray-200 font-medium">{formatDateTime(order.ready_at)}</span>
                    </div>
                  )}
                  {order.dispatched_at && (
                    <div className="flex justify-between py-1 text-gray-400">
                      <span>Dispatched on Road</span>
                      <span className="text-gray-200 font-medium">{formatDateTime(order.dispatched_at)}</span>
                    </div>
                  )}
                  {order.delivered_at && (
                    <div className="flex justify-between py-1 text-emerald-400 font-semibold">
                      <span>Delivered / Completed</span>
                      <span>{formatDateTime(order.delivered_at)}</span>
                    </div>
                  )}
                  {order.cancelled_at && (
                    <div className="flex justify-between py-1 text-red-400 font-semibold">
                      <span>Cancelled / Declined</span>
                      <span>{formatDateTime(order.cancelled_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Customer Information
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{order.customer_name || 'Customer'}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{order.customer_phone}</p>
                  </div>
                  {order.customer_phone && (
                    <div className="flex gap-2">
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="p-2.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-colors"
                        title="Call Customer"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                        title="WhatsApp Customer"
                      >
                        <MessageSquare size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Details */}
              {isDelivery && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Delivery Address & Rider
                    </p>
                    {order.delivery_area_name && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#2CD6EB]/10 text-[#2CD6EB] border border-[#2CD6EB]/20">
                        📍 {order.delivery_area_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-200">
                    <MapPin size={14} className="text-[#FA6131] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{order.delivery_address || 'No address specified'}</p>
                      {(order.delivery_note || order.notes) && (
                        <p className="text-gray-400 italic mt-0.5">"{order.delivery_note || order.notes}"</p>
                      )}
                    </div>
                  </div>

                  {order.driver_name && (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Assigned Rider</p>
                        <p className="text-white font-bold">{order.driver_name}</p>
                        {order.driver_phone && <p className="text-gray-400 font-mono">{order.driver_phone}</p>}
                      </div>
                      {order.driver_phone && (
                        <a
                          href={`tel:${order.driver_phone}`}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#2CD6EB] transition-colors"
                        >
                          <Phone size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Ordered Items & Fulfillment
                </p>
                <div className="divide-y divide-white/5">
                  {order.items &&
                    order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-white font-bold">
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#FA6131] mr-1.5 font-mono">
                              {item.quantity}×
                            </span>
                            {item.menu_item_name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {formatMoney(item.unit_price)} each
                          </p>
                        </div>
                        <p className="text-white font-extrabold font-mono">
                          {formatMoney(item.line_total || item.unit_price * item.quantity)}
                        </p>
                      </div>
                    ))}

                  {/* Delivery Fee Line Item */}
                  {order.delivery_fee && Number(order.delivery_fee) > 0 ? (
                    <div className="py-2.5 flex items-center justify-between text-xs border-t border-white/5">
                      <div>
                        <p className="text-white font-bold flex items-center gap-1.5">
                          <Bike size={13} className="text-[#2CD6EB]" />
                          Campus Delivery Fee {order.delivery_area_name ? `(${order.delivery_area_name})` : ''}
                        </p>
                        <p className="text-[10px] text-gray-500">Hostel / Campus dispatch</p>
                      </div>
                      <p className="text-[#2CD6EB] font-extrabold font-mono">
                        {formatMoney(order.delivery_fee)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Action Buttons */}
        {order && !isDelivered && !isRejectedOrCancelled && (
          <div className="p-4 border-t border-white/10 bg-[#171B26] shrink-0 space-y-2">
            {/* Primary Action Button */}
            {isPaidOrPending && (
              <button
                onClick={() => onOpenAcceptModal(order)}
                disabled={isExecuting}
                className="w-full py-3 bg-[#FA6131] hover:bg-[#e05327] text-white rounded-2xl font-bold text-xs shadow-lg shadow-[#FA6131]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ChefHat size={16} /> Accept & Start Cooking
              </button>
            )}

            {isPreparing && (
              <button
                onClick={() => onMarkReady(orderId)}
                disabled={isExecuting}
                className="w-full py-3 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-2xl font-extrabold text-xs shadow-lg shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Mark Food as Ready 🚀
              </button>
            )}

            {isReady && isDelivery && (
              <button
                onClick={() => onOpenDispatchModal(order)}
                disabled={isExecuting}
                className="w-full py-3 bg-[#2CD6EB] hover:bg-[#20b8cb] text-[#0F121C] rounded-2xl font-extrabold text-xs shadow-lg shadow-[#2CD6EB]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Truck size={16} /> Dispatch Rider 🚚
              </button>
            )}

            {(isReady && !isDelivery) || isDispatched ? (
              <button
                onClick={() => onDeliver(orderId)}
                disabled={isExecuting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Complete / Delivered 🎉
              </button>
            ) : null}

            {/* Decline / Cancel Option */}
            <div className="flex gap-2">
              <button
                onClick={() => onOpenRejectModal(order)}
                disabled={isExecuting}
                className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Ban size={14} /> Decline / Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailDrawer;
