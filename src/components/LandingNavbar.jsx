import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const LandingNavbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-bukka-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img 
              src="/bukkaai-logo-dark.png" 
              alt="Bukka AI" 
              className="h-10 md:h-12 dark:brightness-200 dark:grayscale transition-all" 
            />
          </Link>

          {/* Navigation Links (Hidden on small screens) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/order/1" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">Menu</Link>
            <a href="#features" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">Testimonials</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-bukka-soft-white hover:bg-gray-100 dark:hover:bg-bukka-card-surface transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              to="/admin/dashboard" 
              className="hidden sm:block text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors"
            >
              Vendor Login
            </Link>
            <button className="bg-bukka-orange text-white hover:opacity-90 font-bold rounded-full transition-all duration-200 shadow-md hover:shadow-lg px-6 py-2.5 text-sm">
              Join the Beta
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
