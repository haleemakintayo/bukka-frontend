import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingNavbar from './components/LandingNavbar';
import LandingFooter from './components/LandingFooter';
import AdminSidebar from './components/AdminSidebar';
import './App.css';

// Admin Page Components
import LandingPage from './pages/public/LandingPage';
import VendorList from './pages/VendorList';
import OnboardVendorForm from './pages/OnboardVendorForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ChatPrototype from './pages/ChatPrototype';
import VendorDetails from './pages/VendorDetails';
import VendorOnboardingGuide from './pages/public/VendorOnboardingGuide';
import PrivacyPolicy from './pages/public/PrivacyPolicy';

// Vendor PWA Components
import { VendorAuthProvider } from './context/VendorAuthContext';
import VendorLayout from './layouts/VendorLayout';
import VendorLogin from './pages/vendor/VendorLogin';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMenuManager from './pages/vendor/VendorMenuManager';

// Student Page Components
import VendorMenu from './pages/public/VendorMenu';
import Checkout from './pages/public/Checkout';
import OrderSuccess from './pages/public/OrderSuccess';

// Layout for the public-facing pages
const LandingLayout = () => (
  <>
    <LandingNavbar />
    <Outlet />
    <LandingFooter />
  </>
);

// Protected Layout for the admin section
const AdminLayout = () => {
  const token = sessionStorage.getItem('admin_access_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminSidebar>
      <Outlet />
    </AdminSidebar>
  );
};

// Vendor App Wrapper
const VendorApp = () => (
  <VendorAuthProvider>
    <Outlet />
  </VendorAuthProvider>
);

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="guide" element={<VendorOnboardingGuide />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
        </Route>
        
        {/* Student Flow (No navbar layout to maximize mobile screen real-estate) */}
        <Route path="/order/:vendorSlug" element={<VendorMenu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

        {/* Vendor Flow (Mobile PWA) */}
        <Route path="/vendor" element={<VendorApp />}>
          <Route path="login" element={<VendorLogin />} />
          <Route element={<VendorLayout />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="menu" element={<VendorMenuManager />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorList />} />
          <Route path="vendors/:id" element={<VendorDetails />} />
          <Route path="onboard" element={<OnboardVendorForm />} />
          <Route path="chat" element={<ChatPrototype />} />
          {/* Redirect to dashboard by default */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
