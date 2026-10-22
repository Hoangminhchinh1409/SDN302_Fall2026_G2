import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress, cartItems } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress?.address || user?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || 'Hanoi');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '100000');
  const [country, setCountry] = useState(shippingAddress?.country || 'Vietnam');
  const [phone, setPhone] = useState(shippingAddress?.phone || user?.phone || '');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country, phone });
    navigate('/payment');
  };

  return (
    <div className="min-h-[75vh] py-12 px-4 md:px-8 lg:px-16 flex justify-center bg-gray-50">
      <div className="w-full max-w-xl">
        {/* Checkout Stepper */}
        <div className="flex items-center justify-between mb-8 relative px-6">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-orange-100">
              1
            </div>
            <span className="text-xs font-bold text-brand-dark mt-1.5">Shipping</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span className="text-xs font-medium text-gray-400 mt-1.5">Payment</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <span className="text-xs font-medium text-gray-400 mt-1.5">Place Order</span>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-lg">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-brand-dark">Shipping Address</h1>
              <p className="text-xs text-gray-500">Where should we deliver your pet goodies?</p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                placeholder="123 Nguyen Trai, Thanh Xuan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
                  City / Province <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                  placeholder="Hanoi or Ho Chi Minh City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                  placeholder="100000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  id="country"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                  placeholder="Vietnam"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4">
              <Link
                to="/cart"
                className="text-sm font-semibold text-gray-500 hover:text-brand-dark flex items-center gap-1.5"
              >
                <i className="fas fa-chevron-left text-xs"></i> Back to Cart
              </Link>

              <button
                type="submit"
                className="bg-brand-dark text-white font-bold px-8 py-3.5 rounded-xl hover:bg-brand-orange transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
