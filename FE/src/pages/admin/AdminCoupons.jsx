import React, { useEffect } from 'react';
import useCouponStore from '../../store/useCouponStore';

const AdminCoupons = () => {
  const { coupons, fetchCoupons, loading, error } = useCouponStore();

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons Management</h2>
        <button className="bg-brand-orange text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600">
          <i className="fas fa-plus mr-2"></i> Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading coupons...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">STT</th>
                <th className="p-4 font-medium">CODE</th>
                <th className="p-4 font-medium">DISCOUNT (%)</th>
                <th className="p-4 font-medium">EXPIRY DATE</th>
                <th className="p-4 font-medium">IS ACTIVE</th>
                <th className="p-4 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {coupons.map((coupon, idx) => (
                <tr key={coupon._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{idx + 1}</td>
                  <td className="p-4 font-medium text-brand-dark">{coupon.code}</td>
                  <td className="p-4 text-gray-600">{coupon.discountPercentage}%</td>
                  <td className="p-4 text-gray-600">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">{coupon.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-brand-orange hover:text-orange-700 underline text-sm">Edit</button>
                    <button className="text-red-500 hover:text-red-700 underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
