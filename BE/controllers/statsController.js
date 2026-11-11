const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({ isDeleted: { $ne: true } });
    const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });

    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get top 5 selling products (mocked by rating for now, or you could aggregate from orders)
    const topProducts = await Product.find({ isDeleted: { $ne: true } }).sort({ rating: -1 }).limit(5);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      topProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get staff dashboard stats
// @route   GET /api/stats/staff
// @access  Private/Staff
const getStaffStats = async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({ status: 'Chờ xác nhận' });
    const processingOrders = await Order.countDocuments({ status: 'Đang đóng gói' });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'Cancelled' },
      isDeleted: { $ne: true }
    });
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending', isDeleted: { $ne: true } });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 }, isDeleted: { $ne: true } });

    res.json({
      pendingOrders,
      processingOrders,
      todayAppointments,
      pendingAppointments,
      lowStockProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStats,
  getStaffStats,
};
