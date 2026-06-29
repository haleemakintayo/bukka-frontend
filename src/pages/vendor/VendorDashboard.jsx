import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import { Loader2, TrendingUp, ShoppingBag, Clock, LayoutList, ArrowRight, Wallet, Package } from 'lucide-react';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, ordersData] = await Promise.all([
          vendorService.getDashboard(),
          vendorService.getOrders()
        ]);
        setDashboard(dashData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load dashboard data.'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#FA6131]" />
          <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const fmtTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-4xl mx-auto pb-24">
      {/* ── Greeting ─────────────────────────── */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          {getGreeting()} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">Here's your store overview for today.</p>
      </div>

      {/* ── Hero Payout Card ─────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FA6131] to-[#d44520] rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-xl shadow-[#FA6131]/15">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Wallet size={90} className="transform translate-x-3 -translate-y-3" />
        </div>
        <div className="relative z-10">
          <p className="text-white/70 font-semibold uppercase tracking-wider text-[10px] md:text-xs mb-1.5">
            Today's Payout
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
            {formatMoney(dashboard?.pending_payout)}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <ShoppingBag size={13} className="text-white" />
              <span className="text-xs font-bold text-white">{dashboard?.orders_count || 0} Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/vendor/menu')}
          className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FA6131]/20 hover:bg-[#FA6131]/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FA6131]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <LayoutList size={20} className="text-[#FA6131]" />
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Manage Menu</span>
        </button>
        <button
          onClick={() => navigate('/vendor/menu')}
          className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#2CD6EB]/20 hover:bg-[#2CD6EB]/5 transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2CD6EB]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package size={20} className="text-[#2CD6EB]" />
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Add Item</span>
        </button>
      </div>

      {/* ── Orders List ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-base md:text-lg font-bold text-white">Today's Orders</h3>
          {orders.length > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
              {orders.length} total
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No orders yet today.</p>
            <p className="text-gray-600 text-xs mt-1">They'll appear here in real time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id || order.order_id}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
              >
                {/* Order header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#2CD6EB] tracking-wider mb-0.5">
                      #{String(order.order_id || order.id || '').toUpperCase()}
                    </p>
                    <h4 className="text-white font-bold text-sm">{order.customer_name || 'Customer'}</h4>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-base md:text-lg font-extrabold text-white">
                      {formatMoney(order.total_amount || order.total_price)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600 mt-0.5">
                      <Clock size={10} />
                      {fmtTime(order.created_at)}
                    </div>
                  </div>
                </div>

                {/* Order items */}
                {order.items && order.items.length > 0 && (
                  <div className="text-sm text-gray-400 mb-3 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          <span className="text-gray-600 font-bold mr-1.5">{item.quantity}×</span>
                          {item.menu_item_name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status badges */}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    order.payment_status === 'PAID'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {order.payment_status || 'PENDING'}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#2CD6EB]/10 text-[#2CD6EB] border border-[#2CD6EB]/20 uppercase tracking-wider">
                    {order.status || 'Received'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
