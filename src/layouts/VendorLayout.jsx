import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { Home, LayoutList, LogOut } from 'lucide-react';
import { useVendorAuth } from '../context/VendorAuthContext';

const VendorLayout = () => {
  const { vendorToken, logout } = useVendorAuth();

  if (!vendorToken) {
    return <Navigate to="/vendor/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#171B26] text-white overflow-hidden pb-[72px]">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-[#1e2333] border-b border-white/10 shrink-0">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Vendor <span className="text-[#FA6131]">Portal</span></h1>
        <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-[#1e2333] border-t border-white/10 flex items-center justify-around pb-safe z-50 shadow-2xl">
        <NavLink
          to="/vendor/dashboard"
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${
              isActive ? 'text-[#2CD6EB]' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <Home size={24} />
          <span className="text-[10px] font-bold tracking-wider uppercase">Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/vendor/menu"
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${
              isActive ? 'text-[#FA6131]' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <LayoutList size={24} />
          <span className="text-[10px] font-bold tracking-wider uppercase">Menu</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default VendorLayout;
