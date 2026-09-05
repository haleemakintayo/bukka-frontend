import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="bg-[#FAF7EE] dark:bg-[#11141D] border-t-3 border-black dark:border-white py-14 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo and Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <img 
                src="/bukkaai-logo-dark.png" 
                alt="Bukka AI" 
                className="h-10 dark:hidden transition-transform group-hover:scale-105" 
              />
              <img 
                src="/bukkaai-logo-light.png" 
                alt="Bukka AI" 
                className="h-10 hidden dark:block transition-transform group-hover:scale-105" 
              />
            </Link>
            <p className="font-sans text-sm text-gray-700 dark:text-gray-300 max-w-sm leading-relaxed font-medium">
              Accept orders in Pidgin, calculate totals instantly, and get paid with zero fake transfer anxiety. Built for campus bukkas.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-display font-black uppercase tracking-wider bg-[#25D366] text-black border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
                🇳🇬 Built For Nigerian Campuses
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-black dark:text-white mb-4 border-b-2 border-black dark:border-white pb-1 inline-block">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors">
                  Vendor Directory
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors">
                  Vendor Guide
                </Link>
              </li>
              <li>
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal Column */}
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-black dark:text-white mb-4 border-b-2 border-black dark:border-white pb-1 inline-block">
              Support & Legal
            </h4>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link to="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@bukkaai.com" 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-[#1C2230] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-bold"
                >
                  <Mail size={14} />
                  support@bukkaai.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 pt-8 border-t-2 border-black/20 dark:border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display text-xs font-bold text-gray-700 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Bukka AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md border-2 border-black dark:border-white bg-[#FFE600] text-black font-display font-extrabold text-xs shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]">
            <Shield size={14} className="stroke-[2.5]" />
            <span>NDPA Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
