const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  readAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
