import React from 'react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Staff Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/staff/orders" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Manage Orders</h3>
            <p className="text-sm text-gray-500">View and update customer order statuses.</p>
          </div>
        </Link>

        <Link to="/staff/inventory" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
            <i className="fas fa-box"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Inventory Tracking</h3>
            <p className="text-sm text-gray-500">Monitor product stock levels and updates.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StaffDashboard;
