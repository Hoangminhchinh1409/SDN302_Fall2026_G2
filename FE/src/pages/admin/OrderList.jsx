import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">STT</th>
                  <th className="p-4 font-medium">USER</th>
                  <th className="p-4 font-medium">DATE</th>
                  <th className="p-4 font-medium">TOTAL</th>
                  <th className="p-4 font-medium">PAID</th>
                  <th className="p-4 font-medium">DELIVERED</th>
                  <th className="p-4 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order, index) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium text-brand-dark">{order.user && order.user.name}</td>
                    <td className="p-4">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                          {order.paidAt.substring(0, 10)}
                        </span>
                      ) : (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                          <i className="fas fa-times"></i>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.isDelivered ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                          {order.deliveredAt.substring(0, 10)}
                        </span>
                      ) : (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                          <i className="fas fa-times"></i>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/order/${order._id}`}
                        className="bg-brand-dark text-white px-3 py-1.5 rounded hover:bg-brand-orange transition-colors inline-block text-xs font-medium"
                      >
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
  );
};

export default OrderList;
