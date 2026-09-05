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
    <nav className="sticky top-0 z-50 bg-[#FAF7EE]/95 dark:bg-[#11141D]/95 backdrop-blur-md border-b-3 border-black dark:border-white transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <img 
              src="/bukkaai-logo-dark.png" 
              alt="Bukka AI" 
              className="h-9 md:h-11 dark:hidden transition-transform group-hover:scale-105" 
            />
            <img 
              src="/bukkaai-logo-light.png" 
              alt="Bukka AI" 
              className="h-9 md:h-11 hidden dark:block transition-transform group-hover:scale-105" 
            />
            <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-black uppercase tracking-wider bg-[#FFE600] text-black border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] -rotate-2">
              Beta
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-3 items-center">
            <Link 
              to="/vendors" 
              className="font-display font-bold text-sm text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black hover:shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              Vendors
            </Link>
            <a 
              href="#how-it-works" 
              className="font-display font-bold text-sm text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-[#2CD6EB] hover:text-black dark:hover:bg-[#2CD6EB] dark:hover:text-black hover:shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              How It Works
            </a>
            <a 
              href="#features" 
              className="font-display font-bold text-sm text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-[#2CD6EB] hover:text-black dark:hover:bg-[#2CD6EB] dark:hover:text-black hover:shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="font-display font-bold text-sm text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-[#25D366] hover:text-black dark:hover:bg-[#25D366] dark:hover:text-black hover:shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              Testimonials
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-black dark:text-white bg-white dark:bg-[#1C2230] border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              {isDarkMode ? <Sun size={19} className="text-yellow-400" /> : <Moon size={19} />}
            </button>

            <a 
              href="https://wa.me/2349060251750" 
              className="inline-flex items-center justify-center font-display font-extrabold text-sm uppercase tracking-wide bg-[#FA6131] hover:bg-[#ff7244] text-white px-5 py-2.5 rounded-xl border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              Join the Beta ⚡
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-black dark:text-white bg-white dark:bg-[#1C2230] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>
            <button 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-lg text-black dark:text-white bg-white dark:bg-[#1C2230] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7EE] dark:bg-[#181D2A] border-b-3 border-black dark:border-white shadow-[0px_6px_0px_0px_#000] dark:shadow-[0px_6px_0px_0px_#fff]">
          <div className="px-6 py-5 space-y-3 flex flex-col">
            <Link 
              onClick={toggleMobileMenu} 
              to="/vendors" 
              className="font-display font-bold text-base text-black dark:text-white p-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-[#121620] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
            >
              🍽️ Vendors Directory
            </Link>
            <a 
              onClick={toggleMobileMenu} 
              href="#how-it-works" 
              className="font-display font-bold text-base text-black dark:text-white p-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-[#121620] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
            >
              ⚙️ How It Works
            </a>
            <a 
              onClick={toggleMobileMenu} 
              href="#features" 
              className="font-display font-bold text-base text-black dark:text-white p-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-[#121620] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
            >
              ⚡ Features
            </a>
            <a 
              onClick={toggleMobileMenu} 
              href="#testimonials" 
              className="font-display font-bold text-base text-black dark:text-white p-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-[#121620] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
            >
              ⭐ Testimonials
            </a>
            <a 
              onClick={toggleMobileMenu} 
              href="https://wa.me/2349060251750" 
              className="mt-2 font-display font-extrabold uppercase tracking-wide bg-[#FA6131] text-white text-center rounded-xl border-3 border-black p-3 shadow-[4px_4px_0px_0px_#000]"
            >
              Join the Beta Now ⚡
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
