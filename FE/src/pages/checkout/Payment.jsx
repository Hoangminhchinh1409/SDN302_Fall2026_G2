import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const Payment = () => {
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCartStore();
  const navigate = useNavigate();

  const [method, setMethod] = useState(paymentMethod || 'Cash on Delivery');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(method);
    navigate('/placeorder');
  };

  return (
    <div className="min-h-[75vh] py-12 px-4 md:px-8 lg:px-16 flex justify-center bg-gray-50">
      <div className="w-full max-w-xl">
        {/* Checkout Stepper */}
        <div className="flex items-center justify-between mb-8 relative px-6">
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
            <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-orange-100">
              2
            </div>
            <span className="text-xs font-bold text-brand-dark mt-1.5">Payment</span>
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
              <i className="far fa-credit-card"></i>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-brand-dark">Payment Method</h1>
              <p className="text-xs text-gray-500">Select how you want to pay for your order</p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  method === 'Cash on Delivery'
                    ? 'border-brand-orange bg-orange-50/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={method === 'Cash on Delivery'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                  />
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-gray-500">Pay cash upon receiving your pet products at home</span>
                  </div>
                </div>
                <i className="fas fa-money-bill-wave text-xl text-emerald-600"></i>
              </label>

              {/* Option 2: PayPal or Card */}
              <label
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  method === 'PayPal'
                    ? 'border-brand-orange bg-orange-50/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={method === 'PayPal'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                  />
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">PayPal / Credit Card</span>
                    <span className="text-xs text-gray-500">Fast and secure international payment via PayPal</span>
                  </div>
                </div>
                <i className="fab fa-paypal text-xl text-blue-600"></i>
              </label>

              {/* Option 3: Bank Transfer */}
              <label
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  method === 'Bank Transfer'
                    ? 'border-brand-orange bg-orange-50/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={method === 'Bank Transfer'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                  />
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">Bank Transfer (VietQR)</span>
                    <span className="text-xs text-gray-500">Instant scan QR code via mobile banking apps</span>
                  </div>
                </div>
                <i className="fas fa-qrcode text-xl text-purple-600"></i>
              </label>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4">
              <Link
                to="/shipping"
                className="text-sm font-semibold text-gray-500 hover:text-brand-dark flex items-center gap-1.5"
              >
                <i className="fas fa-chevron-left text-xs"></i> Back to Shipping
              </Link>

              <button
                type="submit"
                className="bg-brand-dark text-white font-bold px-8 py-3.5 rounded-xl hover:bg-brand-orange transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Summary</span>
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
