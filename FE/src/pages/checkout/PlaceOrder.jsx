import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api/axios';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    clearCart,
    getItemsPrice,
    getShippingPrice,
    getTaxPrice,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const { createOrder, isLoading, error, clearError } = useOrderStore();
  const { user, fetchProfile } = useAuthStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showVouchers, setShowVouchers] = useState(false);

  const itemsPrice = getItemsPrice();
  const shippingPrice = getShippingPrice();
  const taxPrice = getTaxPrice();
  const discountAmount = getDiscountAmount();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // Calculated reward points to earn (1 point per dollar)
  const pointsToEarn = Math.round(totalPrice);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    } else if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [cartItems, shippingAddress, paymentMethod, navigate]);

  useEffect(() => {
    // Fetch available coupons
    const fetchVouchers = async () => {
      try {
        const { data } = await api.get('/coupons/available');
        setAvailableCoupons(data || []);
      } catch (err) {
        // Silently fail if unauthenticated
      }
    };
    fetchVouchers();
  }, []);

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) return;

    setCouponLoading(true);
    setCouponMessage(null);

    const result = await applyCoupon(code);
    setCouponLoading(false);

    if (result.success) {
      setCouponMessage({ type: 'success', text: result.message });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: result.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage({ type: 'info', text: 'Đã hủy áp dụng mã giảm giá' });
  };

  const placeOrderHandler = async () => {
    clearError();

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: Number(item.qty),
        image: item.image || '/images/sample.jpg',
        price: Number(item.price),
        product: item.product,
      })),
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city || 'Hanoi',
        postalCode: shippingAddress.postalCode || '100000',
        country: shippingAddress.country || 'Vietnam',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      couponCode: appliedCoupon?.code,
      totalPrice,
    };

    const createdOrder = await createOrder(orderPayload);

    if (createdOrder) {
      clearCart();
      // Fetch updated profile to show new reward points earned
      await fetchProfile();
      navigate(`/order/${createdOrder._id}`);
    }
  };

  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Checkout Stepper */}
        <div className="flex items-center justify-between mb-8 relative max-w-xl mx-auto px-6">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-orange -z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <Link
              to="/shipping"
              className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm"
            >
              <i className="fas fa-check text-xs"></i>
            </Link>
            <span className="text-xs font-semibold text-gray-600 mt-1.5">Shipping</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <Link
              to="/payment"
              className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm"
            >
              <i className="fas fa-check text-xs"></i>
            </Link>
            <span className="text-xs font-semibold text-gray-600 mt-1.5">Payment</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-orange-100">
              3
            </div>
            <span className="text-xs font-bold text-brand-orange mt-1.5">Place Order</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700">
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Info Columns */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Shipping Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-brand-orange"></i> Shipping Information
                </h2>
                <Link to="/shipping" className="text-xs font-bold text-brand-orange hover:underline">
                  Edit
                </Link>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Recipient:</strong> {user?.name || 'Customer'}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <i className="fas fa-credit-card text-brand-orange"></i> Payment Method
                </h2>
                <Link to="/payment" className="text-xs font-bold text-brand-orange hover:underline">
                  Edit
                </Link>
              </div>
              <p className="text-sm text-gray-700 font-medium">{paymentMethod}</p>
            </div>

            {/* Order Items Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <i className="fas fa-shopping-bag text-brand-orange"></i> Order Items ({totalItems})
                </h2>
                <Link to="/cart" className="text-xs font-bold text-brand-orange hover:underline">
                  Edit Cart
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.product} className="py-3 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 p-1">
                      {item.image && item.image !== '/images/sample.jpg' ? (
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <i className="fas fa-box text-gray-300 text-lg"></i>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-sm font-bold text-brand-dark hover:text-brand-orange transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.qty} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-extrabold text-sm text-brand-dark">
                      ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary & Coupon Column */}
          <div className="w-full lg:w-1/3 space-y-6 sticky top-24">
            {/* Coupon Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
                <i className="fas fa-ticket-alt text-brand-orange"></i> Mã giảm giá / Voucher
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="inline-block bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-xs text-emerald-800 font-bold mt-1">
                      Giảm {appliedCoupon.discountPercentage}% (-${discountAmount.toFixed(2)})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer underline"
                  >
                    Hủy mã
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Nhập mã voucher..."
                      className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs uppercase font-bold focus:ring-2 focus:ring-brand-orange outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-brand-dark hover:bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {couponLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Áp dụng'}
                    </button>
                  </div>

                  {/* Toggle available vouchers */}
                  {availableCoupons.length > 0 && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowVouchers(!showVouchers)}
                        className="text-[11px] font-semibold text-brand-orange hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <i className="fas fa-tags text-[10px]"></i>
                        {showVouchers ? 'Ẩn danh sách voucher' : `Xem ${availableCoupons.length} voucher đang có`}
                      </button>

                      {showVouchers && (
                        <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {availableCoupons.map((v) => (
                            <div
                              key={v.code}
                              onClick={() => handleApplyCoupon(v.code)}
                              className="p-2 border border-dashed border-gray-200 rounded-lg hover:border-brand-orange hover:bg-orange-50/50 cursor-pointer transition-colors flex justify-between items-center text-xs"
                            >
                              <div>
                                <span className="font-bold text-brand-dark font-mono">{v.code}</span>
                                <p className="text-[10px] text-gray-500">
                                  Giảm {v.discountPercentage}% {v.minOrderValue > 0 ? `(Đơn từ $${v.minOrderValue})` : ''}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-brand-orange">Dùng ngay</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {couponMessage && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    couponMessage.type === 'success'
                      ? 'text-emerald-600'
                      : couponMessage.type === 'error'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Reward Points Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm text-sm">
                <i className="fas fa-coins"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-brand-dark">Tích lũy điểm thưởng</p>
                <p className="text-xs text-brand-orange font-semibold">
                  +{pointsToEarn} điểm sẽ được cộng vào tài khoản của bạn!
                </p>
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-extrabold text-brand-dark mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-brand-dark">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-brand-dark">
                    {shippingPrice === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `$${shippingPrice.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (10%)</span>
                  <span className="font-semibold text-brand-dark">${taxPrice.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Voucher ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-brand-dark">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-brand-orange">
                      ${totalPrice.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-gray-400">All fees & taxes included</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0 || isLoading}
                className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-orange transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock text-sm"></i>
                    <span>Place Order (${totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                By placing your order, you agree to Pet Store terms & conditions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
