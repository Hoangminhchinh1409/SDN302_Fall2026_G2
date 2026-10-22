import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="py-16 px-4 md:px-12 lg:px-24 bg-white min-h-[60vh]">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
          <Link to="/shop" className="bg-brand-orange text-white px-6 py-2 rounded-md hover:bg-orange-600">
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-brand-dark text-sm border-b border-gray-200">
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Quantity</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product} className="border-b border-gray-100 last:border-0">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          {item.image && item.image !== '/images/sample.jpg' ? (
                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <i className="fas fa-box text-gray-400"></i>
                          )}
                        </div>
                        <Link to={`/product/${item.product}`} className="font-medium text-brand-dark hover:text-brand-orange">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-4 text-brand-text">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <select 
                          className="border border-gray-300 rounded p-1 text-sm focus:outline-none focus:border-brand-orange"
                          value={item.qty}
                          onChange={(e) => addToCart({ ...item, _id: item.product }, Number(e.target.value))}
                        >
                          {[...Array(item.countInStock > 0 ? item.countInStock : 10).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 font-medium text-brand-dark">${(item.price * item.qty).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => removeFromCart(item.product)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-brand-dark mb-6">Cart Totals</h2>
              <div className="flex justify-between items-center mb-4 text-brand-text">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="font-medium">${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center mb-6">
                <span className="font-bold text-brand-dark">Total</span>
                <span className="font-bold text-brand-orange text-xl">${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
              <button 
                onClick={checkoutHandler}
                className="w-full bg-brand-dark text-white font-medium py-3 rounded-md hover:bg-brand-orange transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
