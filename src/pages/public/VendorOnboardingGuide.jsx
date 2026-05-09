import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Store, 
  MessageSquare, 
  ListPlus, 
  Smartphone,
  CreditCard,
  ArrowRight,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorOnboardingGuide() {
  const [copied, setCopied] = useState(false);
  const demoPairingCode = "8f3a9b21";

  const steps = [
    { step: 1, title: "Create Your Profile", desc: "Tell us about your Bukka and where to send your money.", icon: <Store className="w-6 h-6 text-[#0F6B43]" /> },
    { step: 2, title: "Build Your Menu", desc: "Add your food items, categories, and prices.", icon: <ListPlus className="w-6 h-6 text-[#0F6B43]" /> },
    { step: 3, title: "Connect Telegram", desc: "Link our bot to your phone to receive instant orders.", icon: <Smartphone className="w-6 h-6 text-[#0F6B43]" /> }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(demoPairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bukka-dark-surface pt-24 pb-12 px-4 md:px-8 font-sans text-gray-900 dark:text-bukka-soft-white transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-[#0F6B43] rounded-3xl p-8 md:p-12 text-white shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight lowercase mb-4">
            getting started with bukka ai
          </h1>
          <p className="text-emerald-50 max-w-2xl text-lg">
            Welcome! Setting up your digital Bukka is incredibly simple. You don't need any technical skills, 
            and you don't even need to download a new app. This quick guide explains how to get your store online in 5 minutes.
          </p>
        </div>

        {/* Stepper Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-white dark:bg-bukka-card-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-all">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-full flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#FF6600] uppercase tracking-wider mb-1">Step {s.step}</p>
                <h3 className="font-bold text-lg mb-1 dark:text-bukka-soft-white">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step 1 & 2 Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <div className="w-12 h-12 bg-orange-50 dark:bg-[#FF6600]/10 rounded-full flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6 text-[#FF6600]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight lowercase text-gray-900 dark:text-bukka-soft-white mb-3">
              1. profile & payments
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              First, you'll need to enter your business name and create a login using your email. 
              Most importantly, you'll provide your <strong>Bank Account Details</strong>. 
              <br/><br/>
              When students pay for their food through our platform, the money is routed securely 
              and directly to the account you provide. No middleman delays!
            </p>
          </div>

          <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-[#0F6B43]/10 rounded-full flex items-center justify-center mb-6">
              <ListPlus className="w-6 h-6 text-[#0F6B43]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight lowercase text-gray-900 dark:text-bukka-soft-white mb-3">
              2. adding your menu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              You will add the food items you sell (e.g., "Jollof Rice", "Fried Turkey"), 
              assign them a category, and set your exact prices. 
              <br/><br/>
              Don't worry if a price changes or you run out of an item later—you can easily update 
              your menu right from your phone while you're cooking.
            </p>
          </div>
        </div>

        {/* Step 3 - The Pairing Process (Most Important) */}
        <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800 bg-[#0A0A0A] dark:bg-black/40 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#FF6600]/20 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-[#FF6600]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight lowercase">3. connect to telegram</h2>
                <p className="text-gray-400 mt-1">Your new kitchen display system.</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl">
              Bukka AI doesn't force you to download or learn a heavy new app. We use the Telegram app 
              you already know to send you order alerts and let you control your store. 
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="font-bold text-xl mb-4 text-[#FF6600]">How to link your phone:</h3>
                <ul className="space-y-4">
                  <li className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5">1</span>
                      <p className="text-gray-300">When you finish the setup form, our system will show you a unique 8-letter <strong>Pairing Code</strong>.</p>
                    </div>
                    
                    {/* Interactive Copy Block */}
                    <div className="ml-9 mt-1 mb-2 flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-3 max-w-xs">
                      <span className="font-mono text-xl tracking-widest text-white">{demoPairingCode}</span>
                      <button 
                        onClick={handleCopy}
                        className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg transition-all flex items-center gap-2 text-sm text-gray-300"
                        title="Copy to clipboard"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="font-medium">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                    <p className="text-gray-300">Open the Telegram app and search for our bot: <strong className="text-white">@BukkaAIBot</strong></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                    <p className="text-gray-300">Send a message to the bot typing <code className="bg-black px-2 py-1 rounded text-emerald-400 border border-white/10">/link your-code</code></p>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-emerald-100">That's it! Your store is instantly live and ready to receive orders.</p>
                </div>
              </div>

              {/* Mock Chat UI */}
              <div className="bg-[#1C1C1E] dark:bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col h-full">
                <div className="text-center border-b border-white/10 pb-3 mb-4">
                  <p className="font-bold text-sm">BukkaAIBot</p>
                  <p className="text-xs text-gray-500">bot</p>
                </div>
                
                <div className="flex-1 space-y-4">
                  {/* Message bubble from user */}
                  <div className="flex justify-end">
                    <div className="bg-[#0F6B43] text-white px-4 py-2 rounded-2xl rounded-br-sm text-sm inline-block shadow-sm">
                      /link {demoPairingCode}
                    </div>
                  </div>
                  
                  {/* Message bubble from bot */}
                  <div className="flex justify-start">
                    <div className="bg-[#2C2C2E] text-white px-4 py-3 rounded-2xl rounded-bl-sm text-sm inline-block shadow-sm border border-white/5 max-w-[90%]">
                      ✅ Success! Your Bukka is now linked.
                      <br/><br/>
                      You will receive new order notifications right here. Type <span className="text-[#FF6600]">/help</span> anytime to see what you can do.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Commands Section */}
        <div className="bg-white dark:bg-bukka-card-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-8 h-8 text-[#0F6B43]" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight lowercase text-gray-900 dark:text-bukka-soft-white">managing your store</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl text-lg">
            Once connected, you manage everything by typing simple commands to the Telegram bot. 
            No confusing dashboards needed!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 hover:border-[#FF6600]/30 transition-colors">
              <p className="font-mono text-[#FF6600] font-bold mb-2">/confirm 102</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accepts incoming order #102 and notifies the student.</p>
            </div>
            <div className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 hover:border-[#FF6600]/30 transition-colors">
              <p className="font-mono text-[#FF6600] font-bold mb-2">/out Chicken</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Marks chicken as "Sold Out" so students can't order it.</p>
            </div>
            <div className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 hover:border-[#FF6600]/30 transition-colors">
              <p className="font-mono text-[#FF6600] font-bold mb-2">/restock Chicken</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Makes the chicken available on your menu again.</p>
            </div>
            <div className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 hover:border-[#FF6600]/30 transition-colors">
              <p className="font-mono text-[#FF6600] font-bold mb-2">/menu</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Shows a list of everything currently on your menu.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex justify-center pt-8 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 bg-[#0F6B43] hover:bg-[#0c5736] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </div>
  );
}