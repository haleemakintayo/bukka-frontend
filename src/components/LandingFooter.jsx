import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="bg-white dark:bg-bukka-dark-surface border-t border-gray-100 dark:border-gray-800 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/bukkaai-logo-dark.png" 
                alt="Bukka AI" 
                className="h-10 dark:brightness-200 dark:grayscale transition-all" 
              />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Accept orders in Pidgin, calculate totals instantly, and get paid with zero fake transfer anxiety. Built for campus bukkas.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#FA6131] dark:hover:text-bukka-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-gray-600 dark:text-gray-300 hover:text-[#FA6131] dark:hover:text-bukka-cyan transition-colors">
                  Vendor Guide
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-gray-600 dark:text-gray-300 hover:text-[#FA6131] dark:hover:text-bukka-cyan transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Support & Legal</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-[#FA6131] dark:hover:text-bukka-cyan transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:support@bukkaai.com" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#FA6131] dark:hover:text-bukka-cyan transition-colors">
                  <Mail size={14} />
                  support@bukkaai.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Bukka AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#128C7E] dark:text-bukka-cyan font-bold">
            <Shield size={14} />
            <span>NDPA Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
