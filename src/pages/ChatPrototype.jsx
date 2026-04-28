import React from 'react';

const ChatPrototype = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-bukka-card-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">chat prototype</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Preview the Telegram and WhatsApp vendor flows.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-8 rounded-2xl flex flex-col items-center text-center transition-colors">
            <div className="w-16 h-16 bg-[#0088cc] rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Telegram Prototype</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">Currently active for internal pilot testing and operations. Vendors can pair their accounts and manage store states.</p>
            <a href="https://t.me/bukka_ai_bot" target="_blank" rel="noopener noreferrer" className="w-full max-w-[200px] px-6 py-3 bg-[#0088cc] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-sm block">Launch Telegram Bot</a>
        </div>
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-8 rounded-2xl flex flex-col items-center text-center opacity-70 transition-colors">
            <div className="w-16 h-16 bg-bukka-green rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">WhatsApp Parity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">Coming soon once production number is ready. Will follow the exact same pairing flow as Telegram.</p>
            <button disabled className="w-full max-w-[200px] px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 rounded-full font-bold text-sm cursor-not-allowed shadow-sm">Pending Setup</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPrototype;
