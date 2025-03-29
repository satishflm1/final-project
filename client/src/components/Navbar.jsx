import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-[#FC8019] font-bold text-3xl">R</span>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-[#3d4152]">RaVi'S</span>
                  <span className="text-sm text-[#686b78]">ReStAuRaNt PoS</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/orders"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/orders')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Orders
              </Link>
              <Link
                to="/dinein"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/dinein')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Dine-In
              </Link>
              <Link
                to="/takeaway"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/takeaway')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Takeaway
              </Link>
              <Link
                to="/tables"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/tables')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Tables
              </Link>
              <Link
                to="/dishes"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/dishes')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Dishes
              </Link>
              <Link
                to="/categories"
                className={`inline-flex items-center px-1 pt-1 border-b-2 font-medium text-sm ${
                  isActive('/categories')
                    ? 'border-[#FC8019] text-[#FC8019]'
                    : 'border-transparent text-[#686b78] hover:text-[#FC8019] hover:border-[#FC8019]'
                }`}
              >
                Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 