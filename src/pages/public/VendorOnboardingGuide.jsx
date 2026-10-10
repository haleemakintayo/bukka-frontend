import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Store, 
  MessageSquare, 
  ListPlus, 
  Smartphone, 
  CreditCard, 
  ArrowRight, 
  Copy,
  MessageCircle,
  Package,
  Truck,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorOnboardingGuide() {
  const [copied, setCopied] = useState(false);
  const demoPairingCode = "8f3a9b21";

  const steps = [
    { 
      step: 1, 
      title: "Store Profile & WhatsApp", 
      desc: "Provide your Bukka name, WhatsApp number, and choose your 4-digit dashboard PIN.", 
      icon: <Store className="w-6 h-6 text-[#FA6131]" /> 
    },
    { 
      step: 2, 
      title: "Menu & Campus Delivery", 
      desc: "Set starter food items, hostel delivery fees, and your takeaway container pack fee.", 
      icon: <ListPlus className="w-6 h-6 text-[#2CD6EB]" /> 
    },
    { 
      step: 3, 
      title: "1-Tap WhatsApp Link", 
      desc: "Link our bot to your WhatsApp phone in 1 click to receive instant order alerts.", 
      icon: <MessageCircle className="w-6 h-6 text-green-500" /> 
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(`/link ${demoPairingCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bukka-dark-surface pt-24 pb-12 px-4 md:px-8 font-sans text-gray-900 dark:text-bukka-soft-white transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#FA6131] to-[#e04e1f] rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-[#FA6131]/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm">
              WhatsApp-First Ordering
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Getting Started with Bukka AI
          </h1>
          <p className="text-white/90 max-w-2xl text-base md:text-lg leading-relaxed">
            Welcome! Setting up your digital Bukka takes just 2 minutes. Students order directly 
            through WhatsApp Flows or your digital menu, and you receive instant alerts on WhatsApp with automated daily bank payouts.
          </p>
          <div className="pt-6">
            <Link
              to="/onboard"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-[#FA6131] font-extrabold text-sm shadow-xl hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Launch Your Kitchen Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stepper Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-white dark:bg-bukka-card-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-all">
              <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-2xl flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-[#FA6131] uppercase tracking-wider mb-1">Step {s.step}</p>
                <h3 className="font-bold text-base mb-1 dark:text-bukka-soft-white">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step 1 & 2 Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 space-y-4">
            <div className="w-12 h-12 bg-[#FA6131]/10 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#FA6131]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white">
              1. Profile & Daily Bank Payouts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Enter your business name, WhatsApp operating number, and your <strong>Nigerian Bank Account</strong> (GTBank, Access, Kuda, Opay, Palmpay, Moniepoint, etc.).
              <br/><br/>
              When students pay on WhatsApp, funds are verified in real time and disbursed directly 
              to your account via daily bank settlement.
            </p>
          </div>

          <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 space-y-4">
            <div className="w-12 h-12 bg-[#2CD6EB]/10 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-[#2CD6EB]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white">
              2. Takeaway Packs & Campus Delivery
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Every WhatsApp food order in campus requires takeaway packaging. You can set your 
              <strong> Takeaway Pack Fee</strong> (e.g. ₦150, ₦200), which is automatically charged on WhatsApp Flow Screen 2.
              <br/><br/>
              You can also specify your hostel delivery fee or offer direct kitchen pickup for student walk-ins.
            </p>
          </div>
        </div>

        {/* Step 3 - The WhatsApp Linking Process */}
        <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800 bg-[#0F1118] text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">3. 1-Tap WhatsApp Linking</h2>
                <p className="text-gray-400 text-sm mt-0.5">Your automated kitchen order alert system.</p>
              </div>
            </div>
            
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 max-w-3xl">
              Bukka AI delivers paid order alerts right where you spend your day: <strong>WhatsApp</strong>. 
              You don&apos;t have to keep an app open or refresh a browser to know when food is ordered.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-base text-[#FA6131]">How 1-Tap Linking Works:</h3>
                <ul className="space-y-4 text-xs md:text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</span>
                    <p>After completing the onboarding form, you will get a unique pairing code.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</span>
                    <p>Tap the green <strong>&quot;Connect WhatsApp in 1 Tap&quot;</strong> button.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</span>
                    <p>WhatsApp opens with <code className="bg-black/60 px-2 py-0.5 rounded text-green-400 font-mono">/link {demoPairingCode}</code> pre-filled. Press send and you&apos;re connected!</p>
                  </li>
                </ul>

                <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <p className="text-xs text-green-200">
                    Your kitchen will immediately receive order pings, customer phone numbers, and delivery hostel details!
                  </p>
                </div>
              </div>

              {/* Mock WhatsApp Chat UI */}
              <div className="bg-[#1C2230] border border-white/10 rounded-2xl p-5 overflow-hidden flex flex-col space-y-4">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs">
                    B
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Bukka AI Order Alerts</p>
                    <p className="text-[10px] text-green-400">● Online · WhatsApp Business</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-xs shadow-sm font-mono">
                      /link {demoPairingCode}
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] text-white px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs shadow-sm border border-white/5 max-w-[90%] leading-relaxed">
                      ✅ <strong>Store linked successfully!</strong>
                      <br/><br/>
                      New paid orders from campus students will appear here instantly with customer contact, delivery room, and payment details.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex justify-center pt-4 pb-8">
          <Link 
            to="/onboard" 
            className="inline-flex items-center gap-2.5 bg-[#FA6131] hover:bg-[#ff7244] text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl shadow-[#FA6131]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Set Up Your Kitchen in 2 Minutes</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}