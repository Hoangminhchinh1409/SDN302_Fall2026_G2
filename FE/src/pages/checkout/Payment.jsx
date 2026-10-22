import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const Payment = () => {
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCartStore();
  const navigate = useNavigate();

  const [method, setMethod] = useState(paymentMethod || 'PayPal');

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
    <div className="min-h-[70vh] py-16 px-4 md:px-12 flex justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Payment Method</h1>
        
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">1</div>
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">2</div>
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:border-brand-orange">
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={method === 'PayPal'}
                onChange={(e) => setMethod(e.target.value)}
                className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
              />
              <span className="font-medium text-gray-700">PayPal or Credit Card</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:border-brand-orange">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={method === 'COD'}
                onChange={(e) => setMethod(e.target.value)}
                className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
              />
              <span className="font-medium text-gray-700">Cash On Delivery</span>
            </label>
          </div>
          
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/shipping')}
              className="w-1/3 bg-gray-200 text-brand-dark font-medium py-3 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-2/3 bg-brand-dark text-white font-medium py-3 rounded-md hover:bg-brand-orange transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
