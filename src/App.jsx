import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingNavbar from './components/LandingNavbar';
import AdminSidebar from './components/AdminSidebar';
import './App.css';

// Admin Page Components
import LandingPage from './pages/public/LandingPage';
import VendorList from './pages/VendorList';
import OnboardVendorForm from './pages/OnboardVendorForm';
import AdminDashboard from './pages/AdminDashboard';

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

// Layout for the admin section
const AdminLayout = () => (
  <AdminSidebar>
    <Outlet />
  </AdminSidebar>
);

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        
        {/* Student Flow (No navbar layout to maximize mobile screen real-estate) */}
        <Route path="/order/:vendor_id" element={<VendorMenu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorList />} />
          <Route path="onboard" element={<OnboardVendorForm />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
