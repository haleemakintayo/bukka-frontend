import React, { createContext, useContext, useState, useEffect } from 'react';
import { vendorService } from '../services/vendorService';

const VendorAuthContext = createContext(null);

export const VendorAuthProvider = ({ children }) => {
  const [vendorToken, setVendorToken] = useState(() => localStorage.getItem('vendor_access_token'));
  
  const login = async (payload) => {
    const data = await vendorService.login(payload);
    if (data && data.access_token) {
      localStorage.setItem('vendor_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('vendor_refresh_token', data.refresh_token);
      }
      setVendorToken(data.access_token);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vendor_access_token');
    localStorage.removeItem('vendor_refresh_token');
    setVendorToken(null);
  };

  return (
    <VendorAuthContext.Provider value={{ vendorToken, login, logout }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => useContext(VendorAuthContext);
