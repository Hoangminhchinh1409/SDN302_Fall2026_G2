import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  const [searchKeyword, setSearchKeyword] = useState('');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate('/shop', { state: { keyword: searchKeyword, scrollToProducts: true } });
      setSearchKeyword('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-gray text-brand-text text-xs py-2 px-4 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-2 hidden md:flex">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><i className="fas fa-phone text-brand-orange"></i> +8493-629-5902</span>
          <span className="flex items-center gap-2"><i className="fas fa-envelope text-brand-orange"></i> chinhhmhe171181@fpt.edu.vn</span>
        </div>
        <div>
          <span className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-brand-orange"></i> Khu Công Nghệ Cao Hòa Lạc, CT03, Hòa Lạc, Hà Nội, Việt Nam</span>
        </div>
      </div>

      {/* Navigation */}
      <header className="py-4 px-4 md:px-12 flex justify-between items-center sticky top-0 bg-white z-50 border-b border-gray-100">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-dark">
          <i className="fas fa-paw text-brand-orange"></i> Pet Shop
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${location.pathname === link.path || (location.pathname === '/' && link.path === '/')
                  ? 'text-brand-orange border-b-2 border-brand-orange pb-1'
                  : 'text-brand-dark hover:text-brand-orange transition-colors'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="bg-brand-gray rounded-full py-2 px-5 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange w-48 lg:w-64"
            />
            <button type="submit" aria-label="Search" className="absolute right-4 top-2.5 text-gray-400 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-full">
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>
          </form>

          {user ? (
            <div className="relative group hidden sm:block">
              <button aria-label="User menu" className="text-brand-dark hover:text-brand-orange transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md px-2 py-1">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-brand-orange/40" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center text-xs font-bold border border-orange-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : <i className="far fa-user text-xs" aria-hidden="true"></i>}
                  </div>
                )}
                <span className="text-sm font-medium max-w-[110px] truncate">{user.name}</span>
              </button>
              <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block z-50">
                <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-2 overflow-hidden">
                  {/* Membership & Points preview in dropdown */}
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        {user.membershipTier === 'Diamond' ? '💎' : user.membershipTier === 'Gold' ? '🥇' : user.membershipTier === 'Silver' ? '🥈' : '🥉'}
                        {user.membershipTier || 'Bronze'} Member
                      </span>
                      <span className="font-extrabold text-brand-orange flex items-center gap-1">
                        <i className="fas fa-coins text-[11px]"></i> {user.rewardPoints || 0} pts
                      </span>
                    </div>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                  <Link to="/orders/myorders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Wishlist</Link>
                  <Link to="/pets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Pets</Link>
                  <Link to="/book-appointment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Book Appointment</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Dashboard</Link>
                  )}
                  {user.role === 'staff' && (
                    <Link to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Staff Dashboard</Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" aria-label="Login" className="text-xl text-brand-dark hover:text-brand-orange transition-colors hidden sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md px-2 py-1"><i className="far fa-user" aria-hidden="true"></i></Link>
          )}

          <Link to="/wishlist" aria-label="Favorites" className="text-xl text-brand-dark hover:text-brand-orange transition-colors hidden sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md px-2 py-1"><i className="far fa-heart" aria-hidden="true"></i></Link>
          <Link to="/cart" aria-label="Shopping Cart" className="text-xl text-brand-dark hover:text-brand-orange transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md px-2 py-1">
            <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-orange text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          {/* Mobile Menu Toggle */}
          <button
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden text-2xl text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md px-2 py-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"} aria-hidden="true"></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-medium text-brand-dark hover:text-brand-orange"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-medium text-brand-dark hover:text-brand-orange pt-2 border-t border-gray-100"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
