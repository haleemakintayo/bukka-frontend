import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageCircle, LogOut, LayoutDashboard, Menu, X, Layers, CreditCard, BarChart2, Wallet } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      path: "/admin/onboard",
      name: "Onboard Vendor",
      icon: <UserPlus size={20} />
    },
    {
      path: "/admin/vendors",
      name: "Vendor Directory",
      icon: <Users size={20} />
    },
    {
      path: "/admin/catalog",
      name: "Master Catalog",
      icon: <Layers size={20} />
    },
    {
      path: "/admin/transactions",
      name: "Order Audit",
      icon: <CreditCard size={20} />
    },
    {
      path: "/admin/analytics",
      name: "Advanced Analytics",
      icon: <BarChart2 size={20} />
    },
    {
      path: "/admin/payouts",
      name: "Float & Payouts",
      icon: <Wallet size={20} />
    },
    {
      path: "/admin/chat",
      name: "Chat Prototype",
      icon: <MessageCircle size={20} />
    }
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('admin_access_token');
    sessionStorage.removeItem('admin_refresh_token');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <img
            src="/bukkaai-logo-light.png"
            alt="Bukka AI"
            className="h-10 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-white tracking-tight leading-none">bukka ai</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">the crm</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-white/5 my-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 flex flex-col">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-[#FA6131]/15 to-[#FA6131]/5 text-[#FA6131] shadow-sm shadow-[#FA6131]/5 border border-[#FA6131]/10'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="ml-3">{item.name}</span>
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto mb-4 flex items-center py-3 px-4 rounded-xl transition-all duration-200 font-medium text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent w-full text-left"
        >
          <LogOut size={20} />
          <span className="ml-3">Log Out</span>
        </button>
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-[#0f1118] text-white">
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <div className="hidden md:flex w-[260px] bg-[#171B26] border-r border-white/5 flex-col shrink-0">
        <SidebarContent />
      </div>

      {/* ── Mobile Top Bar ─────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#171B26]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-2.5">
          <img src="/bukkaai-logo-light.png" alt="Bukka AI" className="h-8 w-auto" />
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">bukka ai</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">the crm</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/5"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ─────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#171B26] shadow-2xl shadow-black/50 flex flex-col animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Main Content ───────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-[#0f1118] md:bg-[#0f1118]">
        <div className="pt-20 md:pt-0">
          <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSidebar;
