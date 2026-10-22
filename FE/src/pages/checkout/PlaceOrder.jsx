import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    clearCart,
    getItemsPrice,
    getShippingPrice,
    getTaxPrice,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const { createOrder, isLoading, error, clearError } = useOrderStore();
  const { user, fetchProfile } = useAuthStore();

  const itemsPrice = getItemsPrice();
  const shippingPrice = getShippingPrice();
  const taxPrice = getTaxPrice();
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
            <span className="text-xs font-bold text-brand-dark mt-1.5">Place Order</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-xl text-red-500"></i>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: Details & Items */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Shipping Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-brand-orange"></i>
                  Delivery Address
                </h2>
                <Link
                  to="/shipping"
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                >
                  <i className="fas fa-pen text-[10px]"></i> Edit
                </Link>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Recipient: </strong> {user?.name}</p>
                <p>
                  <strong>Address: </strong> {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                {shippingAddress.phone && (
                  <p><strong>Phone: </strong> {shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <i className="far fa-credit-card text-brand-orange"></i>
                  Payment Method
                </h2>
                <Link
                  to="/payment"
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                >
                  <i className="fas fa-pen text-[10px]"></i> Edit
                </Link>
              </div>

              <div className="text-sm text-gray-700 flex items-center gap-2">
                <span className="font-semibold">{paymentMethod}</span>
                {paymentMethod === 'Cash on Delivery' && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Pay on Delivery
                  </span>
                )}
              </div>
            </div>

            {/* Order Items List */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <i className="fas fa-box-open text-brand-orange"></i>
                  Order Items ({totalItems})
                </h2>
                <Link
                  to="/cart"
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                >
                  <i className="fas fa-shopping-cart text-[10px]"></i> Modify Cart
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center p-1">
                        {item.image && item.image !== '/images/sample.jpg' ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <i className="fas fa-box text-gray-400"></i>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-bold text-sm text-brand-dark hover:text-brand-orange transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs text-gray-500">
                          {item.qty} × ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="font-bold text-sm text-brand-dark shrink-0">
                      ${(Number(item.qty) * Number(item.price)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="w-full lg:w-1/3 sticky top-24 space-y-4">
            {/* Points to earn badge */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm">
                <i className="fas fa-coins"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-brand-dark">Earn Reward Points</p>
                <p className="text-xs text-brand-orange font-semibold">
                  +{pointsToEarn} points will be added to your account!
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
