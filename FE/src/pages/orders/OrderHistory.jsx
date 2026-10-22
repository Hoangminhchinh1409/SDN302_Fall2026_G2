import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';

const OrderHistory = () => {
  const { myOrders, fetchMyOrders, isLoading, error } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMyOrders();
    }
  }, [user, navigate, fetchMyOrders]);

  return (
    <div className="py-16 px-4 md:px-12 lg:px-24 bg-gray-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Order History</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
        ) : myOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/shop" className="inline-block bg-brand-orange text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-brand-dark text-sm border-b border-gray-200">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Paid</th>
                    <th className="p-4 font-semibold">Delivered</th>
                    <th className="p-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 font-mono">{order._id.substring(0, 10)}...</td>
                      <td className="p-4 text-sm text-gray-700">{order.createdAt.substring(0, 10)}</td>
                      <td className="p-4 text-sm font-medium text-brand-dark">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-4 text-sm">
                        {order.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                            <i className="fas fa-check"></i> {order.paidAt.substring(0, 10)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                            <i className="fas fa-times"></i> Not Paid
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                            <i className="fas fa-check"></i> {order.deliveredAt.substring(0, 10)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                            <i className="fas fa-times"></i> Not Delivered
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link to={`/order/${order._id}`} className="bg-brand-dark text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-brand-orange transition-colors">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
