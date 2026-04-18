import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartSummaryBar from '../../components/CartSummaryBar';
import { Plus, Star, MapPin, Clock } from 'lucide-react';

const MOCK_VENDOR = {
  id: "VEN-4092",
  name: "Iya Basira's Kitchen",
  isOpen: true,
  rating: 4.8,
  location: 'Faculty of Science',
  deliveryTime: '10-15 mins',
  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categories: [
    {
      name: "Swallows & Rice 🍚",
      items: [
        { id: "i4", name: "Pounded Yam (Wrap)", description: "Soft, hot, and freshly pounded wrapper.", price: 800, is_available: true },
        { id: "i5", name: "Amala (Wrap)", description: "Authentic fluffy Amala from the pot.", price: 500, is_available: true },
        { id: "i6", name: "Jollof Rice (Portion)", description: "Party style smoky Jollof rice.", price: 1200, is_available: true },
        { id: "i12", name: "Fried Rice (Portion)", description: "Rich fried rice with veggies and liver chunks.", price: 1300, is_available: true }
      ]
    },
    {
      name: "Proteins 🍗",
      items: [
        { id: "i1", name: "Fried Turkey", description: "Spicy and crunchy turkey wing.", price: 1500, is_available: true },
        { id: "i2", name: "Assorted Meat", description: "Shaki, ponmo, and beef in pepper sauce.", price: 1000, is_available: true },
        { id: "i3", name: "Catfish (Point & Kill)", description: "Freshly made pepper soup fish.", price: 2500, is_available: false },
        { id: "i10", name: "Boiled Egg", description: "Hard boiled egg.", price: 300, is_available: true }
      ]
    },
    {
      name: "Quick Bites & Sides 🍟",
      items: [
        { id: "i11", name: "Fried Plantain (Dodo)", description: "Sweet and ripe fried golden plantain.", price: 500, is_available: true },
        { id: "i13", name: "Moi Moi", description: "Spiced beans pudding with egg inside.", price: 600, is_available: true }
      ]
    },
    {
      name: "Drinks 🥤",
      items: [
        { id: "i7", name: "Chilled Coke (50cl)", description: "Ice cold refreshing Coke.", price: 400, is_available: true },
        { id: "i8", name: "Bottled Water", description: "Nestle pure water.", price: 200, is_available: true }
      ]
    }
  ]
};

const VendorMenu = () => {
  const { vendor_id } = useParams();
  const { addToCart } = useCart();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVendor(MOCK_VENDOR);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [vendor_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-bukka-dark-surface transition-colors">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-bukka-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-bold lowercase tracking-tight">loading menu...</p>
        </div>
      </div>
    );
  }

  if (!vendor) return <div className="p-6 text-center dark:text-bukka-soft-white">Vendor not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bukka-dark-surface pb-32 transition-colors">
      {/* Banner Image */}
      <div className="w-full h-48 md:h-64 overflow-hidden relative">
        <img 
          src={vendor.image} 
          alt={vendor.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Header Info */}
      <header className="relative z-10 max-w-2xl mx-auto -mt-16 px-6">
        <div className="bg-white dark:bg-bukka-card-surface rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white lowercase">{vendor.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span className="flex items-center gap-1 text-bukka-orange">
                  <Star size={16} fill="currentColor" /> {vendor.rating}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {vendor.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {vendor.deliveryTime}
                </span>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${vendor.isOpen ? 'bg-bukka-orange/10 text-bukka-orange' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
              {vendor.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      </header>

      {/* Menu Feed */}
      <main className="p-6 space-y-12 max-w-2xl mx-auto overflow-hidden mt-6">
        {vendor.categories.map((category, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-bukka-soft-white lowercase tracking-tight mb-6 flex items-center gap-2">
              {category.name}
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 ml-4"></div>
            </h2>
            <div className="space-y-4">
              {category.items.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white dark:bg-bukka-card-surface rounded-[1.5rem] p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 ${!item.is_available && 'opacity-60 grayscale bg-gray-50 dark:bg-bukka-dark-surface'}`}
                >
                  <div className="pr-4 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-lg leading-tight">{item.name}</h3>
                    {item.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-snug">{item.description}</p>}
                    <div className="flex items-center mt-3">
                      <p className="text-bukka-orange font-extrabold text-lg tracking-tight">₦{item.price.toLocaleString()}</p>
                      {!item.is_available && <span className="ml-4 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-xs font-bold uppercase tracking-wide">Sold Out</span>}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(item, vendor.id)}
                    disabled={!item.is_available || !vendor.isOpen}
                    className={`flex-shrink-0 flex items-center justify-center rounded-full w-12 h-12 transition-all duration-300
                      ${item.is_available && vendor.isOpen 
                        ? 'bg-bukka-orange hover:opacity-90 text-white shadow-md hover:-translate-y-0.5 focus:scale-95' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border-none'}`}
                    aria-label="Add to cart"
                  >
                    <Plus size={22} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <CartSummaryBar />
    </div>
  );
};

export default VendorMenu;
