import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-bukka-dark-surface/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img 
              src="/bukkaai-logo-dark.png" 
              alt="Bukka AI" 
              className="h-10 md:h-12 dark:hidden transition-all" 
            />
            <img 
              src="/bukkaai-logo-light.png" 
              alt="Bukka AI" 
              className="h-10 md:h-12 hidden dark:block transition-all" 
            />
          </Link>

          {/* Navigation Links (Hidden on small screens) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/vendors" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-[#FA6131] dark:hover:text-[#FA6131] transition-colors">Vendors</Link>
            <a href="#how-it-works" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">How it Works</a>
            <a href="#features" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-semibold text-gray-600 dark:text-bukka-soft-white hover:text-bukka-cyan transition-colors">Testimonials</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-bukka-soft-white hover:bg-gray-100 dark:hover:bg-bukka-card-surface transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a href="https://wa.me/2349012345678" className="bg-[#FA6131] text-white hover:bg-[#E65100] font-bold rounded-full transition-colors duration-200 px-6 py-2.5 text-sm">
              Join the Beta
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-bukka-soft-white hover:bg-gray-100 dark:hover:bg-bukka-card-surface transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-bukka-soft-white hover:bg-gray-100 dark:hover:bg-bukka-card-surface transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-bukka-dark-surface border-b border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 space-y-4 flex flex-col">
            <Link onClick={toggleMobileMenu} to="/vendors" className="text-base font-semibold text-gray-900 dark:text-bukka-soft-white">Vendors</Link>
            <a onClick={toggleMobileMenu} href="#how-it-works" className="text-base font-semibold text-gray-900 dark:text-bukka-soft-white">How it Works</a>
            <a onClick={toggleMobileMenu} href="#features" className="text-base font-semibold text-gray-900 dark:text-bukka-soft-white">Features</a>
            <a onClick={toggleMobileMenu} href="#testimonials" className="text-base font-semibold text-gray-900 dark:text-bukka-soft-white">Testimonials</a>
            <a onClick={toggleMobileMenu} href="https://wa.me/2349012345678" className="mt-4 bg-[#FA6131] text-white text-center font-bold rounded-full transition-colors duration-200 px-6 py-3 w-full">
              Join the Beta
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
