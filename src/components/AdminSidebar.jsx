import React from 'react';
import { Users, UserPlus, MessageCircle, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = ({ children }) => {
  const navigate = useNavigate();
  const menuItems = [
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
      path: "/admin/chat",
      name: "Chat Prototype",
      icon: <MessageCircle size={20} />
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-bukka-dark-surface text-gray-900 dark:text-bukka-soft-white transition-colors duration-300">
      <div className="w-72 bg-white dark:bg-bukka-card-surface shadow-sm border-r border-gray-100 dark:border-gray-800 flex flex-col transition-colors duration-300">
        <div className="p-8 pb-4">
          <img src="/bukkaai-logo-dark.png" alt="Bukka AI" className="h-10 md:h-12 w-auto mb-2 dark:brightness-200 dark:grayscale transition-all" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mt-4">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 flex flex-col">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-bukka-orange/10 dark:bg-bukka-dark-surface text-bukka-orange dark:text-bukka-cyan' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-bukka-dark-surface/50 hover:text-gray-900 dark:hover:text-bukka-soft-white'
                }`
              }
            >
              {item.icon}
              <span className="ml-4">{item.name}</span>
            </NavLink>
          ))}
          
          <button
            onClick={handleLogout}
            className="mt-auto mb-4 flex items-center py-3 px-4 rounded-xl transition-all font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 w-full text-left"
          >
            <LogOut size={20} />
            <span className="ml-4">Log Out</span>
          </button>
        </nav>
      </div>
      <main className="flex-1 overflow-y-auto px-10 py-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminSidebar;
