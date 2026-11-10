import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api/axios';

const OrderDetails = () => {
  const { id } = useParams();
  const { orderDetails: order, fetchOrderDetails, cancelOrder, isLoading, error } = useOrderStore();
  const { user } = useAuthStore();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Muốn thay đổi sản phẩm / số lượng');
  const [customReason, setCustomReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    fetchOrderDetails(id);
  }, [fetchOrderDetails, id]);

  const handleCancelOrder = async () => {
    const finalReason = selectedReason === 'Khác' ? customReason.trim() : selectedReason;
    if (selectedReason === 'Khác' && !finalReason) {
      alert('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    setCancelLoading(true);
    setActionMessage(null);

    const result = await cancelOrder(id, finalReason);
    setCancelLoading(false);

    if (result.success) {
      setIsCancelModalOpen(false);
      setActionMessage({ type: 'success', text: 'Hủy đơn hàng thành công!' });
      fetchOrderDetails(id);
    } else {
      setActionMessage({ type: 'error', text: result.message || 'Không thể hủy đơn hàng' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ xác nhận
          </span>
        );
      case 'Đang đóng gói':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <i className="fas fa-box text-[10px]"></i>
            Đang đóng gói
          </span>
        );
      case 'Đang giao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <i className="fas fa-truck text-[10px]"></i>
            Đang giao hàng
          </span>
        );
      case 'Hoàn thành':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <i className="fas fa-check-circle text-[10px]"></i>
            Đã hoàn thành
          </span>
        );
      case 'Đã hủy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <i className="fas fa-times-circle text-[10px]"></i>
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-gray-500">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error) {
    return <div className="min-h-[70vh] flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!order) {
    return null;
  }

  const canCancel = order.status === 'Chờ xác nhận';

  return (
    <div className="py-12 px-4 md:px-12 lg:px-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brand-dark">Đơn hàng #{order._id.substring(0, 8)}</h1>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <Link to="/orderhistory" className="text-brand-orange hover:underline text-sm font-medium flex items-center gap-1.5">
            <i className="fas fa-arrow-left text-xs"></i> Quay lại lịch sử đơn hàng
          </Link>
        </div>

        {/* Action alert message */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <i className={`fas ${actionMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {actionMessage.text}
          </div>
        )}

        {/* Cancelled Banner if Order is Cancelled */}
        {order.status === 'Đã hủy' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-red-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fas fa-ban"></i>
              </div>
              <div>
                <h3 className="font-bold text-base text-red-900">Đơn hàng này đã bị hủy</h3>
                {order.cancelledAt && (
                  <p className="text-xs text-red-700 mt-0.5">
                    Thời gian hủy: {new Date(order.cancelledAt).toLocaleString('vi-VN')}
                  </p>
                )}
                {order.cancelReason && (
                  <p className="text-sm text-red-800 mt-2">
                    <strong>Lý do hủy:</strong> {order.cancelReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            {/* Shipping Info Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <i className="fas fa-shipping-fast text-brand-orange"></i> Thông tin giao hàng
              </h2>
              <div className="text-gray-700 text-sm space-y-1.5 mb-4">
                <p><strong>Người nhận:</strong> {order.shippingAddress?.recipient || order.user?.name || user?.name || 'Khách hàng'}</p>
                {order.shippingAddress?.phone && <p><strong>Số điện thoại:</strong> {order.shippingAddress.phone}</p>}
                <p><strong>Email:</strong> {order.user?.email || user?.email || ''}</p>
                <p>
                  <strong>Địa chỉ:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country || 'Việt Nam'}
                </p>
              </div>

              {order.isDelivered ? (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> Đã giao vào ngày {new Date(order.deliveredAt).toLocaleDateString('vi-VN')}
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-clock"></i> Chưa giao hàng
                </div>
              )}
              {order.trackingNumber && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800"><strong>Mã vận đơn:</strong> {order.trackingNumber}</p>}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-brand-dark">Cập nhật đơn hàng</h2>
              <ol className="space-y-4 border-l-2 border-gray-100 pl-5">
                {(order.statusHistory?.length ? order.statusHistory : [{ status: order.status, note: 'Trạng thái hiện tại', createdAt: order.updatedAt || order.createdAt }]).map((event, index) => <li key={`${event.status}-${event.createdAt}-${index}`} className="relative"><span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand-orange ring-4 ring-white" /><p className="font-semibold text-brand-dark">{event.status}</p><p className="text-sm text-gray-600">{event.note}</p><time className="text-xs text-gray-400">{new Date(event.createdAt).toLocaleString('vi-VN')}</time></li>)}
              </ol>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <i className="fas fa-wallet text-brand-orange"></i> Phương thức thanh toán
              </h2>
              <p className="text-gray-700 text-sm mb-4">
                <strong>Hình thức:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> Đã thanh toán ngày {new Date(order.paidAt).toLocaleDateString('vi-VN')}
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-700 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-info-circle"></i> Thanh toán khi nhận hàng (COD)
                </div>
              )}
            </div>

            {/* Order Items Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <i className="fas fa-box-open text-brand-orange"></i> Sản phẩm trong đơn ({order.orderItems?.length || 0})
              </h2>
              <ul className="divide-y divide-gray-100">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="py-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 p-1">
                      {item.image && item.image !== '/images/sample.jpg' ? (
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <i className="fas fa-box text-gray-300 text-xl"></i>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product}`} className="font-semibold text-brand-dark hover:text-brand-orange line-clamp-1 transition-colors text-sm">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">Số lượng: {item.qty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-brand-dark text-sm">
                        ${(item.qty * item.price).toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-400">${item.price.toFixed(2)} / món</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-dark mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <i className="fas fa-receipt text-brand-orange"></i> Tổng quan chi phí
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tiền hàng</span>
                    <span className="font-medium text-brand-dark">${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-brand-dark">${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế</span>
                    <span className="font-medium text-brand-dark">${order.taxPrice.toFixed(2)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Giảm giá {order.couponCode ? `(${order.couponCode})` : ''}</span>
                      <span>-${order.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-brand-dark text-lg">
                    <span>Tổng thanh toán</span>
                    <span className="text-brand-orange">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full bg-white border border-red-300 text-red-600 font-bold py-2.5 px-4 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-sm"
                  >
                    <i className="fas fa-times-circle"></i>
                    Hủy đơn hàng
                  </button>
                )}

                {user && (user.role === 'admin' || user.role === 'staff') && !order.isDelivered && order.status !== 'Đã hủy' && (
                  <button
                    onClick={async () => {
                      try {
                        await api.put(`/orders/${order._id}/status`, { status: 'Hoàn thành' });
                        fetchOrderDetails(id);
                      } catch (err) {
                        alert('Lỗi cập nhật trạng thái đơn hàng');
                      }
                    }}
                    className="w-full bg-brand-dark text-white font-medium py-2.5 rounded-xl hover:bg-brand-orange transition-colors text-sm cursor-pointer"
                  >
                    Đánh dấu đã hoàn thành
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-dark">Xác nhận hủy đơn hàng</h3>
                  <p className="text-xs text-gray-500">Đơn hàng #{order._id.substring(0, 8)}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Bạn có chắc chắn muốn hủy đơn hàng này? Các sản phẩm sẽ được hoàn lại vào kho.
              </p>

              <div className="space-y-2 mb-4">
                <label className="text-xs font-bold text-gray-700 block">Lý do hủy đơn:</label>
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
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={cancelLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {cancelLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận hủy đơn'
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

export default OrderDetails;
