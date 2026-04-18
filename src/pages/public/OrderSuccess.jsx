import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const reference = location.state?.reference || "ORD-" + Math.floor(Math.random() * 10000);

  return (
    <div className="min-h-screen bg-bukka-green flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-white/10 p-8 rounded-[40px] flex justify-center items-center mb-8 backdrop-blur-md">
        <CheckCircle2 size={80} className="text-white drop-shadow-md" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight lowercase mb-2">payment successful!</h1>
      
      <div className="bg-white/20 px-6 py-2 rounded-full font-bold tracking-widest text-lg mb-8">
        {reference.substring(0, 8).toUpperCase()}
      </div>
      
      <p className="text-lg text-green-50 max-w-sm leading-relaxed mb-12">
        We've received your order. Please return to WhatsApp—we will send you a notification as soon as your food is ready for pickup!
      </p>

      {/* Just a dummy link to go back to a neutral state for demo */}
      <Link 
        to="/"
        className="px-8 py-4 bg-white text-bukka-green rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg"
      >
        Done
      </Link>

      <div className="absolute bottom-8 flex justify-center w-full opacity-50">
         <img src="/bukkaai-logo-light.png" alt="Bukka AI Logo" className="h-8" />
      </div>
    </div>
  );
};

export default OrderSuccess;
