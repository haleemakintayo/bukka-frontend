import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { Home, LayoutList, LogOut, Flame, Wallet } from 'lucide-react';
import { useVendorAuth } from '../context/VendorAuthContext';

const VendorLayout = () => {
  const { vendorToken, logout } = useVendorAuth();

  if (!vendorToken) {
    return <Navigate to="/vendor/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f1118] text-white overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#171B26] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/bukkaai-logo-light.png"
            alt="Bukka AI"
            className="h-8 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">bukka ai</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">vendor portal</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all border border-white/5"
          aria-label="Log out"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#171B26] border-t border-white/5 flex items-stretch z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {/* Dashboard */}
        <NavLink
          to="/vendor/dashboard"
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 flex-1 py-2.5 transition-all duration-200 relative ${
              isActive ? 'text-[#2CD6EB]' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#2CD6EB] rounded-full" />}
              <Home size={20} />
              <span className="text-[9px] font-bold tracking-wider uppercase">Home</span>
            </>
          )}
        </NavLink>

        {/* Orders Queue */}
        <NavLink
          to="/vendor/orders"
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 flex-1 py-2.5 transition-all duration-200 relative ${
              isActive ? 'text-[#FA6131]' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#FA6131] rounded-full" />}
              <Flame size={20} />
              <span className="text-[9px] font-bold tracking-wider uppercase">Orders</span>
            </>
          )}
        </NavLink>
        
        {/* Menu */}
        <NavLink
          to="/vendor/menu"
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 flex-1 py-2.5 transition-all duration-200 relative ${
              isActive ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-emerald-400 rounded-full" />}
              <LayoutList size={20} />
              <span className="text-[9px] font-bold tracking-wider uppercase">Menu</span>
            </>
          )}
        </NavLink>

        {/* Earnings */}
        <NavLink
          to="/vendor/earnings"
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 flex-1 py-2.5 transition-all duration-200 relative ${
              isActive ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-amber-400 rounded-full" />}
              <Wallet size={20} />
              <span className="text-[9px] font-bold tracking-wider uppercase">Earnings</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default VendorLayout;
