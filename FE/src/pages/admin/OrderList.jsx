import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_TABS = [
  'Tất cả',
  'Chờ xác nhận',
  'Đang đóng gói',
  'Đang giao',
  'Hoàn thành',
  'Đã hủy',
];

const ORDER_TRANSITIONS = {
  'Chờ xác nhận': ['Chờ xác nhận', 'Đang đóng gói', 'Đã hủy'],
  'Đang đóng gói': ['Đang đóng gói', 'Đang giao', 'Đã hủy'],
  'Đang giao': ['Đang giao', 'Hoàn thành', 'Đã hủy'],
  'Hoàn thành': ['Hoàn thành'],
  'Đã hủy': ['Đã hủy'],
};

const OrderList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeStatus = searchParams.get('status') || 'Tất cả';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
        setDrafts(
          Object.fromEntries(
            data.map((order) => [
              order._id,
              { status: order.status, trackingNumber: order.trackingNumber || '' },
            ])
          )
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const saveDelivery = async (orderId, overrideStatus = null) => {
    setSavingId(orderId);
    setError(null);
    const payload = overrideStatus
      ? { ...drafts[orderId], status: overrideStatus }
      : drafts[orderId];

    try {
      const { data } = await api.put(`/orders/${orderId}/status`, payload);
      setOrders((all) =>
        all.map((order) => (order._id === orderId ? { ...order, ...data, user: order.user } : order))
      );
      if (overrideStatus) {
        setDrafts((prev) => ({
          ...prev,
          [orderId]: { ...prev[orderId], status: overrideStatus },
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không cập nhật được đơn hàng.');
    } finally {
      setSavingId(null);
    }
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeStatus === 'Tất cả' || order.status === activeStatus;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      order._id.toLowerCase().includes(term) ||
      (order.user?.name && order.user.name.toLowerCase().includes(term)) ||
      (order.user?.email && order.user.email.toLowerCase().includes(term)) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng (Orders)</h2>
          <p className="text-sm text-gray-500">Xử lý xác nhận, đóng gói và giao hàng.</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'Tất cả'
              ? orders.length
              : orders.filter((o) => o.status === tab).length;
          const isActive = activeStatus === tab;

          return (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'Tất cả') {
                  searchParams.delete('status');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ status: tab });
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
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
                  <th className="p-4 font-bold">MÃ ĐƠN</th>
                  <th className="p-4 font-bold">KHÁCH HÀNG</th>
                  <th className="p-4 font-bold">NGÀY ĐẶT</th>
                  <th className="p-4 font-bold">TỔNG TIỀN</th>
                  <th className="p-4 font-bold">TRẠNG THÁI & THAO TÁC</th>
                  <th className="p-4 font-bold">GIAO HÀNG</th>
                  <th className="p-4 font-bold text-right">CHI TIẾT</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      Không tìm thấy đơn hàng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-600 font-semibold">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 font-semibold text-brand-dark">
                        {order.user ? order.user.name : 'Khách vãng lai'}
                        <div className="text-xs font-normal text-gray-400">{order.user?.email}</div>
                      </td>
                      <td className="p-4 text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 font-bold text-brand-orange">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            {order.status === 'Chờ xác nhận' && (
                              <button
                                onClick={() => saveDelivery(order._id, 'Đang đóng gói')}
                                disabled={savingId === order._id}
                                className="text-[11px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-0.5 rounded font-semibold"
                              >
                                Nhận gói
                              </button>
                            )}
                            {order.status === 'Đang đóng gói' && (
                              <button
                                onClick={() => saveDelivery(order._id, 'Đang giao')}
                                disabled={savingId === order._id}
                                className="text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-0.5 rounded font-semibold"
                              >
                                Đi giao
                              </button>
                            )}
                            {order.status === 'Đang giao' && (
                              <button
                                onClick={() => saveDelivery(order._id, 'Hoàn thành')}
                                disabled={savingId === order._id}
                                className="text-[11px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded font-semibold"
                              >
                                Hoàn tất
                              </button>
                            )}
                          </div>

                          {order.status === 'Hoàn thành' || order.status === 'Đã hủy' ? (
                            <span className="text-[11px] text-gray-400 italic block">
                              Đơn đã kết thúc (không thể đổi trạng thái)
                            </span>
                          ) : (
                            <>
                              <select
                                aria-label={`Trạng thái đơn ${order._id}`}
                                value={drafts[order._id]?.status || order.status}
                                onChange={(e) =>
                                  setDrafts((all) => ({
                                    ...all,
                                    [order._id]: { ...all[order._id], status: e.target.value },
                                  }))
                                }
                                className="block w-40 rounded border border-gray-200 px-2 py-1 text-xs"
                              >
                                {(ORDER_TRANSITIONS[order.status] || [order.status]).map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                              {(drafts[order._id]?.status === 'Đang giao' || order.trackingNumber) && (
                                <input
                                  aria-label={`Mã vận đơn ${order._id}`}
                                  placeholder="Mã vận đơn"
                                  value={drafts[order._id]?.trackingNumber || ''}
                                  onChange={(e) =>
                                    setDrafts((all) => ({
                                      ...all,
                                      [order._id]: { ...all[order._id], trackingNumber: e.target.value },
                                    }))
                                  }
                                  className="block w-40 rounded border border-gray-200 px-2 py-1 text-xs"
                                />
                              )}
                              <button
                                onClick={() => saveDelivery(order._id)}
                                disabled={savingId === order._id}
                                className="text-xs font-semibold text-brand-orange disabled:opacity-50"
                              >
                                {savingId === order._id ? 'Đang lưu…' : 'Lưu cập nhật'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
