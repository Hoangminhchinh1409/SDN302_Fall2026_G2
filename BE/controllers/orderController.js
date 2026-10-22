const Order = require('../models/Order');
const User = require('../models/User');

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
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Format and sanitize order items
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
    });

    const createdOrder = await order.save();

    // Safely earn reward points (1 point per dollar spent) without triggering user password validation
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
      // Non-blocking: order is already created
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
      // Check if user is staff/admin or if the order belongs to the user
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
    const orders = await Order.find({ user: req.user._id });
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
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Staff/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;

      if (order.status === 'Đang giao' && !order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
