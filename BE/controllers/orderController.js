const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponCode,
      discountAmount,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Đơn hàng không có sản phẩm nào' });
    }

    // 1. Check stock and existence for every product
    for (const item of orderItems) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm "${item.name || productId}"` });
      }

      const qty = Number(item.qty) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho, không đủ số lượng bạn đặt (${qty})!`
        });
      }
    }

    // 2. Format and sanitize order items
    const formattedOrderItems = orderItems.map((item) => ({
      name: item.name,
      qty: Number(item.qty) || 1,
      image: item.image || '/images/sample.jpg',
      price: Number(item.price) || 0,
      product: item.product || item._id,
    }));

    const order = new Order({
      orderItems: formattedOrderItems,
      user: req.user._id,
      shippingAddress: {
        address: shippingAddress?.address || 'Default Address',
        city: shippingAddress?.city || 'Hanoi',
        postalCode: shippingAddress?.postalCode || '100000',
        country: shippingAddress?.country || 'Vietnam',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      couponCode: couponCode || undefined,
      discountAmount: Number(discountAmount) || 0,
      status: 'Chờ xác nhận',
    });

    const createdOrder = await order.save();

    // 3. Deduct stock for each product
    for (const item of formattedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    // 4. Clear user's cart in database
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // 5. Safely earn reward points (1 point per dollar spent)
    try {
      const pointsToAdd = Math.round(Number(totalPrice) || 0);
      if (pointsToAdd > 0) {
        const user = await User.findById(req.user._id);
        if (user) {
          const newPoints = (user.rewardPoints || 0) + pointsToAdd;
          let newTier = 'Bronze';
          if (newPoints >= 3000) newTier = 'Diamond';
          else if (newPoints >= 1500) newTier = 'Gold';
          else if (newPoints >= 500) newTier = 'Silver';

          await User.updateOne(
            { _id: req.user._id },
            {
              $set: {
                rewardPoints: newPoints,
                membershipTier: newTier,
              },
            }
          );
        }
      }
    } catch (pointsError) {
      console.error('Points calculation error:', pointsError);
    }

    // 6. Record coupon usage if a coupon was applied
    if (couponCode) {
      try {
        const Coupon = require('../models/Coupon');
        await Coupon.updateOne(
          { code: couponCode.trim().toUpperCase() },
          {
            $inc: { usedCount: 1 },
            $addToSet: { usedBy: req.user._id },
          }
        );
      } catch (couponErr) {
        console.error('Coupon record error:', couponErr);
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      if (req.user.role === 'admin' || req.user.role === 'staff' || order.user._id.equals(req.user._id)) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Staff/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel order by user or admin/staff
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Check authorization: must be order owner or staff/admin
    const isOwner = order.user.toString() === req.user._id.toString();
    const isStaffOrAdmin = req.user.role === 'staff' || req.user.role === 'admin';

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
    }

    // Check if order is already cancelled
    if (order.status === 'Đã hủy') {
      return res.status(400).json({ message: 'Đơn hàng này đã được hủy trước đó' });
    }

    // Check status: customers can only cancel when 'Chờ xác nhận' (or 'Đang đóng gói')
    if (order.status === 'Đang giao' || order.status === 'Hoàn thành') {
      return res.status(400).json({
        message: 'Không thể hủy đơn hàng khi đang giao hàng hoặc đã hoàn thành. Vui lòng liên hệ hỗ trợ!'
      });
    }

    // Update order status
    order.status = 'Đã hủy';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || (isOwner ? 'Khách hàng yêu cầu hủy đơn' : 'Được hủy bởi quản trị viên');
    order.cancelledBy = req.user._id;

    const updatedOrder = await order.save();

    // Restore stock for all products in the cancelled order
    for (const item of order.orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.qty }
        });
      }
    }

    // Rollback reward points
    try {
      const pointsToRollback = Math.round(Number(order.totalPrice) || 0);
      if (pointsToRollback > 0) {
        const user = await User.findById(order.user);
        if (user) {
          const newPoints = Math.max(0, (user.rewardPoints || 0) - pointsToRollback);
          let newTier = 'Bronze';
          if (newPoints >= 3000) newTier = 'Diamond';
          else if (newPoints >= 1500) newTier = 'Gold';
          else if (newPoints >= 500) newTier = 'Silver';

          await User.updateOne(
            { _id: user._id },
            { $set: { rewardPoints: newPoints, membershipTier: newTier } }
          );
        }
      }
    } catch (ptsErr) {
      console.error('Points rollback error:', ptsErr);
    }

    // Rollback coupon usage
    if (order.couponCode) {
      try {
        const Coupon = require('../models/Coupon');
        await Coupon.updateOne(
          { code: order.couponCode.trim().toUpperCase() },
          {
            $inc: { usedCount: -1 },
            $pull: { usedBy: order.user },
          }
        );
      } catch (couponErr) {
        console.error('Coupon rollback error:', couponErr);
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Staff/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    const nextStatus = req.body.status || order.status;

    // If changing to 'Đã hủy' from non-cancelled status, restore stock
    if (nextStatus === 'Đã hủy' && previousStatus !== 'Đã hủy') {
      order.cancelledAt = new Date();
      order.cancelReason = req.body.reason || 'Được hủy bởi nhân viên / quản trị viên';
      order.cancelledBy = req.user._id;

      for (const item of order.orderItems) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.qty }
          });
        }
      }

      // Rollback points
      try {
        const pointsToRollback = Math.round(Number(order.totalPrice) || 0);
        if (pointsToRollback > 0) {
          const user = await User.findById(order.user);
          if (user) {
            const newPoints = Math.max(0, (user.rewardPoints || 0) - pointsToRollback);
            let newTier = 'Bronze';
            if (newPoints >= 3000) newTier = 'Diamond';
            else if (newPoints >= 1500) newTier = 'Gold';
            else if (newPoints >= 500) newTier = 'Silver';

            await User.updateOne(
              { _id: user._id },
              { $set: { rewardPoints: newPoints, membershipTier: newTier } }
            );
          }
        }
      } catch (ptsErr) {
        console.error('Points rollback error:', ptsErr);
      }
    }

    order.status = nextStatus;

    if (order.status === 'Đang giao' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (order.status === 'Hoàn thành' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
};
