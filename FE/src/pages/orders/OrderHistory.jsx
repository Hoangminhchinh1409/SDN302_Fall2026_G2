import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';

const OrderHistory = () => {
  const { myOrders, fetchMyOrders, cancelOrder, isLoading, error } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Muốn thay đổi sản phẩm / số lượng');
  const [customReason, setCustomReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMyOrders(activeTab === 'ALL' ? '' : activeTab);
    }
  }, [user, navigate, fetchMyOrders, activeTab]);

  const handleOpenCancelModal = (orderId) => {
    setCancellingOrderId(orderId);
    setSelectedReason('Muốn thay đổi sản phẩm / số lượng');
    setCustomReason('');
    setFeedbackMsg(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrderId) return;
    const finalReason = selectedReason === 'Khác' ? customReason.trim() : selectedReason;
    if (selectedReason === 'Khác' && !finalReason) {
      alert('Vui lòng nhập lý do cụ thể');
      return;
    }

    setIsSubmittingCancel(true);
    const result = await cancelOrder(cancellingOrderId, finalReason);
    setIsSubmittingCancel(false);

    if (result.success) {
      setFeedbackMsg({ type: 'success', text: 'Hủy đơn hàng thành công!' });
      setCancellingOrderId(null);
      fetchMyOrders(activeTab === 'ALL' ? '' : activeTab);
    } else {
      setFeedbackMsg({ type: 'error', text: result.message || 'Không thể hủy đơn hàng' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ xác nhận
          </span>
        );
      case 'Đang đóng gói':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            <i className="fas fa-box text-[9px]"></i>
            Đang đóng gói
          </span>
        );
      case 'Đang giao':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <i className="fas fa-truck text-[9px]"></i>
            Đang giao
          </span>
        );
      case 'Hoàn thành':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <i className="fas fa-check text-[9px]"></i>
            Hoàn thành
          </span>
        );
      case 'Đã hủy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <i className="fas fa-times text-[9px]"></i>
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const tabs = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
    { label: 'Đang đóng gói', value: 'Đang đóng gói' },
    { label: 'Đang giao', value: 'Đang giao' },
    { label: 'Hoàn thành', value: 'Hoàn thành' },
    { label: 'Đã hủy', value: 'Đã hủy' },
  ];

  return (
    <div className="py-12 px-4 md:px-12 lg:px-24 bg-gray-50 min-h-[75vh]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-dark">Lịch sử đơn hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi quá trình giao nhận các đơn hàng của bạn</p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1.5"
          >
            <i className="fas fa-shopping-bag text-xs"></i> Tiếp tục mua sắm
          </Link>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <i className={`fas ${feedbackMsg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {feedbackMsg.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-brand-dark text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 font-medium">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 border border-red-200 text-sm font-medium">
            {error}
          </div>
        ) : myOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fas fa-receipt"></i>
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-gray-500 mb-6">
              {activeTab === 'ALL'
                ? 'Bạn chưa đặt đơn hàng nào trên hệ thống.'
                : `Không có đơn hàng nào ở trạng thái "${activeTab}".`}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-xs"
            >
              <i className="fas fa-shopping-cart"></i> Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs border-b border-gray-200 uppercase tracking-wider">
                    <th className="p-4 font-bold">Mã đơn</th>
                    <th className="p-4 font-bold">Ngày đặt</th>
                    <th className="p-4 font-bold">Sản phẩm</th>
                    <th className="p-4 font-bold">Tổng tiền</th>
                    <th className="p-4 font-bold">Trạng thái</th>
                    <th className="p-4 font-bold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {myOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-xs text-brand-dark">
                        #{order._id.substring(0, 8)}
                      </td>
                      <td className="p-4 text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 text-xs text-gray-700 max-w-xs">
                        <div className="line-clamp-1 font-medium">
                          {order.orderItems?.map((it) => it.name).join(', ') || 'Sản phẩm'}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {order.orderItems?.reduce((acc, it) => acc + (it.qty || 1), 0)} món
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-sm text-brand-orange">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-2">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <i className="fas fa-eye text-[10px]"></i> Chi tiết
                        </Link>
                        {order.status === 'Chờ xác nhận' && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancelModal(order._id)}
                            className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <i className="fas fa-times text-[10px]"></i> Hủy đơn
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Confirm Cancel */}
        {cancellingOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-dark">Xác nhận hủy đơn hàng</h3>
                  <p className="text-xs text-gray-500">Đơn hàng #{cancellingOrderId.substring(0, 8)}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                Bạn có chắc chắn muốn hủy đơn hàng này? Số lượng tồn kho sẽ được hoàn lại cho cửa hàng.
              </p>

              <div className="space-y-2 mb-4">
                <label className="text-xs font-bold text-gray-700 block">Chọn lý do hủy:</label>
                {[
                  'Muốn thay đổi sản phẩm / số lượng',
                  'Thay đổi địa chỉ giao hàng',
                  'Tìm thấy giá tốt hơn ở nơi khác',
                  'Không có nhu cầu mua nữa',
                  'Khác',
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer text-xs text-gray-700"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="text-brand-orange focus:ring-brand-orange"
                    />
                    <span>{reason}</span>
                  </label>
                ))}

                {selectedReason === 'Khác' && (
                  <textarea
                    rows={2}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Vui lòng nhập lý do cụ thể..."
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none mt-2"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrderId(null)}
                  disabled={isSubmittingCancel}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isSubmittingCancel}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSubmittingCancel ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Đang hủy...
                    </>
                  ) : (
                    'Xác nhận hủy'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
