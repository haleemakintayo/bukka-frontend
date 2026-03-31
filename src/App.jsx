import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import LandingNavbar from './components/LandingNavbar';
import AdminSidebar from './components/AdminSidebar';
import './App.css';

// Page Components
import LandingPage from './pages/public/LandingPage';
import VendorList from './pages/VendorList';
import OnboardVendorForm from './pages/OnboardVendorForm';
import AdminDashboard from './pages/AdminDashboard';

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
    <Routes>
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="onboard" element={<OnboardVendorForm />} />
      </Route>
    </Routes>
  );
}

export default App;
