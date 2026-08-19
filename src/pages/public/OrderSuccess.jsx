import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ShoppingBag } from 'lucide-react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 })
    .format(amount);

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state || {};

  const reference = state.reference || 'ORD-' + Math.floor(Math.random() * 10000);
  const items = state.items || [];
  const subtotal = state.subtotal || 0;
  const convenienceFee = state.convenienceFee || 0;
  const deliveryFee = state.deliveryFee || 0;
  const total = state.total || subtotal + convenienceFee + deliveryFee;
  const orderType = state.orderType || 'pickup';
  const vendorName = state.vendorName || '';
  const timestamp = state.timestamp || new Date().toISOString();
  const refDisplay = reference.substring(0, 10).toUpperCase();

  return (
    <div className="receipt-page">
      <style>{receiptStyles}</style>

      <div className="receipt-container">
        {/* ── Receipt Card ── */}
        <div className="receipt-card">
          {/* Header with logo */}
          <div className="receipt-header">
            <img
              src="/bukkaai-logo-light.png"
              alt="Bukka AI"
              className="receipt-logo"
            />
            <div className="receipt-badge">
              <CheckCircle2 size={14} />
              <span>Payment Successful</span>
            </div>
          </div>

          {/* Divider — perforated edge */}
          <div className="receipt-perforation" />

          {/* Order info */}
          <div className="receipt-info-row">
            <div className="receipt-info-block">
              <span className="receipt-info-label">Reference</span>
              <span className="receipt-info-value receipt-mono">{refDisplay}</span>
            </div>
            <div className="receipt-info-block receipt-info-right">
              <span className="receipt-info-label">Date</span>
              <span className="receipt-info-value">{formatTime(timestamp)}</span>
            </div>
          </div>

          {vendorName && (
            <div className="receipt-vendor">
              <ShoppingBag size={14} />
              <span>{vendorName}</span>
            </div>
          )}

          <div className="receipt-type-badge">
            {orderType === 'delivery' ? <MapPin size={12} /> : <Clock size={12} />}
            <span>{orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
          </div>

          {/* Line items */}
          {items.length > 0 && (
            <div className="receipt-items">
              <div className="receipt-items-header">
                <span>Item</span>
                <span>Qty</span>
                <span className="receipt-items-right">Price</span>
              </div>
              {items.map((item, i) => (
                <div key={i} className="receipt-item-row">
                  <span className="receipt-item-name">{item.name}</span>
                  <span className="receipt-item-qty">×{item.quantity}</span>
                  <span className="receipt-item-price">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          <div className="receipt-totals">
            {subtotal > 0 && (
              <div className="receipt-total-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            )}
            {convenienceFee > 0 && (
              <div className="receipt-total-row">
                <span>Service Fee</span>
                <span>{formatCurrency(convenienceFee)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="receipt-total-row">
                <span>Delivery</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            <div className="receipt-total-row receipt-total-final">
              <span>Total Paid</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="receipt-perforation" />

          {/* Footer message */}
          <div className="receipt-footer-msg">
            <p className="receipt-footer-title">Your order has been received</p>
            <p className="receipt-footer-desc">
              Return to WhatsApp — we'll notify you when your food is ready
              {orderType === 'delivery' ? ' for delivery' : ' for pickup'}.
            </p>
          </div>

          {/* Powered by */}
          <div className="receipt-powered">
            Powered by <strong>Bukka AI</strong>
          </div>
        </div>

        {/* Action button outside the receipt card */}
        <Link to="/" className="receipt-done-btn">
          Done
        </Link>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════ */
const receiptStyles = `
  .receipt-page {
    min-height: 100vh;
    background: #0f1118;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  .receipt-container {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  /* ── Receipt card ── */
  .receipt-card {
    width: 100%;
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 28px 24px;
    position: relative;
  }

  /* ── Header ── */
  .receipt-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .receipt-logo {
    height: 28px;
    opacity: 0.9;
  }
  .receipt-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.2);
    color: #34d399;
    font-size: 12px;
    font-weight: 700;
  }

  /* ── Perforation ── */
  .receipt-perforation {
    border-top: 1px dashed rgba(255,255,255,0.08);
    margin: 18px -24px;
  }

  /* ── Info row ── */
  .receipt-info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
  }
  .receipt-info-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .receipt-info-right {
    text-align: right;
  }
  .receipt-info-label {
    font-size: 10px;
    font-weight: 700;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .receipt-info-value {
    font-size: 13px;
    font-weight: 600;
    color: #d1d5db;
  }
  .receipt-mono {
    font-family: monospace;
    letter-spacing: 0.05em;
  }

  /* ── Vendor ── */
  .receipt-vendor {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 10px;
  }
  .receipt-vendor svg {
    color: #FA6131;
  }

  /* ── Type badge ── */
  .receipt-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(44,214,235,0.08);
    color: #2CD6EB;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 18px;
  }

  /* ── Items ── */
  .receipt-items {
    margin-bottom: 16px;
  }
  .receipt-items-header {
    display: grid;
    grid-template-columns: 1fr 40px 80px;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 6px;
    font-size: 10px;
    font-weight: 700;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .receipt-items-right {
    text-align: right;
  }
  .receipt-item-row {
    display: grid;
    grid-template-columns: 1fr 40px 80px;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.02);
  }
  .receipt-item-row:last-child {
    border-bottom: none;
  }
  .receipt-item-name {
    font-size: 13px;
    font-weight: 600;
    color: #d1d5db;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .receipt-item-qty {
    font-size: 12px;
    color: #6b7280;
    text-align: center;
  }
  .receipt-item-price {
    font-size: 13px;
    font-weight: 600;
    color: #d1d5db;
    text-align: right;
    font-family: monospace;
  }

  /* ── Totals ── */
  .receipt-totals {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .receipt-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
  }
  .receipt-total-final {
    padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin-top: 4px;
    font-size: 15px;
    font-weight: 800;
    color: #f3f4f6;
  }
  .receipt-total-final span:last-child {
    color: #34d399;
  }

  /* ── Footer ── */
  .receipt-footer-msg {
    text-align: center;
    margin-bottom: 16px;
  }
  .receipt-footer-title {
    font-size: 14px;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0 0 6px;
  }
  .receipt-footer-desc {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }

  /* ── Powered by ── */
  .receipt-powered {
    text-align: center;
    font-size: 10px;
    color: #374151;
    margin-top: 8px;
  }
  .receipt-powered strong {
    color: #4b5563;
  }

  /* ── Done button ── */
  .receipt-done-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 12px 0;
    border-radius: 10px;
    background: #FA6131;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: background .15s;
  }
  .receipt-done-btn:hover {
    background: #e04e1f;
  }
`;

export default OrderSuccess;
