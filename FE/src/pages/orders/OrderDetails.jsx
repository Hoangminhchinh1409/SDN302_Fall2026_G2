import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useOrderStore from '../../store/useOrderStore';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api/axios';

const OrderDetails = () => {
  const { id } = useParams();
  const { orderDetails: order, fetchOrderDetails, isLoading, error } = useOrderStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchOrderDetails(id);
  }, [fetchOrderDetails, id]);

  if (isLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-[70vh] flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="py-16 px-4 md:px-12 lg:px-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Order {order._id}</h1>
            <p className="text-gray-500 text-sm mt-1">Placed on {order.createdAt.substring(0, 10)}</p>
          </div>
          <Link to="/orderhistory" className="text-brand-orange hover:underline text-sm font-medium">
            <i className="fas fa-arrow-left mr-2"></i> Back to History
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Shipping</h2>
              <p className="text-gray-700 mb-4">
                <strong>Name: </strong> {order.user.name} <br />
                <strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-brand-orange hover:underline">{order.user.email}</a> <br />
                <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="bg-green-100 text-green-700 p-3 rounded text-sm font-medium">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 p-3 rounded text-sm font-medium">
                  Not Delivered
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Payment Method</h2>
              <p className="text-gray-700 mb-4">
                <strong>Method: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div className="bg-green-100 text-green-700 p-3 rounded text-sm font-medium">
                  Paid on {order.paidAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 p-3 rounded text-sm font-medium">
                  Not Paid
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Order Items</h2>
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
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
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-brand-dark mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-brand-text">
                  <span>Items</span>
                  <span className="font-medium">${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Shipping</span>
                  <span className="font-medium">${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Tax</span>
                  <span className="font-medium">${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-brand-dark text-lg">
                  <span>Total</span>
                  <span className="text-brand-orange">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {user && (user.role === 'admin' || user.role === 'staff') && !order.isDelivered && (
                <button
                  onClick={async () => {
                    try {
                      await api.put(`/orders/${order._id}/deliver`);
                      fetchOrderDetails(id);
                    } catch (err) {
                      alert('Error updating delivery status');
                    }
                  }}
                  className="w-full bg-brand-dark text-white font-medium py-3 rounded-md hover:bg-brand-orange transition-colors mt-4"
                >
                  Mark As Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
