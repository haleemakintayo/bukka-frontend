import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingNavbar from './components/LandingNavbar';
import AdminSidebar from './components/AdminSidebar';
import './App.css';

// Admin Page Components
import LandingPage from './pages/public/LandingPage';
import VendorList from './pages/VendorList';
import OnboardVendorForm from './pages/OnboardVendorForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ChatPrototype from './pages/ChatPrototype';

// Student Page Components
import VendorMenu from './pages/public/VendorMenu';
import Checkout from './pages/public/Checkout';
import OrderSuccess from './pages/public/OrderSuccess';

// Layout for the public-facing pages
const LandingLayout = () => (
  <>
    <LandingNavbar />
    <Outlet />
  </>
);

// Protected Layout for the admin section
const AdminLayout = () => {
  const token = sessionStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminSidebar>
      <Outlet />
    </AdminSidebar>
  );
};

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        
        {/* Student Flow (No navbar layout to maximize mobile screen real-estate) */}
        <Route path="/order/:vendorSlug" element={<VendorMenu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorList />} />
          <Route path="onboard" element={<OnboardVendorForm />} />
          <Route path="chat" element={<ChatPrototype />} />
          {/* Redirect to onboard by default for now */}
          <Route index element={<Navigate to="onboard" replace />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
