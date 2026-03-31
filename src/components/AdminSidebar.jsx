import React from 'react';
import { LayoutDashboard, Users, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ children }) => {
  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      path: "/admin/vendors",
      name: "Vendors",
      icon: <Users size={20} />
    },
    {
      path: "/admin/onboard",
      name: "Onboard Vendor",
      icon: <UserPlus size={20} />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold" style={{ color: '#128C7E' }}>Bukka AI</h1>
          <h2 className="text-sm font-semibold text-gray-500">Admin Panel</h2>
        </div>
        <nav className="mt-5">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center mt-4 py-2 px-6 ${
                  isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              <span className="mx-3">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
};

export default AdminSidebar;
