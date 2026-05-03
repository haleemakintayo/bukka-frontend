import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { adminLogin, getApiErrorMessage } from '../services/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedUsername = formData.username.trim();
    const trimmedPassword = formData.password;

    if (!trimmedUsername || !trimmedPassword) {
      setError('Both username and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await adminLogin({ username: trimmedUsername, password: trimmedPassword });
      const { access_token } = response;

      if (access_token) {
        sessionStorage.setItem('admin_token', access_token);
        navigate('/admin/dashboard');
      } else {
        setError('Login succeeded but no access token was returned.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(getApiErrorMessage(err, 'Invalid credentials or server error.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#171B26]">
      {/* ── Left Panel: Brand Art ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#FA6131] opacity-10 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-24 w-[400px] h-[400px] rounded-full bg-[#2CD6EB] opacity-10 blur-3xl animate-pulse delay-1000" />
          <div className="absolute -bottom-24 left-1/3 w-[350px] h-[350px] rounded-full bg-[#FA6131] opacity-5 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(44,214,235,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(44,214,235,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2CD6EB] uppercase tracking-widest mb-8">
            <Zap size={12} className="fill-[#2CD6EB]" />
            Admin Portal
          </div>

          <img
            src="/bukkaai-logo-dark.png"
            alt="Bukka AI"
            className="h-14 mx-auto mb-8 brightness-200 grayscale"
          />

          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Manage your <span className="text-[#FA6131]">vendors.</span>
            <br />
            Power your <span className="text-[#2CD6EB]">platform.</span>
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed">
            The Bukka AI admin panel gives you full control over vendor onboarding, menu management, and platform operations.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Vendors', value: '140+' },
              { label: 'Orders', value: '12k+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-sm"
              >
                <p className="text-xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ───────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative">
        {/* Mobile background blobs */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FA6131] opacity-10 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-60 h-60 rounded-full bg-[#2CD6EB] opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/bukkaai-logo-dark.png"
              alt="Bukka AI"
              className="h-10 mx-auto mb-2 brightness-200 grayscale"
            />
          </div>

          {/* Card */}
          <div className="bg-[#262C3A] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-gray-400 mt-1.5">
                Sign in to your admin account
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="admin-username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                  autoComplete="username"
                  placeholder="e.g. headchef"
                  className="w-full bg-[#171B26] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="admin-password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-[#171B26] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2CD6EB] focus:ring-1 focus:ring-[#2CD6EB]/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2CD6EB] transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="admin-login-btn"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#FA6131] to-[#e04e1f] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FA6131]/20 hover:shadow-[#FA6131]/40 hover:from-[#ff7040] hover:to-[#FA6131] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Admin access only · Contact your system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
