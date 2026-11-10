import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
        setDrafts(Object.fromEntries(data.map((order) => [order._id, { status: order.status, trackingNumber: order.trackingNumber || '' }])));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const saveDelivery = async (orderId) => {
    setSavingId(orderId); setError(null);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, drafts[orderId]);
      setOrders((all) => all.map((order) => order._id === orderId ? { ...order, ...data, user: order.user } : order));
    } catch (err) { setError(err.response?.data?.message || 'Không cập nhật được đơn hàng.'); }
    finally { setSavingId(null); }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Chờ xác nhận</span>;
      case 'Đang đóng gói':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Đang đóng gói</span>;
      case 'Đang giao':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Đang giao</span>;
      case 'Hoàn thành':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Hoàn thành</span>;
      case 'Đã hủy':
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng (Orders)</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải danh sách đơn hàng...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-bold">STT</th>
                  <th className="p-4 font-bold">KHÁCH HÀNG</th>
                  <th className="p-4 font-bold">NGÀY ĐẶT</th>
                  <th className="p-4 font-bold">TỔNG TIỀN</th>
                  <th className="p-4 font-bold">TRẠNG THÁI</th>
                  <th className="p-4 font-bold">GIAO HÀNG</th>
                  <th className="p-4 font-bold text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {orders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500">{index + 1}</td>
                    <td className="p-4 font-semibold text-brand-dark">
                      {order.user ? order.user.name : 'Khách vãng lai'}
                      <div className="text-xs font-normal text-gray-400">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 font-bold text-brand-orange">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4"><div className="space-y-2">{getStatusBadge(order.status)}<select aria-label={`Trạng thái đơn ${order._id}`} value={drafts[order._id]?.status || order.status} onChange={(e) => setDrafts((all) => ({ ...all, [order._id]: { ...all[order._id], status: e.target.value } }))} className="block w-40 rounded border border-gray-200 px-2 py-1 text-xs"><option>Chờ xác nhận</option><option>Đang đóng gói</option><option>Đang giao</option><option>Hoàn thành</option><option>Đã hủy</option></select>{(drafts[order._id]?.status === 'Đang giao' || order.trackingNumber) && <input aria-label={`Mã vận đơn ${order._id}`} placeholder="Mã vận đơn" value={drafts[order._id]?.trackingNumber || ''} onChange={(e) => setDrafts((all) => ({ ...all, [order._id]: { ...all[order._id], trackingNumber: e.target.value } }))} className="block w-40 rounded border border-gray-200 px-2 py-1 text-xs" />}<button onClick={() => saveDelivery(order._id)} disabled={savingId === order._id} className="text-xs font-semibold text-brand-orange disabled:opacity-50">{savingId === order._id ? 'Đang lưu…' : 'Lưu cập nhật'}</button></div></td>
                    <td className="p-4">
                      {order.isDelivered ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                          <i className="fas fa-check mr-1"></i> Đã giao
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium">
                          Chưa giao
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/order/${order._id}`}
                        className="bg-brand-dark text-white px-3 py-1.5 rounded-lg hover:bg-brand-orange transition-colors inline-block text-xs font-semibold"
                      >
                        Chi tiết
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
