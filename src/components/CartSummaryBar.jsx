import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartSummaryBar = () => {
  const { cartCount, cartTotal } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-50 pointer-events-none">
      <Link 
        to="/checkout"
        className="w-full max-w-lg mx-auto flex items-center justify-between bg-[#FF6600] hover:bg-[#eb5e00] text-white py-4 px-8 rounded-full font-bold transition-all duration-300 shadow-xl hover:-translate-y-1 pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm tracking-wide">
            {cartCount} item{cartCount !== 1 && 's'}
          </span>
        </div>
        <span className="text-lg tracking-tight">View Cart • ₦{cartTotal.toLocaleString()}</span>
      </Link>
    </div>
  );
};

export default CartSummaryBar;
