import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCartStore();
  const { createOrder, isLoading, error, successMessage, clearError } = useOrderStore();
  const { user } = useAuthStore();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  useEffect(() => {
    if (successMessage) {
      clearCart();
      navigate('/orderhistory'); // We'll navigate to order history after successful placement for now
      clearError();
    }
  }, [successMessage, navigate, clearCart, clearError]);

  const placeOrderHandler = () => {
    createOrder({
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
  };

  return (
    <div className="py-16 px-4 md:px-12 lg:px-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Place Order</h1>
        
        <div className="flex justify-between mb-8 relative max-w-md mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-orange -z-10"></div>
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">1</div>
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">2</div>
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">3</div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Shipping</h2>
              <p className="text-gray-700">
                <strong>Name: </strong> {user?.name} <br />
                <strong>Address: </strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <div className="mt-4">
                <Link to="/shipping" className="text-brand-orange hover:underline text-sm font-medium">Edit Shipping</Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Payment Method</h2>
              <p className="text-gray-700">
                <strong>Method: </strong> {paymentMethod}
              </p>
              <div className="mt-4">
                <Link to="/payment" className="text-brand-orange hover:underline text-sm font-medium">Edit Payment</Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Order Items</h2>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li key={index} className="py-4 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        {item.image && item.image !== '/images/sample.jpg' ? (
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <i className="fas fa-box text-gray-400"></i>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="font-medium text-brand-dark hover:text-brand-orange">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-brand-text font-medium">
                        {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-brand-dark mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-brand-text">
                  <span>Items</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Shipping</span>
                  <span className="font-medium">${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Tax</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-brand-dark">
                  <span>Total</span>
                  <span className="text-brand-orange">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0 || isLoading}
                className={`w-full font-medium py-3 rounded-md transition-colors ${
                  cartItems.length === 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-dark text-white hover:bg-brand-orange'
                }`}
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
