import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { usePaystackPayment } from 'react-paystack';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="text-gray-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any food yet.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-3 bg-bukka-green text-white rounded-full font-bold w-full"
            >
              Go Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 lowercase">checkout</h1>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        {/* Order Review Section */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 px-1">Your Order</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-bukka-green font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button 
                    onClick={() => decrementQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm"
                  >
                    {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item, item.vendorId)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (Food)</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Convenience Fee</span>
            <span>₦{CONVENIENCE_FEE.toLocaleString()}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>₦{finalTotal.toLocaleString()}</span>
          </div>
        </section>

        {/* WhatsApp & Payment Form */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 px-1">Where do we send your alert?</h2>
          <div className="mb-6">
            <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2 px-1">
              WhatsApp Number
            </label>
            <input
              id="whatsapp"
              type="tel"
              placeholder="e.g. 08012345678"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bukka-green focus:border-transparent text-lg"
              required
            />
            <p className="text-xs text-gray-500 mt-2 px-1">We'll text you when your food is ready to pick up.</p>
          </div>

          <button
            onClick={handlePayClick}
            disabled={isProcessing || !whatsappNumber}
            className={`w-full py-4 px-6 rounded-full font-bold text-white shadow-md flex justify-center items-center gap-2 transition-transform active:scale-95 ${
              isProcessing || !whatsappNumber ? 'bg-gray-400 cursor-not-allowed' : 'bg-bukka-orange hover:bg-[#d84d00]'
            }`}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              `Pay ₦${finalTotal.toLocaleString()}`
            )}
          </button>
        </section>

        {/* Branding Footer */}
        <div className="pt-4 flex justify-center items-center w-full">
           <img src="/bukkaai-logo-dark.png" alt="Powered by Bukka AI" className="h-8 max-w-[200px] object-contain opacity-70 grayscale" />
        </div>
      </main>
    </div>
  );
};

export default Checkout;
