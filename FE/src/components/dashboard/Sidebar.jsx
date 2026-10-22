import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: 'fas fa-chart-line' },
    { name: 'Products', path: '/admin/products', icon: 'fas fa-box' },
    { name: 'Brands', path: '/admin/brands', icon: 'fas fa-tags' },
    { name: 'Orders', path: '/admin/orders', icon: 'fas fa-shopping-bag' },
    { name: 'Coupons', path: '/admin/coupons', icon: 'fas fa-ticket-alt' },
    { name: 'Services', path: '/admin/services', icon: 'fas fa-spa' },
    { name: 'Appointments', path: '/admin/appointments', icon: 'fas fa-calendar-check' },
    { name: 'Users', path: '/admin/users', icon: 'fas fa-users' },
  ];

  const staffLinks = [
    { name: 'Dashboard', path: '/staff', icon: 'fas fa-chart-line' },
    { name: 'Orders', path: '/staff/orders', icon: 'fas fa-shopping-bag' },
    { name: 'Inventory', path: '/staff/inventory', icon: 'fas fa-boxes' },
    { name: 'Appointments', path: '/staff/appointments', icon: 'fas fa-calendar-check' },
  ];

  const links = user?.role === 'admin' ? adminLinks : staffLinks;

  return (
    <div className="bg-brand-dark text-white w-64 min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <i className="fas fa-paw text-brand-orange"></i> Pet Shop
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Welcome, <span className="text-brand-orange font-bold">{user?.name}</span>
          <div className="uppercase text-xs mt-1 tracking-wider">{user?.role}</div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
          // Special check for EXACT match for dashboard root to avoid highlighting everything
          const isExactActive = link.name === 'Dashboard' 
            ? location.pathname === link.path 
            : isActive;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isExactActive
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <i className={`${link.icon} w-5 text-center`}></i>
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>


    </div>
  );
};

export default Sidebar;
