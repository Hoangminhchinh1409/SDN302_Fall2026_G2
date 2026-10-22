import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    getItemsPrice,
    getShippingPrice,
    getTaxPrice,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const itemsPrice = getItemsPrice();
  const shippingPrice = getShippingPrice();
  const taxPrice = getTaxPrice();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const freeShippingThreshold = 100;
  const freeShippingDifference = Math.max(0, freeShippingThreshold - itemsPrice);
  const freeShippingProgress = Math.min(100, (itemsPrice / freeShippingThreshold) * 100);

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50 min-h-[75vh]">
      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">Review your selected pet items before proceeding to checkout</p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1.5"
          >
            <i className="fas fa-arrow-left text-xs"></i> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fas fa-shopping-basket"></i>
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">Your Cart is Currently Empty</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Looks like you haven't added any products to your cart yet. Explore our top treats, toys, and accessories!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <i className="fas fa-shopping-bag text-sm"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-4">
              {/* Free shipping banner */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <i className="fas fa-shipping-fast text-brand-orange"></i>
                    {freeShippingDifference === 0 ? (
                      <span className="text-emerald-600 font-bold">🎉 Congratulations! You have unlocked FREE Shipping!</span>
                    ) : (
                      <span>Add <strong className="text-brand-orange">${freeShippingDifference.toFixed(2)}</strong> more to get <strong>FREE Shipping</strong>!</span>
                    )}
                  </span>
                  <span className="text-gray-500">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      freeShippingDifference === 0 ? 'bg-emerald-500' : 'bg-brand-orange'
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Items Table Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <span className="text-sm font-bold text-gray-700">
                    Items in Cart ({totalItems})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fas fa-trash-alt text-[11px]"></i> Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center p-1">
                        {item.image && item.image !== '/images/sample.jpg' ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <i className="fas fa-box-open text-gray-400 text-2xl"></i>
                        )}
                      </div>

                      {/* Product Name & Unit Price */}
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-bold text-brand-dark hover:text-brand-orange transition-colors text-base line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">Unit Price: ${Number(item.price).toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-xl bg-gray-50/60 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-brand-orange hover:border-brand-orange flex items-center justify-center text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-brand-dark select-none">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product, item.qty + 1)}
                          disabled={item.qty >= (item.countInStock || 99)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-brand-orange hover:border-brand-orange flex items-center justify-center text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      {/* Total for item */}
                      <div className="text-right w-24 shrink-0">
                        <div className="font-extrabold text-base text-brand-dark">
                          ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product)}
                        title="Remove from Cart"
                        className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary Card */}
            <div className="w-full lg:w-1/3 sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-brand-dark mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <i className="far fa-credit-card text-brand-orange text-lg"></i>
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal ({totalItems})</span>
                    <span className="font-semibold text-brand-dark">${itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      Estimated Shipping
                      {shippingPrice === 0 && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded">FREE</span>
                      )}
                    </span>
                    <span className="font-semibold text-brand-dark">
                      {shippingPrice === 0 ? '$0.00' : `$${shippingPrice.toFixed(2)}`}
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
                      <p className="text-[11px] text-gray-400">Includes taxes & shipping</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkoutHandler}
                  className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-orange transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </button>

                <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 space-y-1.5">
                  <div className="flex items-center justify-center gap-3 text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><i className="fas fa-shield-alt text-emerald-500"></i> Secure Checkout</span>
                    <span className="flex items-center gap-1"><i className="fas fa-undo text-blue-500"></i> Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
