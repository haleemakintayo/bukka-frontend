import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const CartSummaryBar = () => {
  const { cartCount, cartTotal, cartItems } = useCart();

  if (cartCount === 0) return null;

  // Get vendor name from first item
  const vendorName = cartItems[0]?.vendorName || 'Your Order';

  return (
    <aside aria-label="Cart Summary" className="fixed bottom-0 left-0 right-0 pb-4 px-4 pt-6 bg-gradient-to-t from-[#FAF7EE] dark:from-[#11141D] via-[#FAF7EE]/95 dark:via-[#11141D]/95 to-transparent z-40 pointer-events-none">
      <Link 
        to="/checkout"
        className="group w-full max-w-lg mx-auto flex items-center justify-between bg-[#FA6131] hover:bg-[#ff7244] text-white py-3.5 px-4 sm:px-6 rounded-2xl border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#2CD6EB] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all pointer-events-auto cursor-pointer"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Bag icon with count badge */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#FFE600] text-black rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <ShoppingBag size={22} className="stroke-[2.5]" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-black text-[#FFE600] text-xs font-display font-black rounded-md border-2 border-white flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
              {cartCount}
            </span>
          </div>
          
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[10px] font-display font-black text-orange-100 uppercase tracking-wider">
              Ready to Order
            </span>
            <span className="text-sm sm:text-base font-display font-black truncate max-w-[130px] sm:max-w-[200px]">
              {vendorName}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <span className="bg-white text-black border-2 border-black rounded-xl px-2.5 sm:px-3 py-1 font-display font-black text-sm sm:text-base shadow-[2px_2px_0px_0px_#000]">
            ₦{cartTotal.toLocaleString()}
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FFE600] text-black border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={18} className="stroke-[3]" />
          </div>
        </div>
      </Link>
    </aside>
  );
};

export default CartSummaryBar;
