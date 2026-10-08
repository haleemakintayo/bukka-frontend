import React, { useState, useEffect } from 'react';
import {
  Bike,
  MapPin,
  Clock,
  Power,
  CreditCard,
  Settings,
  ShieldCheck,
  Building2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import VendorRidersManager from '../../components/vendor/VendorRidersManager';
import CampusDeliveryManager from '../../components/vendor/CampusDeliveryManager';
import StoreSettingsWidget from '../../components/vendor/StoreSettingsWidget';
import StoreStatusWidget from '../../components/vendor/StoreStatusWidget';
import { vendorService } from '../../services/vendorService';

const VendorSettings = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'riders' | 'delivery' | 'hours' | 'status' | 'banking'
  const [settlement, setSettlement] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    vendorService.getTodaySettlement().then(setSettlement).catch(() => {});
  }, [refreshKey]);

  const tabs = [
    { id: 'all', label: 'All Settings', icon: Settings },
    { id: 'riders', label: 'Dispatch Fleet', icon: Bike },
    { id: 'delivery', label: 'Campus Delivery', icon: MapPin },
    { id: 'hours', label: 'Hours & Pack', icon: Clock },
    { id: 'status', label: 'Availability', icon: Power },
    { id: 'banking', label: 'Banking & Payouts', icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 pb-24">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FA6131]/15 text-[#FA6131] flex items-center justify-center">
            <Settings size={18} />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Store Settings & Operations
          </h2>
        </div>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Configure your dispatch riders, campus delivery pricing, operating hours, and settlement accounts.
        </p>
      </div>

      {/* ── Tabs Navigation Bar ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <IconComponent size={14} className={isActive ? 'text-[#2CD6EB]' : 'text-gray-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Settings Content Sections ── */}
      <div className="space-y-6">
        {/* 1. Dispatch Fleet (Riders) */}
        {(activeTab === 'all' || activeTab === 'riders') && (
          <section id="riders" className="space-y-2">
            <VendorRidersManager onRidersUpdated={() => setRefreshKey((k) => k + 1)} />
          </section>
        )}

        {/* 2. Campus Delivery Zones & Toggles */}
        {(activeTab === 'all' || activeTab === 'delivery') && (
          <section id="delivery" className="space-y-2">
            <CampusDeliveryManager onSettingsUpdated={() => setRefreshKey((k) => k + 1)} />
          </section>
        )}

        {/* 3. Operating Hours, Alerts & Packaging */}
        {(activeTab === 'all' || activeTab === 'hours') && (
          <section id="hours" className="space-y-2">
            <StoreSettingsWidget onSettingsSaved={() => setRefreshKey((k) => k + 1)} />
          </section>
        )}

        {/* 4. Store Availability & Pause Control */}
        {(activeTab === 'all' || activeTab === 'status') && (
          <section id="status" className="space-y-2">
            <div className="bg-[#171B26] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Power size={16} className="text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">Store Availability & Rush Controls</h3>
              </div>
              <p className="text-xs text-gray-400">
                Open, close, or temporarily pause your kitchen during lunch rushes. When paused, customers on WhatsApp are notified and orders are queued.
              </p>
              <StoreStatusWidget externalRefreshKey={refreshKey} onStatusChanged={() => setRefreshKey((k) => k + 1)} />
            </div>
          </section>
        )}

        {/* 5. Banking & Paystack Settlement Overview */}
        {(activeTab === 'all' || activeTab === 'banking') && (
          <section id="banking" className="space-y-2">
            <div className="bg-[#171B26] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Banking & Paystack Settlements</h3>
                    <p className="text-[11px] text-gray-400">Verified bank transfer destination for customer payments</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck size={11} />
                  Split Transfers Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Account Details */}
                <div className="bg-[#0F1219] border border-white/10 rounded-2xl p-4 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Disbursement Account
                  </p>
                  <p className="text-sm font-extrabold text-white">
                    {settlement?.bank_account_summary || 'Verified Bank Account'}
                  </p>
                  <p className="text-xs text-gray-400">
                    All student online card and bank transfer payments are batched directly to this account.
                  </p>
                </div>

                {/* Transfer Schedule */}
                <div className="bg-[#0F1219] border border-white/10 rounded-2xl p-4 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Automatic Payout Schedule
                  </p>
                  <p className="text-sm font-extrabold text-white">
                    {settlement?.next_settlement_label || 'Daily at 06:00 PM WAT'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Verified transactions are tallied continuously and settled directly by Paystack end-of-day.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default VendorSettings;
