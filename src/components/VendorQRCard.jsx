import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, Copy, Check, Loader2, MessageCircle } from 'lucide-react';
import { publicService } from '../services/publicService';
import { resolveAssetUrl } from '../services/api';

// ─── Canvas Card Dimensions ─────────────────────────────────────────────
const CARD_W = 600;
const CARD_H = 820;

/**
 * Draws the Bukka AI branded QR card onto a canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {object} opts - { vendorName, slug, qrImageUrl, logoUrl, waUrl, whatsappNumber }
 */
async function drawQRCard(canvas, { vendorName, slug, qrImageUrl, logoUrl, waUrl }) {
  const ctx = canvas.getContext('2d');
  canvas.width  = CARD_W;
  canvas.height = CARD_H;

  const CORNER = 32;

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = '#171B26';
  roundRect(ctx, 0, 0, CARD_W, CARD_H, CORNER);
  ctx.fill();

  // ── Top gradient stripe ─────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, CARD_W, 160);
  grad.addColorStop(0, '#FA6131');
  grad.addColorStop(1, '#d44520');
  ctx.fillStyle = grad;
  roundRectTop(ctx, 0, 0, CARD_W, 160, CORNER);
  ctx.fill();

  // ── Decorative dots (top-right) ─────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      ctx.beginPath();
      ctx.arc(CARD_W - 55 + c * 14, 25 + r * 14, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Logo image ──────────────────────────────────────────────────────────
  try {
    const logo = await loadImage(logoUrl);
    const logoH = 54;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.filter = 'grayscale(100%) brightness(200%)';
    ctx.drawImage(logo, 32, 53, logoW, logoH);
    ctx.filter = 'none';
  } catch {
    // Fallback text if logo fails
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText('bukka ai', 36, 100);
  }

  // ── "THE CRM" subtext ────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `bold 10px Inter, system-ui, sans-serif`;
  ctx.letterSpacing = '4px';
  ctx.fillText('THE CRM', 38, 125);
  ctx.letterSpacing = '0px';

  // ── Vendor name ─────────────────────────────────────────────────────────
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 32px Inter, system-ui, sans-serif`;
  ctx.fillText(truncate(ctx, vendorName || 'Vendor Store', CARD_W - 70), 34, 200);

  // ── "Order Now" label ───────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = `500 15px Inter, system-ui, sans-serif`;
  ctx.fillText('Scan to place your order', 34, 228);

  // ── QR Code ─────────────────────────────────────────────────────────────
  const QR_SIZE = 360;
  const QR_X = (CARD_W - QR_SIZE) / 2;
  const QR_Y = 260;

  // QR background (white inset)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 24;
  roundRect(ctx, QR_X - 16, QR_Y - 16, QR_SIZE + 32, QR_SIZE + 32, 20);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw QR image
  try {
    const qrImg = await loadImage(qrImageUrl);
    ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
  } catch {
    ctx.fillStyle = '#FA6131';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('QR unavailable', QR_X + 20, QR_Y + QR_SIZE / 2);
  }

  // ── URL pill below QR ───────────────────────────────────────────────────
  const PILL_Y = QR_Y + QR_SIZE + 40;

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, 40, PILL_Y, CARD_W - 80, 44, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2CD6EB';
  ctx.font = `600 13px Inter, system-ui, monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(`bukkaai.com.ng/order/${slug}`, CARD_W / 2, PILL_Y + 27);
  ctx.textAlign = 'left';

  // ── WhatsApp prompt ─────────────────────────────────────────────────────
  const WA_Y = PILL_Y + 64;

  ctx.fillStyle = 'rgba(37,211,102,0.12)';
  ctx.strokeStyle = 'rgba(37,211,102,0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, 40, WA_Y, CARD_W - 80, 56, 12);
  ctx.fill();
  ctx.stroke();

  // WhatsApp icon circle
  ctx.fillStyle = '#25D366';
  ctx.beginPath();
  ctx.arc(78, WA_Y + 28, 16, 0, Math.PI * 2);
  ctx.fill();

  // "W" placeholder icon
  ctx.fillStyle = '#fff';
  ctx.font = `bold 14px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('W', 78, WA_Y + 33);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#fff';
  ctx.font = `600 12px Inter, system-ui, sans-serif`;
  ctx.fillText('Order via WhatsApp', 106, WA_Y + 23);

  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `400 11px Inter, system-ui, sans-serif`;
  ctx.fillText('Tap the QR or visit the URL above', 106, WA_Y + 40);

  // ── Footer ──────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = `500 11px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Powered by Bukka AI  ·  bukkaai.com.ng', CARD_W / 2, CARD_H - 26);
  ctx.textAlign = 'left';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundRectTop(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function truncate(ctx, text, maxWidth) {
  let str = text;
  while (ctx.measureText(str).width > maxWidth && str.length > 4) {
    str = str.slice(0, -1);
  }
  return str.length < text.length ? str + '…' : str;
}

// ─── Component ────────────────────────────────────────────────────────────────

const VendorQRCard = ({ slug, vendorName, onClose }) => {
  const canvasRef = useRef(null);
  const [status, setStatus]       = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg]   = useState('');
  const [copied, setCopied]       = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrContentUrl, setQrContentUrl] = useState('');

  const storeUrl  = `https://bukkaai.com.ng/order/${slug}`;

  const renderCard = useCallback(async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const qrData = await publicService.getVendorQR(slug);
      const qrImageUrl = resolveAssetUrl(qrData?.qr_image_url);
      if (!qrImageUrl) throw new Error('QR image URL is missing from the server response.');

      const entryUrl = qrData?.entry_url || storeUrl;
      setQrContentUrl(entryUrl);

      const logoUrl = `${window.location.origin}/bukkaai-logo-light.png`;
      await drawQRCard(canvasRef.current, {
        vendorName,
        slug,
        qrImageUrl,
        logoUrl,
        waUrl: storeUrl,
      });
      setStatus('ready');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate QR card.');
      setStatus('error');
    }
  }, [slug, vendorName, storeUrl]);

  useEffect(() => {
    renderCard();
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [renderCard]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      canvasRef.current.toBlob((blob) => {
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `${(vendorName || slug).toLowerCase().replace(/\s+/g, '-')}-bukkaai-qr-card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrContentUrl || storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Order from ${vendorName} on Bukka AI 🍽️\n${storeUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#171B26] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 w-full max-w-xl flex flex-col max-h-[95vh] z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div>
            <h3 className="font-extrabold text-white text-base">QR Card</h3>
            <p className="text-gray-500 text-xs mt-0.5">{vendorName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X size={17} />
          </button>
        </div>

        {/* Canvas preview */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center gap-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 w-full">
              <Loader2 size={28} className="animate-spin text-[#FA6131]" />
              <p className="text-sm text-gray-500">Generating your branded card...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5 text-center w-full">
              <p className="font-bold text-sm mb-2">Failed to generate card</p>
              <p className="text-xs mb-4">{errorMsg}</p>
              <button
                onClick={renderCard}
                className="px-5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* The canvas — hidden while loading */}
          <canvas
            ref={canvasRef}
            className={`rounded-2xl w-full shadow-xl transition-opacity duration-300 ${status === 'ready' ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}
            style={{ maxWidth: `${CARD_W}px`, aspectRatio: `${CARD_W}/${CARD_H}` }}
          />
        </div>

        {/* Action Buttons */}
        <div className="p-5 pt-0 border-t border-white/5 space-y-3 shrink-0">
          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={status !== 'ready' || downloading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FA6131] to-[#e04e1f] hover:from-[#ff7040] hover:to-[#FA6131] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#FA6131]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download PNG Card
          </button>

          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 hover:border-[#25D366]/40 text-[#25D366] py-2.5 rounded-xl font-bold text-xs transition-all"
            >
              <MessageCircle size={15} />
              Share on WhatsApp
            </button>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center justify-center gap-2 border py-2.5 rounded-xl font-bold text-xs transition-all ${
                copied
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy QR Link</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorQRCard;
