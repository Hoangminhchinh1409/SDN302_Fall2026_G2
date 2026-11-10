import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [notice, setNotice] = useState('');

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

  const updateStatus = async (order) => {
    const status = statusDrafts[order._id] || order.status;
    if (status === order.status) return;

    setUpdatingOrderId(order._id);
    setError(null);
    setNotice('');
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, { status });
      setOrders((current) => current.map((item) => item._id === order._id ? data : item));
      setStatusDrafts((current) => {
        const next = { ...current };
        delete next[order._id];
        return next;
      });
      setNotice(`Order ${order._id.slice(-6)} status updated.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

        {notice && <div role="status" className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-700">{notice}</div>}
        {error && !isLoading && <div role="alert" className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">STT</th>
                  <th className="p-4 font-medium">USER</th>
                  <th className="p-4 font-medium">DATE</th>
                  <th className="p-4 font-medium">TOTAL</th>
                  <th className="p-4 font-medium">STATUS</th>
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
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Status for order ${order._id}`}
                          value={statusDrafts[order._id] || order.status}
                          onChange={(event) => setStatusDrafts((current) => ({ ...current, [order._id]: event.target.value }))}
                          disabled={updatingOrderId === order._id}
                          className="max-w-44 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-700 focus:border-brand-orange focus:outline-none"
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đang đóng gói">Đang đóng gói</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => updateStatus(order)}
                          disabled={updatingOrderId === order._id || (statusDrafts[order._id] || order.status) === order.status}
                          className="rounded bg-brand-dark px-2.5 py-1.5 text-xs font-medium text-white hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {updatingOrderId === order._id ? 'Saving' : 'Save'}
                        </button>
                      </div>
                    </td>
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
