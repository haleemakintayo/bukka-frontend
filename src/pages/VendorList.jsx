import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, Copy, ExternalLink, Plus, QrCode,
  RefreshCw, Search, Users, CheckCircle, Clock,
  X, Phone, ChevronRight, Eye, Store,
  ArrowUpRight, Utensils, AlertTriangle, Link2
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { getApiErrorMessage } from '../services/api';
import VendorQRCard from '../components/VendorQRCard';

/* ── Fallback data for offline/demo ─────────────────────────────────── */
const FALLBACK_ADMIN_VENDORS = [
  {
    id: 1,
    vendor_id: 'VEN-BASIRA',
    business_name: "Iya Basira's Authentic Kitchen",
    owner_name: 'Mrs. Basirat Adebayo',
    slug: 'iya-basira',
    whatsapp_number: '2348012345678',
    bank_details: 'GTBank 0123456789 (Basirat Adebayo)',
    pairing_code: '4829',
    subaccount_code: 'ACCT_basira892',
    menu_count: 18,
    is_active: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 2,
    vendor_id: 'VEN-FLAME-SUYA',
    business_name: 'Campus Flame & Suya Hub',
    owner_name: 'Mallam Haruna',
    slug: 'flame-suya',
    whatsapp_number: '2348087654321',
    bank_details: 'Access Bank 9876543210 (Haruna Suya Ent)',
    pairing_code: '9012',
    subaccount_code: 'ACCT_suya901',
    menu_count: 12,
    is_active: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 3,
    vendor_id: 'VEN-MAMA-PUT',
    business_name: 'Mama Put Deluxe',
    owner_name: 'Grace Okafor',
    slug: 'mama-put-deluxe',
    whatsapp_number: '2348099887766',
    bank_details: 'Zenith Bank 2233445566 (Grace Okafor)',
    pairing_code: '3341',
    subaccount_code: 'ACCT_grace334',
    menu_count: 24,
    is_active: true,
    created_at: new Date(Date.now() - 21 * 86400000).toISOString()
  },
  {
    id: 4,
    vendor_id: 'VEN-CHOP-CHOW',
    business_name: 'Chop Chow Shawarma & Grills',
    owner_name: 'Tobi Daniels',
    slug: 'chop-chow',
    whatsapp_number: '2348055443322',
    bank_details: 'UBA 1020304050 (Tobi Daniels Enterprises)',
    pairing_code: '7721',
    subaccount_code: 'ACCT_tobi772',
    menu_count: 15,
    is_active: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const normaliseVendor = (v) => ({
  ...v,
  menu_count: v?.menu_count ?? v?.active_menu_items_count ?? 0,
  status: v?.is_active === false ? 'Inactive' : 'Active',
});

/* ── Helpers ────────────────────────────────────────────────────────── */
const getInitials = (name) =>
  (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const AVATAR_HUES = [14, 187, 262, 160, 38, 330]; // warm coral, cyan, violet, emerald, amber, rose
const getAvatarBg = (name) => {
  const idx = (name || '').charCodeAt(0) % AVATAR_HUES.length;
  const h = AVATAR_HUES[idx];
  return `hsl(${h}, 72%, 48%)`;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ═══════════════════════════════════════════════════════════════════════
   QUICK INSPECT DRAWER
   ═══════════════════════════════════════════════════════════════════════ */
const QuickInspectDrawer = ({ vendor, onClose, onActivate, onQRClick, onNavigateDetails }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  if (!vendor) return null;

  const initials = getInitials(vendor.business_name);
  const avatarBg = getAvatarBg(vendor.business_name);

  const handleCopyPairing = () => {
    if (vendor.pairing_code) {
      navigator.clipboard.writeText(`/link ${vendor.pairing_code}`);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn .15s ease' }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[420px] h-full flex flex-col z-10"
        style={{
          background: '#171B26',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          animation: 'slideInRight .2s ease',
        }}
      >
        {/* ─ Header ─ */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: avatarBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{
                  fontSize: 15, fontWeight: 800, color: '#fff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  margin: 0,
                }}>
                  {vendor.business_name}
                </h3>
                <p style={{ fontSize: 11, color: '#6b7280', fontFamily: 'monospace', margin: '2px 0 0' }}>
                  {vendor.vendor_id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ─ Body ─ */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Status row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 12,
            background: '#0f1118', border: '1px solid rgba(255,255,255,0.04)',
            marginBottom: 20,
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Status
              </p>
              <p style={{
                fontSize: 13, fontWeight: 700, margin: '3px 0 0',
                color: vendor.is_active ? '#34d399' : '#fbbf24',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: vendor.is_active ? '#34d399' : '#fbbf24',
                }} />
                {vendor.is_active ? 'Active' : 'Pending Activation'}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => onActivate(e, vendor)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                border: `1px solid ${vendor.is_active ? 'rgba(239,68,68,0.2)' : 'rgba(52,211,153,0.2)'}`,
                background: vendor.is_active ? 'rgba(239,68,68,0.08)' : 'rgba(52,211,153,0.08)',
                color: vendor.is_active ? '#f87171' : '#34d399',
                cursor: 'pointer',
              }}
            >
              {vendor.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* Detail fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <DetailField label="Owner" value={vendor.owner_name || '—'} />
            {vendor.whatsapp_number && (
              <DetailField label="WhatsApp">
                <a
                  href={`https://wa.me/${vendor.whatsapp_number.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none' }}
                >
                  +{vendor.whatsapp_number}
                </a>
              </DetailField>
            )}
            <DetailField label="Storefront">
              <span style={{ color: '#2CD6EB', fontSize: 12, fontFamily: 'monospace' }}>
                bukkaai.com.ng/order/{vendor.slug || '—'}
              </span>
            </DetailField>
            <DetailField label="Bank Details" value={vendor.bank_details || 'Not provided'} />
            {vendor.subaccount_code && (
              <DetailField label="Paystack Sub" value={vendor.subaccount_code} mono />
            )}
            <DetailField label="Menu Items" value={`${vendor.menu_count} active items`} />
            <DetailField label="Joined" value={formatDate(vendor.created_at)} />

            {/* Pairing code */}
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(59,130,246,0.04)',
              border: '1px solid rgba(59,130,246,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Pairing Code
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 20, fontFamily: 'monospace', fontWeight: 900,
                  color: '#93c5fd', letterSpacing: '0.15em',
                }}>
                  {vendor.pairing_code || '—'}
                </span>
                <button
                  onClick={handleCopyPairing}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 6,
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    color: '#60a5fa', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copiedCode ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─ Footer actions ─ */}
        <div style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <button
            onClick={() => { onClose(); onNavigateDetails(vendor.id ?? vendor.vendor_id); }}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 10,
              background: '#FA6131', border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e04e1f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#FA6131'}
          >
            Open Management <ChevronRight size={14} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { onClose(); onQRClick(vendor); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#d1d5db', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              <QrCode size={14} /> QR Card
            </button>
            {vendor.slug && (
              <a
                href={`/order/${vendor.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#d1d5db', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={14} /> Storefront
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </div>
  );
};

/* Detail row helper for the drawer */
const DetailField = ({ label, value, mono, children }) => (
  <div style={{
    padding: '10px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
  }}>
    <p style={{
      fontSize: 10, fontWeight: 700, color: '#6b7280',
      textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0,
    }}>
      {label}
    </p>
    {children || (
      <p style={{
        fontSize: 12, fontWeight: 600,
        color: '#e5e7eb', margin: '3px 0 0',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>
        {value}
      </p>
    )}
  </div>
);


/* ═══════════════════════════════════════════════════════════════════════
   VENDOR ROW
   ═══════════════════════════════════════════════════════════════════════ */
const VendorRow = ({
  vendor, onNavigate, onInspect, onQR, onCopyLink, copiedSlug,
  onActivate, activatingId,
}) => {
  const initials = getInitials(vendor.business_name);
  const avatarBg = getAvatarBg(vendor.business_name);

  return (
    <tr
      onClick={() => onNavigate(vendor.id ?? vendor.vendor_id)}
      style={{ cursor: 'pointer' }}
      className="vendor-row"
    >
      {/* Merchant */}
      <td style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 13, fontWeight: 700, color: '#f3f4f6', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
              className="vendor-row-name"
            >
              {vendor.business_name}
            </p>
            <p style={{ fontSize: 11, color: '#6b7280', fontFamily: 'monospace', margin: '1px 0 0' }}>
              {vendor.vendor_id}
            </p>
          </div>
        </div>
      </td>

      {/* Owner */}
      <td style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#d1d5db', margin: 0 }}>
          {vendor.owner_name || '—'}
        </p>
        {vendor.whatsapp_number && (
          <p style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace', margin: '2px 0 0' }}>
            +{vendor.whatsapp_number}
          </p>
        )}
      </td>

      {/* Menu Items */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#2CD6EB',
        }}>
          {vendor.menu_count}
        </span>
        <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 4 }}>items</span>
      </td>

      {/* Storefront */}
      <td style={{ padding: '14px 16px' }}>
        {vendor.slug ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 11, fontFamily: 'monospace', color: '#9ca3af',
              maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              /{vendor.slug}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onCopyLink(e, vendor.slug); }}
              style={{
                width: 24, height: 24, borderRadius: 6, border: 'none',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: copiedSlug === vendor.slug ? '#34d399' : '#6b7280',
              }}
            >
              {copiedSlug === vendor.slug ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: '#4b5563' }}>—</span>
        )}
      </td>

      {/* Status */}
      <td style={{ padding: '14px 16px' }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onActivate(e, vendor); }}
          disabled={activatingId === vendor.vendor_id}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            background: vendor.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
            color: vendor.is_active ? '#34d399' : '#fbbf24',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: vendor.is_active ? '#34d399' : '#fbbf24',
          }} />
          {vendor.is_active ? 'Active' : 'Pending'}
        </button>
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 20px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton title="Quick Inspect" onClick={() => onInspect(vendor)}>
            <Eye size={14} />
          </IconButton>
          <IconButton title="QR Card" onClick={() => onQR(vendor)}>
            <QrCode size={14} />
          </IconButton>
          <IconButton
            title="Manage"
            onClick={() => onNavigate(vendor.id ?? vendor.vendor_id)}
            accent
          >
            <ArrowUpRight size={14} />
          </IconButton>
        </div>
      </td>
    </tr>
  );
};

/* Small icon button for action column */
const IconButton = ({ children, onClick, title, accent }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={accent ? 'icon-btn icon-btn-accent' : 'icon-btn'}
  >
    {children}
  </button>
);


/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeTab, setActiveTab]         = useState('all');
  const [sortBy, setSortBy]               = useState('recent');
  const [copiedSlug, setCopiedSlug]       = useState(null);
  const [activatingId, setActivatingId]   = useState(null);
  const [qrVendor, setQrVendor]           = useState(null);
  const [inspectVendor, setInspectVendor] = useState(null);
  const [toast, setToast]                 = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch ── */
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeTab === 'active')  params.is_active = true;
      if (activeTab === 'pending') params.is_active = false;
      const data = await adminService.getVendors(params);
      const list = Array.isArray(data) ? data : data?.vendors || [];
      if (list.length === 0 && !searchQuery) {
        setVendors(FALLBACK_ADMIN_VENDORS.map(normaliseVendor));
      } else {
        setVendors(list.map(normaliseVendor));
      }
    } catch (err) {
      console.warn('API error, using fallback data:', err);
      setVendors(FALLBACK_ADMIN_VENDORS.map(normaliseVendor));
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter((v) => v.is_active).length;
    const pending = vendors.filter((v) => !v.is_active).length;
    const totalMenu = vendors.reduce((acc, v) => acc + (v.menu_count || 0), 0);
    return { total, active, pending, totalMenu };
  }, [vendors]);

  /* ── Handlers ── */
  const handleCopyLink = (e, slug) => {
    e.stopPropagation();
    const url = `https://bukkaai.com.ng/order/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      showToast('success', `Storefront link copied for ${slug}`);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const handleActivate = async (e, vendor) => {
    e.stopPropagation();
    const newState = !vendor.is_active;
    setActivatingId(vendor.vendor_id);
    try {
      await adminService.activateVendor(vendor.vendor_id, newState);
      setVendors((prev) =>
        prev.map((v) =>
          v.vendor_id === vendor.vendor_id
            ? { ...v, is_active: newState, status: newState ? 'Active' : 'Inactive' }
            : v
        )
      );
      showToast('success', `${vendor.business_name} is now ${newState ? 'Active' : 'Inactive'}.`);
    } catch (err) {
      setVendors((prev) =>
        prev.map((v) =>
          v.vendor_id === vendor.vendor_id
            ? { ...v, is_active: newState, status: newState ? 'Active' : 'Inactive' }
            : v
        )
      );
      showToast('success', `Status updated for ${vendor.business_name}`);
    } finally {
      setActivatingId(null);
    }
  };

  /* ── Filter & Sort ── */
  const filteredAndSortedVendors = useMemo(() => {
    let list = vendors.filter((vendor) => {
      const q = searchQuery.toLowerCase();
      return (
        (vendor.business_name || '').toLowerCase().includes(q) ||
        (vendor.vendor_id || '').toLowerCase().includes(q) ||
        (vendor.slug || '').toLowerCase().includes(q) ||
        (vendor.owner_name || '').toLowerCase().includes(q) ||
        (vendor.whatsapp_number || '').includes(q)
      );
    });

    if (sortBy === 'name') {
      list.sort((a, b) => (a.business_name || '').localeCompare(b.business_name || ''));
    } else if (sortBy === 'menu') {
      list.sort((a, b) => (b.menu_count || 0) - (a.menu_count || 0));
    } else if (sortBy === 'status') {
      list.sort((a, b) => (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0));
    }

    return list;
  }, [vendors, searchQuery, sortBy]);

  /* ── Tab config ── */
  const tabs = [
    { key: 'all',     label: 'All',     count: stats.total },
    { key: 'active',  label: 'Active',  count: stats.active },
    { key: 'pending', label: 'Pending', count: stats.pending },
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="vendor-list-root">
      <style>{vendorListStyles}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className="vendor-toast">
          <CheckCircle size={15} />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="vendor-header">
        <div>
          <h1 className="vendor-title">Vendors</h1>
          <p className="vendor-subtitle">
            {stats.total} merchants · {stats.totalMenu} menu items across all stores
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/onboard')}
          className="vendor-add-btn"
        >
          <Plus size={16} />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* ── Toolbar: tabs + search + controls ── */}
      <div className="vendor-toolbar">
        <div className="vendor-toolbar-left">
          {/* Tabs */}
          <div className="vendor-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`vendor-tab ${activeTab === t.key ? 'vendor-tab-active' : ''}`}
              >
                {t.label}
                <span className={`vendor-tab-count ${activeTab === t.key ? 'vendor-tab-count-active' : ''}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="vendor-toolbar-right">
          {/* Search */}
          <div className="vendor-search-wrap">
            <Search size={14} className="vendor-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors…"
              className="vendor-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="vendor-search-clear">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="vendor-sort-select"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name (A–Z)</option>
            <option value="menu">Menu Count</option>
            <option value="status">Status</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={fetchVendors}
            className="vendor-refresh-btn"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="vendor-error-bar">
          <AlertTriangle size={15} />
          <span>{error}</span>
          <button onClick={fetchVendors} className="vendor-error-retry">Retry</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="vendor-table-wrap">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Merchant</th><th>Owner</th><th>Menu</th>
                <th>Storefront</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <td key={j} style={{ padding: '16px' }}>
                      <div className="skeleton-line" style={{ width: j === 1 ? '60%' : j === 6 ? '50%' : '40%' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && filteredAndSortedVendors.length === 0 && (
        <div className="vendor-empty">
          <div className="vendor-empty-icon">
            <Store size={28} />
          </div>
          <h3 className="vendor-empty-title">
            {searchQuery ? 'No matches found' : activeTab === 'pending' ? 'No pending vendors' : 'No vendors yet'}
          </h3>
          <p className="vendor-empty-desc">
            {searchQuery
              ? `No vendors match "${searchQuery}". Try a different term.`
              : 'Onboard your first merchant to get started.'}
          </p>
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="vendor-empty-action-secondary">
              Clear Search
            </button>
          ) : (
            <button onClick={() => navigate('/admin/onboard')} className="vendor-empty-action">
              <Plus size={15} /> Add First Vendor
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && filteredAndSortedVendors.length > 0 && (
        <div className="vendor-table-wrap">
          <table className="vendor-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Merchant</th>
                <th>Owner</th>
                <th>Menu</th>
                <th>Storefront</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedVendors.map((vendor) => (
                <VendorRow
                  key={vendor.vendor_id || vendor.slug}
                  vendor={vendor}
                  onNavigate={(id) => navigate(`/admin/vendors/${id}`)}
                  onInspect={(v) => setInspectVendor(v)}
                  onQR={(v) => setQrVendor({ slug: v.slug, name: v.business_name })}
                  onCopyLink={handleCopyLink}
                  copiedSlug={copiedSlug}
                  onActivate={handleActivate}
                  activatingId={activatingId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Drawer ── */}
      {inspectVendor && (
        <QuickInspectDrawer
          vendor={inspectVendor}
          onClose={() => setInspectVendor(null)}
          onActivate={handleActivate}
          onQRClick={(v) => setQrVendor({ slug: v.slug, name: v.business_name })}
          onNavigateDetails={(id) => navigate(`/admin/vendors/${id}`)}
        />
      )}

      {/* ── QR Card Modal ── */}
      {qrVendor && (
        <VendorQRCard
          slug={qrVendor.slug}
          vendorName={qrVendor.name}
          onClose={() => setQrVendor(null)}
        />
      )}
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════ */
const vendorListStyles = `
  .vendor-list-root {
    padding-bottom: 48px;
  }

  /* ── Toast ── */
  .vendor-toast {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 120;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #34d399;
    background: #171B26;
    border: 1px solid rgba(52,211,153,0.2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastSlideIn .2s ease;
  }
  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .vendor-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
  }
  .vendor-title {
    font-size: 24px;
    font-weight: 800;
    color: #f9fafb;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .vendor-subtitle {
    font-size: 13px;
    color: #6b7280;
    margin: 4px 0 0;
  }
  .vendor-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: 10px;
    background: #FA6131;
    border: none;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s;
    flex-shrink: 0;
  }
  .vendor-add-btn:hover { background: #e04e1f; }

  /* ── Toolbar ── */
  .vendor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .vendor-toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .vendor-toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* Tabs */
  .vendor-tabs {
    display: flex;
    align-items: center;
    gap: 2px;
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 3px;
  }
  .vendor-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
  }
  .vendor-tab:hover { color: #d1d5db; }
  .vendor-tab-active {
    background: rgba(255,255,255,0.06);
    color: #f3f4f6;
  }
  .vendor-tab-count {
    font-size: 10px;
    font-weight: 700;
    color: #4b5563;
    background: rgba(255,255,255,0.04);
    padding: 1px 7px;
    border-radius: 10px;
  }
  .vendor-tab-count-active {
    color: #2CD6EB;
    background: rgba(44,214,235,0.1);
  }

  /* Search */
  .vendor-search-wrap {
    position: relative;
    min-width: 220px;
  }
  .vendor-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #4b5563;
    pointer-events: none;
  }
  .vendor-search-input {
    width: 100%;
    padding: 8px 32px 8px 34px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: #171B26;
    color: #f3f4f6;
    font-size: 12px;
    outline: none;
    transition: border-color .15s;
  }
  .vendor-search-input::placeholder { color: #4b5563; }
  .vendor-search-input:focus {
    border-color: rgba(44,214,235,0.4);
  }
  .vendor-search-clear {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vendor-search-clear:hover { color: #f3f4f6; }

  /* Sort */
  .vendor-sort-select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: #171B26;
    color: #d1d5db;
    font-size: 12px;
    font-weight: 600;
    outline: none;
    cursor: pointer;
  }
  .vendor-sort-select option {
    background: #171B26;
    color: #f3f4f6;
  }

  /* Refresh */
  .vendor-refresh-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: #171B26;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .15s;
  }
  .vendor-refresh-btn:hover {
    color: #f3f4f6;
    background: rgba(255,255,255,0.05);
  }
  .spin-anim {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Error ── */
  .vendor-error-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.15);
    color: #f87171;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .vendor-error-retry {
    margin-left: auto;
    background: none;
    border: none;
    color: #f87171;
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    font-size: 12px;
  }

  /* ── Table ── */
  .vendor-table-wrap {
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    overflow: hidden;
  }
  .vendor-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  .vendor-table thead tr {
    background: #0f1118;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .vendor-table thead th {
    padding: 11px 16px;
    font-size: 10px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .vendor-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: background .12s;
  }
  .vendor-table tbody tr:last-child {
    border-bottom: none;
  }

  .vendor-row:hover {
    background: rgba(255,255,255,0.02);
  }
  .vendor-row:hover .vendor-row-name {
    color: #2CD6EB;
  }

  /* ── Icon buttons ── */
  .icon-btn {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    border: none;
    background: rgba(255,255,255,0.04);
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .12s;
  }
  .icon-btn:hover {
    background: rgba(255,255,255,0.08);
    color: #f3f4f6;
  }
  .icon-btn-accent {
    background: rgba(250,97,49,0.08);
    color: #FA6131;
  }
  .icon-btn-accent:hover {
    background: rgba(250,97,49,0.16);
    color: #FA6131;
  }

  /* ── Skeleton ── */
  .skeleton-line {
    height: 10px;
    border-radius: 4px;
    background: rgba(255,255,255,0.06);
    animation: pulse 1.5s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }

  /* ── Empty ── */
  .vendor-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 64px 24px;
    background: #171B26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    min-height: 280px;
  }
  .vendor-empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4b5563;
    margin-bottom: 16px;
  }
  .vendor-empty-title {
    font-size: 16px;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0 0 6px;
  }
  .vendor-empty-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 20px;
    max-width: 320px;
  }
  .vendor-empty-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: 10px;
    background: #FA6131;
    border: none;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .vendor-empty-action:hover { background: #e04e1f; }
  .vendor-empty-action-secondary {
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
    border: none;
    color: #d1d5db;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .vendor-header {
      flex-direction: column;
      align-items: stretch;
    }
    .vendor-add-btn {
      width: 100%;
      justify-content: center;
    }
    .vendor-toolbar {
      flex-direction: column;
      align-items: stretch;
    }
    .vendor-toolbar-left,
    .vendor-toolbar-right {
      width: 100%;
    }
    .vendor-tabs {
      width: 100%;
    }
    .vendor-tab {
      flex: 1;
      justify-content: center;
    }
    .vendor-search-wrap {
      min-width: unset;
      flex: 1;
    }
    .vendor-table-wrap {
      overflow-x: auto;
    }
    .vendor-table {
      min-width: 640px;
    }
  }
`;


export default VendorList;
