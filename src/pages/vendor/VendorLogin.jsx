import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Phone, KeyRound, Loader2, MessageCircle } from 'lucide-react';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { getApiErrorMessage } from '../../services/api';

const VendorLogin = () => {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login, vendorToken } = useVendorAuth();
  const navigate = useNavigate();

  if (vendorToken) {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { pin };
      if (loginMethod === 'phone') {
        payload.phone_number = identifier.replace(/\s/g, '');
      } else {
        payload.telegram_chat_id = identifier.replace(/\s/g, '');
      }
      await login(payload);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid credentials. Please check your details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#171B26] text-white">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 w-full max-w-md mx-auto">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-3xl font-extrabold text-[#FA6131]">B<span className="text-[#2CD6EB]">A</span></span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Vendor Portal</h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to manage your daily orders and menu availability.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method Toggle */}
          <div className="flex bg-[#1e2333] p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => { setLoginMethod('phone'); setIdentifier(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-[#FA6131] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('telegram'); setIdentifier(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${loginMethod === 'telegram' ? 'bg-[#2CD6EB] text-gray-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Telegram
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                {loginMethod === 'phone' ? 'Phone Number' : 'Telegram ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  {loginMethod === 'phone' ? <Phone size={20} /> : <MessageCircle size={20} />}
                </div>
                <input
                  type={loginMethod === 'phone' ? 'tel' : 'text'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#1e2333] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#FA6131] focus:ring-1 focus:ring-[#FA6131]/50 transition-all"
                  placeholder={loginMethod === 'phone' ? "e.g. 2348012345678" : "e.g. 123456789"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">4-Digit PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <KeyRound size={20} />
                </div>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-[#1e2333] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-2xl tracking-[0.5em] text-center text-white placeholder-gray-600 focus:outline-none focus:border-[#FA6131] focus:ring-1 focus:ring-[#FA6131]/50 transition-all"
                  placeholder="••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || identifier.length < 5 || pin.length < 4}
            className="w-full bg-gradient-to-r from-[#FA6131] to-[#e04e1f] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#FA6131]/20 flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorLogin;
