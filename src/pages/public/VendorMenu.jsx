import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartSummaryBar from '../../components/CartSummaryBar';
import { getVendorBySlug, getVendorMenu } from '../../services/api';
import { Plus, Star, MapPin, Clock } from 'lucide-react';

const MOCK_VENDOR = {
  id: "VEN-4092",
  name: "Iya Basira's Kitchen",
  isOpen: true,
  rating: 4.8,
  reviewCount: 234,
  location: 'Faculty of Science',
  deliveryTime: '10-15 mins',
  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  tags: ["🔥 Hot Today", "⭐ Popular"],
  categories: [
    {
      name: "Swallows & Rice",
      emoji: "🍚",
      items: [
        { id: "i4", name: "Pounded Yam (Wrap)", description: "Soft, hot, and freshly pounded wrapper.", price: 800, is_available: true, image: "https://images.unsplash.com/photo-1626132647523-66d4f1fdc24d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", popular: true },
        { id: "i5", name: "Amala (Wrap)", description: "Authentic fluffy Amala from the pot.", price: 500, is_available: true, image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
        { id: "i6", name: "Jollof Rice (Portion)", description: "Party style smoky Jollof rice.", price: 1200, is_available: true, image: "https://images.unsplash.com/photo-1604899097473-2ab84d6d14ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", popular: true },
        { id: "i12", name: "Fried Rice (Portion)", description: "Rich fried rice with veggies and liver chunks.", price: 1300, is_available: true, image: "https://images.unsplash.com/photo-1583304000676-4877530f0c26?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
      ]
    },
    {
      name: "Proteins",
      emoji: "🍗",
      items: [
        { id: "i1", name: "Fried Turkey", description: "Spicy and crunchy turkey wing.", price: 1500, is_available: true, image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", popular: true },
        { id: "i2", name: "Assorted Meat", description: "Shaki, ponmo, and beef in pepper sauce.", price: 1000, is_available: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
        { id: "i3", name: "Catfish (Point & Kill)", description: "Freshly made pepper soup fish.", price: 2500, is_available: false, image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
        { id: "i10", name: "Boiled Egg", description: "Hard boiled egg.", price: 300, is_available: true, image: "https://images.unsplash.com/photo-1582708417311-978a321e3fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
      ]
    },
    {
      name: "Quick Bites & Sides",
      emoji: "🍟",
      items: [
        { id: "i11", name: "Fried Plantain (Dodo)", description: "Sweet and ripe fried golden plantain.", price: 500, is_available: true, image: "https://images.unsplash.com/photo-1628205042134-47d4a18d1348?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
        { id: "i13", name: "Moi Moi", description: "Spiced beans pudding with egg inside.", price: 600, is_available: true, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80", popular: true }
      ]
    },
    {
      name: "Drinks",
      emoji: "🥤",
      items: [
        { id: "i7", name: "Chilled Coke (50cl)", description: "Ice cold refreshing Coke.", price: 400, is_available: true, image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
        { id: "i8", name: "Bottled Water", description: "Nestle pure water.", price: 200, is_available: true, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
      ]
    }
  ]
};

const VendorMenu = () => {
  const { vendorSlug } = useParams();
  const { addToCart } = useCart();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorMenu = async () => {
      setLoading(true);
      try {
        // Fetch vendor details and menu from API
        const [vendorData, menuData] = await Promise.all([
          getVendorBySlug(vendorSlug),
          getVendorMenu(vendorSlug)
        ]);
        
        // Transform API response to match component structure
        setVendor({
          id: vendorData.vendor_id,
          slug: vendorData.slug || vendorSlug,
          name: vendorData.business_name,
          isOpen: vendorData.is_active,
          rating: vendorData.rating || 4.5,
          reviewCount: vendorData.review_count || 0,
          location: vendorData.location || 'Campus',
          deliveryTime: vendorData.delivery_time || '10-20 mins',
          image: vendorData.image || vendorData.cover_image,
          coverImage: vendorData.cover_image,
          tags: vendorData.tags || [],
          categories: transformCategories(menuData.categories)
        });
      } catch (err) {
        console.error('Error fetching vendor:', err);
        // Fallback to mock data for development
        setVendor(MOCK_VENDOR);
      } finally {
        setLoading(false);
      }
    };

    if (vendorSlug) {
      fetchVendorMenu();
    }
  }, [vendorSlug]);

  // Transform API categories to component format
  const transformCategories = (categories) => {
    if (!categories) return [];
    return Object.entries(categories).map(([name, items]) => ({
      name,
      emoji: getCategoryEmoji(name),
      items: items.map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || '',
        price: item.price,
        is_available: item.is_available !== false,
        image: item.image || null,
        popular: item.popular || false
      }))
    }));
  };

  const getCategoryEmoji = (categoryName) => {
    const emojis = {
      'Main': '🍚', 'Rice': '🍚', 'Swallows': '🍲',
      'Proteins': '🍗', 'Protein': '🍗', 'Meat': '🍖',
      'Sides': '🍟', 'Extras': '🍟',
      'Drinks': '🥤', 'Drink': '🥤',
      'Fast Food': '🍔', 'Breakfast': '🥞'
    };
    return emojis[categoryName] || '🍴';
  };

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
      {/* Banner Image with gradient overlay */}
      <div className="w-full h-56 md:h-72 overflow-hidden relative">
        <img 
          src={vendor.coverImage || vendor.image} 
          alt={vendor.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
        
        {/* Tags overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          {vendor.tags?.map((tag, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 shadow-lg">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Header Info */}
      <header className="relative z-10 max-w-2xl mx-auto -mt-20 px-6">
        <div className="bg-white dark:bg-bukka-card-surface rounded-[2rem] p-6 shadow-2xl border border-gray-100/50 dark:border-gray-800/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-bukka-soft-white">{vendor.name}</h1>
              
              {/* Rating with review count */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < Math.floor(vendor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                    />
                  ))}
                </div>
                <span className="text-bukka-orange font-bold text-sm">{vendor.rating}</span>
                <span className="text-gray-400 text-sm">({vendor.reviewCount} reviews)</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-bukka-orange" /> {vendor.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-bukka-orange" /> {vendor.deliveryTime}
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg
              ${vendor.isOpen 
                ? 'bg-gradient-to-r from-bukka-orange to-orange-500 text-white shadow-bukka-orange/30' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
              {vendor.isOpen ? '🟢 Open Now' : '🔴 Closed'}
            </span>
          </div>
        </div>
      </header>

      {/* Menu Feed */}
      <main className="p-6 space-y-10 max-w-2xl mx-auto overflow-hidden mt-4">
        {vendor.categories.map((category, idx) => (
          <section key={idx}>
            {/* Category Header with emoji */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{category.emoji}</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-bukka-soft-white tracking-tight">
                {category.name}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600 ml-2"></div>
              <span className="text-xs font-medium text-gray-400">{category.items.length} items</span>
            </div>
            
            <div className="grid gap-4">
              {category.items.map(item => (
                <div 
                  key={item.id} 
                  className={`group relative bg-white dark:bg-bukka-card-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800
                    ${!item.is_available && 'opacity-60 grayscale'}`}
                >
                  <div className="flex p-4 gap-4">
                    {/* Food Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Popular badge */}
                      {item.popular && (
                        <div className="absolute -top-1 -left-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1">
                          <span>🔥</span> Popular
                        </div>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-bukka-soft-white text-base leading-tight truncate">{item.name}</h3>
                          {!item.is_available && (
                            <span className="flex-shrink-0 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold">Sold Out</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-bukka-orange font-extrabold text-xl tracking-tight">₦{item.price.toLocaleString()}</p>
                        
                        <button
                          onClick={() => addToCart(item, vendor.slug, vendor.name, vendor.id)}
                          disabled={!item.is_available || !vendor.isOpen}
                          className={`flex items-center justify-center rounded-xl px-4 py-2.5 transition-all duration-300
                            ${item.is_available && vendor.isOpen 
                              ? 'bg-bukka-orange hover:bg-gradient-to-r hover:from-bukka-orange hover:to-orange-500 text-white shadow-lg shadow-bukka-orange/25 hover:shadow-bukka-orange/40 hover:scale-105 active:scale-95' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                          aria-label="Add to cart"
                        >
                          <Plus size={18} strokeWidth={3} />
                          <span className="ml-1 text-sm font-bold">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
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
