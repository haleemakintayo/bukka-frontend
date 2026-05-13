import React, { useState, useEffect } from 'react';
import { vendorService } from '../../services/vendorService';
import { getApiErrorMessage } from '../../services/api';
import { Loader2, TrendingUp, ShoppingBag, Clock } from 'lucide-react';

const VendorDashboard = () => {
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
        setOrders(ordersData);
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
      <div className="flex h-full items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#FA6131]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/20 rounded-xl text-sm font-bold">Retry</button>
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

  return (
    <div className="p-4 space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FA6131] to-[#e04e1f] rounded-3xl p-6 shadow-xl shadow-[#FA6131]/20">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <TrendingUp size={100} className="transform translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
          <p className="text-white/80 font-semibold uppercase tracking-wider text-xs mb-1">Tomorrow's Payout</p>
          <h2 className="text-4xl font-extrabold text-white mb-6">
            {formatMoney(dashboard?.pending_payout)}
          </h2>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md self-start w-max px-3 py-1.5 rounded-full border border-white/20">
            <ShoppingBag size={14} className="text-white" />
            <span className="text-sm font-bold text-white">{dashboard?.orders_count || 0} Orders Today</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 px-1">Today's Live Orders</h3>
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-[#1e2333] border border-white/5 rounded-3xl">
            <ShoppingBag size={48} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 font-medium">No orders yet today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id || order.order_id} className="bg-[#1e2333] border border-white/5 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs font-bold text-[#2CD6EB] mb-1">#{String(order.order_id || order.id || '').toUpperCase()}</p>
                    <h4 className="text-white font-bold">{order.customer_name || 'Customer'}</h4>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-extrabold text-white">{formatMoney(order.total_amount || order.total_price)}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock size={12} />
                      {fmtTime(order.created_at)}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                      <span><span className="text-gray-500 font-bold mr-2">{item.quantity}x</span> {item.menu_item_name}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    order.payment_status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {order.payment_status || 'PENDING'}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
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
