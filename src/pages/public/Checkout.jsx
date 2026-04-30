import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { usePaystackPayment } from 'react-paystack';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ShieldCheck, Clock } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, addToCart, decrementQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const CONVENIENCE_FEE = 50;
  const finalTotal = cartTotal + CONVENIENCE_FEE;

  // Placeholder key as requested
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "student@oou.edu.ng", // Paystack requires email, we use a dummy one
    amount: finalTotal * 100, // Paystack amount is in kobo
    publicKey: "pk_test_PLACEHOLDER_KEY",
    metadata: {
      custom_fields: [
        {
          display_name: "WhatsApp Number",
          variable_name: "whatsapp_number",
          value: whatsappNumber
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    setIsProcessing(false);
    clearCart();
    // In a real app we'd call /api/orders/verify here
    navigate('/success', { state: { reference: reference.reference } });
  };

  const onClose = () => {
    setIsProcessing(false);
    console.log('Payment closed');
  };

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!whatsappNumber || whatsappNumber.length < 10) {
      alert("Please enter a valid WhatsApp number.");
      return;
    }
    setIsProcessing(true);
    initializePayment(onSuccess, onClose);
  };

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-bukka-dark-surface flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white dark:bg-bukka-card-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="text-gray-400 dark:text-gray-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-bukka-soft-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any delicious food yet.</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-8 py-3.5 bg-gradient-to-r from-bukka-orange to-orange-500 text-white rounded-2xl font-bold w-full shadow-lg shadow-bukka-orange/25 hover:shadow-bukka-orange/40 transition-all hover:-translate-y-0.5"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bukka-dark-surface pb-8 transition-colors">
      {/* Header with gradient accent */}
      <header className="bg-white dark:bg-bukka-card-surface px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="mr-3 p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-bukka-soft-white">Checkout</h1>
          <span className="px-2 py-0.5 bg-bukka-orange/10 text-bukka-orange text-xs font-bold rounded-full">
            {cartItems.length} items
          </span>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-5">
        {/* Order Review Section - Enhanced */}
        <section className="bg-white dark:bg-bukka-card-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-bukka-soft-white flex items-center gap-2">
              <span className="w-2 h-2 bg-bukka-orange rounded-full"></span>
              Your Order
            </h2>
            <span className="text-xs text-gray-500">{cartItems.length} items</span>
          </div>
          
          <div className="p-3 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                {/* Item Image */}
                {item.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-bukka-soft-white text-sm truncate">{item.name}</h3>
                  <p className="text-bukka-orange font-bold text-base mt-0.5">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center bg-white dark:bg-bukka-card-surface rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => decrementQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-gray-900 dark:text-bukka-soft-white">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item, item.vendorId)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Breakdown - Enhanced */}
        <section className="bg-white dark:bg-bukka-card-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-bukka-soft-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Order Summary
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Subtotal (Food)
              </span>
              <span>₦{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Service Fee
              </span>
              <span>₦{CONVENIENCE_FEE.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total to pay</span>
              <p className="text-2xl font-extrabold text-bukka-orange tracking-tight">₦{finalTotal.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-bukka-orange/10 to-orange-50 dark:to-orange-900/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-bukka-orange" size={28} />
            </div>
          </div>
        </section>

        {/* WhatsApp & Payment Form - Enhanced */}
        <section className="bg-white dark:bg-bukka-card-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-bukka-green" size={20} />
            <h2 className="font-bold text-gray-900 dark:text-bukka-soft-white">Contact for Order Updates</h2>
          </div>
          
          <div className="mb-5">
            <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+234</span>
              <input
                id="whatsapp"
                type="tel"
                placeholder="80X XXX XXXX"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-16 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-bukka-green focus:border-transparent text-lg font-medium text-gray-900 dark:text-bukka-soft-white"
                required
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <Clock size={12} />
              We'll send you updates when your food is being prepared
            </p>
          </div>

          <button
            onClick={handlePayClick}
            disabled={isProcessing || !whatsappNumber}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg flex justify-center items-center gap-2 transition-all duration-300 active:scale-[0.98] ${
              isProcessing || !whatsappNumber 
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-bukka-orange to-orange-500 hover:from-orange-600 hover:to-orange-600 shadow-bukka-orange/30 hover:shadow-bukka-orange/40 hover:-translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Pay ₦{finalTotal.toLocaleString()}</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={12} />
            Secured by Paystack
          </p>
        </section>

        {/* Branding Footer */}
        <div className="pt-2 flex justify-center items-center w-full">
           <img src="/bukkaai-logo-dark.png" alt="Powered by Bukka AI" className="h-6 max-w-[160px] object-contain opacity-60 grayscale" />
        </div>
      </main>
    </div>
  );
};

export default Checkout;
