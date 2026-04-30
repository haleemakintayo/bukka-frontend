import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const CartSummaryBar = () => {
  const { cartCount, cartTotal, cartItems } = useCart();

  if (cartCount === 0) return null;

  // Get vendor name from first item
  const vendorName = cartItems[0]?.vendorName || 'your order';

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-4 px-4 pt-8 bg-gradient-to-t from-gray-50 dark:from-bukka-dark-surface via-gray-50/95 dark:via-bukka-dark-surface/95 to-transparent z-50 pointer-events-none">
      <Link 
        to="/checkout"
        className="group w-full max-w-lg mx-auto flex items-center justify-between bg-gradient-to-r from-bukka-orange to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-bukka-orange/25 hover:shadow-bukka-orange/40 hover:-translate-y-1 pointer-events-auto"
      >
        <div className="flex items-center gap-4">
          {/* Bag icon with count badge */}
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-bukka-orange text-xs font-extrabold rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-white/80 uppercase tracking-wide">View Cart</span>
            <span className="text-lg tracking-tight">{vendorName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-tight">₦{cartTotal.toLocaleString()}</span>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CartSummaryBar;
