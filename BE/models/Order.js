const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, default: '/images/sample.jpg' },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, default: 'Hanoi' },
    postalCode: { type: String, default: '100000' },
    country: { type: String, default: 'Vietnam' },
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery',
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  couponCode: {
    type: String,
  },
  discountAmount: {
    type: Number,
    default: 0.0,
  },
  status: {
    type: String,
    required: true,
    enum: ['Chờ xác nhận', 'Đang đóng gói', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
    default: 'Chờ xác nhận',
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  trackingNumber: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
