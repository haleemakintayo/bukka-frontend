import React from 'react';

const LandingNavbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold" style={{ color: '#128C7E' }}>Bukka AI</h1>
          </div>
          <div className="ml-4 flex items-center">
            <button
              style={{ backgroundColor: '#128C7E', color: 'white' }}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Join Beta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
