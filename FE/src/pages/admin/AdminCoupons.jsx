import React, { useEffect, useState } from 'react';
import useCouponStore from '../../store/useCouponStore';

const DEFAULT_FORM = () => ({
  code: '',
  discountPercentage: 10,
  minOrderValue: 0,
  maxDiscountAmount: 0,
  description: '',
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
});

const AdminCoupons = () => {
  const { coupons, fetchCoupons, createCoupon, updateCoupon, deleteCoupon, loading, error } = useCouponStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM());
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM());
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      description: coupon.description || '',
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const res = editingId
      ? await updateCoupon(editingId, formData)
      : await createCoupon(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setFormData(DEFAULT_FORM());
      setEditingId(null);
    } else {
      setFormError(res.message);
    }
  };

  const handleToggleActive = async (coupon) => {
    await updateCoupon(coupon._id, { isActive: !coupon.isActive });
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã giảm giá "${code}"?`)) {
      await deleteCoupon(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Voucher & Mã giảm giá</h2>
          <p className="text-xs text-gray-500 mt-1">Tạo và cấu hình các chương trình khuyến mãi cho khách hàng</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-brand-orange text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-orange-600 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <i className="fas fa-plus"></i> Tạo mã mới
        </button>
      </div>

      {loading && coupons.length === 0 ? (
        <div className="text-center py-10">Đang tải mã giảm giá...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 text-sm">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-bold">
                <th className="p-4">STT</th>
                <th className="p-4">MÃ CODE</th>
                <th className="p-4">GIẢM (%)</th>
                <th className="p-4">ĐƠN TỐI THIỂU</th>
                <th className="p-4">HẠN SỬ DỤNG</th>
                <th className="p-4">ĐÃ DÙNG</th>
                <th className="p-4">TRẠNG THÁI</th>
                <th className="p-4 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {coupons.map((coupon, idx) => (
                <tr key={coupon._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="p-4 font-mono font-bold text-brand-dark">
                    <span className="bg-orange-50 text-brand-orange border border-orange-200 px-2 py-0.5 rounded text-xs">
                      {coupon.code}
                    </span>
                    {coupon.description && (
                      <p className="text-[11px] text-gray-400 font-sans font-normal mt-0.5">{coupon.description}</p>
                    )}
                  </td>
                  <td className="p-4 font-bold text-emerald-600">{coupon.discountPercentage}%</td>
                  <td className="p-4 text-xs text-gray-600">
                    {coupon.minOrderValue > 0 ? `$${coupon.minOrderValue}` : 'Không yêu cầu'}
                  </td>
                  <td className="p-4 text-xs text-gray-600">
                    {new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-700">
                    {coupon.usedCount || 0} lượt
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      title="Bấm để bật/tắt mã giảm giá"
                      className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        coupon.isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                    >
                      {coupon.isActive ? 'Đang chạy' : 'Tạm tắt'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => openEdit(coupon)}
                      className="text-brand-orange hover:text-orange-700 text-xs font-semibold cursor-pointer"
                    >
                      <i className="fas fa-pen mr-1"></i> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id, coupon.code)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400 text-sm">
                    Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Create/Edit Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-brand-dark">
                {editingId ? `Sửa voucher ${formData.code}` : 'Tạo Voucher mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Mã Code (In hoa, không dấu)*</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: PETVIP20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 font-mono uppercase font-bold focus:ring-2 focus:ring-brand-orange outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Giảm giá (%)*</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Đơn tối thiểu ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Giảm tối đa ($, 0 = không giới hạn)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ngày hết hạn*</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mô tả chương trình</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giảm 20% mừng khai trương"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-orange outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-bold transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Tạo voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
