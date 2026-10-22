import React, { useEffect, useState } from 'react';
import useOrderStore from '../../store/useOrderStore';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    sales: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats'); // assuming we have a stats endpoint, if not we'll fetch individually
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading Dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.users || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.orders || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Sales</p>
            <h3 className="text-2xl font-bold text-gray-800">${(stats.sales || 0).toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
            <i className="fas fa-box"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Products</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.products || 0}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <p className="text-gray-500">More charts and activity logs can be added here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
