const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).populate('order', 'status').sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
};

const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, readAt: null },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: 'Không tìm thấy thông báo chưa đọc.' });
  res.json(notification);
};

module.exports = { getMyNotifications, markNotificationRead };
