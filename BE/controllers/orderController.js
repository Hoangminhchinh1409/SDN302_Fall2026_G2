const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');

const notifyOrderOwner = async (notification) => {
  try {
    await Notification.create(notification);
  } catch (error) {
    console.error('Order notification error:', error);
  }
};

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
      if (!product || product.isDeleted) {
        return res.status(404).json({ message: `Sản phẩm "${item.name || productId}" không tồn tại hoặc đã ngừng kinh doanh` });
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
        recipient: shippingAddress?.recipient || '',
        phone: shippingAddress?.phone || '',
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
      statusHistory: [{ status: 'Chờ xác nhận', note: 'Đơn hàng đã được tạo.' }],
    });

    const createdOrder = await order.save();
    await notifyOrderOwner({ user: req.user._id, order: createdOrder._id, title: 'Đã nhận đơn hàng', message: 'Đơn hàng của bạn đã được tiếp nhận.' });

    // 3. Deduct stock atomically with rollback on shortage
    const deductedItems = [];
    for (const item of formattedOrderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      );

      if (!updatedProduct) {
        // Rollback already deducted items
        for (const rolledBack of deductedItems) {
          await Product.findByIdAndUpdate(rolledBack.product, { $inc: { stock: rolledBack.qty } });
        }
        await Order.findByIdAndDelete(createdOrder._id);
        return res.status(400).json({
          message: `Sản phẩm "${item.name}" vừa hết hàng hoặc không đủ tồn kho.`
        });
      }
      deductedItems.push(item);
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
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) {
        const end = new Date(req.query.to);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    const search = String(req.query.q || '').trim().toLowerCase();
    const filtered = search ? orders.filter((order) => order._id.toString().toLowerCase().includes(search) || order.orderItems.some((item) => item.name.toLowerCase().includes(search))) : orders;
    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const reorderOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Bạn không có quyền mua lại đơn hàng này.' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const skipped = [];
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.stock <= 0) {
        skipped.push(item.name);
        continue;
      }
      const existing = cart.items.find((entry) => entry.product.toString() === product._id.toString() && !entry.variantInfo);
      const availableQty = Math.max(0, product.stock - (existing?.quantity || 0));
      const qtyToAdd = Math.min(item.qty, availableQty);
      if (qtyToAdd <= 0) {
        skipped.push(item.name);
        continue;
      }
      if (qtyToAdd < item.qty) skipped.push(`${item.name} (thêm được ${qtyToAdd}/${item.qty})`);
      if (existing) existing.quantity += qtyToAdd;
      else cart.items.push({ product: product._id, quantity: qtyToAdd, variantInfo: '' });
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock lowStockThreshold');
    res.json({ cart: populatedCart, skipped });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không thể mua lại đơn hàng.' });
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
    order.statusHistory.push({ status: 'Đã hủy', note: order.cancelReason });

    const updatedOrder = await order.save();
    await notifyOrderOwner({ user: order.user, order: order._id, title: 'Đơn hàng đã bị hủy', message: order.cancelReason });

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
    const previousTrackingNumber = order.trackingNumber || '';
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

    const allowedStatuses = ['Chờ xác nhận', 'Đang đóng gói', 'Đang giao', 'Hoàn thành', 'Đã hủy'];
    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ.' });
    }

    // Ràng buộc luồng chuyển trạng thái (State Machine)
    const ORDER_TRANSITIONS = {
      'Chờ xác nhận': ['Đang đóng gói', 'Đã hủy'],
      'Đang đóng gói': ['Đang giao', 'Đã hủy'],
      'Đang giao': ['Hoàn thành', 'Đã hủy'],
      'Hoàn thành': [],
      'Đã hủy': []
    };

    if (previousStatus !== nextStatus) {
      const validNext = ORDER_TRANSITIONS[previousStatus] || [];
      if (!validNext.includes(nextStatus)) {
        return res.status(400).json({
          message: `Không thể chuyển đơn hàng từ trạng thái "${previousStatus}" sang "${nextStatus}".`
        });
      }
    }

    order.status = nextStatus;
    if (req.body.trackingNumber !== undefined) order.trackingNumber = String(req.body.trackingNumber).trim();
    const trackingChanged = previousTrackingNumber !== order.trackingNumber;
    if (previousStatus !== nextStatus || trackingChanged) {
      const notes = { 'Chờ xác nhận': 'Cửa hàng đã tiếp nhận đơn hàng.', 'Đang đóng gói': 'Đơn hàng đang được chuẩn bị.', 'Đang giao': order.trackingNumber ? `Đơn hàng đang được giao. Mã vận đơn: ${order.trackingNumber}` : 'Đơn hàng đang được giao.', 'Hoàn thành': 'Đơn hàng đã được giao thành công.', 'Đã hủy': order.cancelReason || 'Đơn hàng đã bị hủy.' };
      order.statusHistory.push({ status: nextStatus, note: trackingChanged ? `Mã vận đơn: ${order.trackingNumber || 'đã được xóa'}` : notes[nextStatus] });
    }

    if (order.status === 'Hoàn thành' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    if (previousStatus !== nextStatus || trackingChanged) await notifyOrderOwner({ user: order.user, order: order._id, title: trackingChanged && previousStatus === nextStatus ? 'Mã vận đơn đã cập nhật' : `Đơn hàng ${nextStatus.toLowerCase()}`, message: order.statusHistory[order.statusHistory.length - 1].note });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get SEPay payment info and VietQR
// @route   GET /api/orders/:id/sepay-info
// @access  Private
const getSepayInfo = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const bankAcc = process.env.SEPAY_BANK_ACC || '0362959028';
    const bankName = process.env.SEPAY_BANK_NAME || 'MBBank';
    const bankOwner = process.env.SEPAY_BANK_OWNER || 'PET SHOP STORE';
    const exchangeRate = Number(process.env.VND_EXCHANGE_RATE) || 25000;
    const amountVnd = Math.round(order.totalPrice * exchangeRate);
    const content = `DH${order._id.toString()}`;
    const qrUrl = `https://vietqr.app/img?acc=${encodeURIComponent(bankAcc)}&bank=${encodeURIComponent(bankName)}&amount=${amountVnd}&des=${encodeURIComponent(content)}`;

    res.json({
      bankAcc,
      bankName,
      bankOwner,
      amountVnd,
      content,
      qrUrl,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
    });
  } catch (error) {
    console.error('getSepayInfo error:', error);
    res.status(500).json({ message: error.message || 'Lỗi lấy thông tin thanh toán' });
  }
};

// @desc    SEPay Webhook handler
// @route   POST /api/orders/sepay-webhook
// @access  Public
const sepayWebhook = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const sepayKey = process.env.SEPAY_API_KEY;

    if (sepayKey) {
      const token = authHeader.replace(/^(Apikey|Bearer)\s+/i, '').trim();
      if (token !== sepayKey.trim()) {
        return res.status(401).json({ success: false, message: 'Invalid SEPay API Key' });
      }
    }

    const {
      gateway,
      transactionDate,
      accountNumber,
      content,
      transferType,
      transferAmount,
      referenceCode,
      id: transactionId,
    } = req.body;

    if (transferType !== 'in') {
      return res.json({ success: true, message: 'Ignored non-incoming transaction' });
    }

    if (!content) {
      return res.status(400).json({ success: false, message: 'Thiếu nội dung chuyển khoản' });
    }

    let order = null;
    const objectIdMatch = content.match(/[0-9a-fA-F]{24}/);
    if (objectIdMatch) {
      order = await Order.findById(objectIdMatch[0]);
    }

    if (!order) {
      return res.json({ success: false, message: 'Không tìm thấy đơn hàng tương ứng' });
    }

    if (order.isPaid) {
      return res.json({ success: true, message: 'Đơn hàng đã được thanh toán trước đó' });
    }

    order.isPaid = true;
    order.paidAt = transactionDate ? new Date(transactionDate) : new Date();
    order.paymentResult = {
      id: transactionId ? String(transactionId) : referenceCode,
      status: 'COMPLETED',
      update_time: transactionDate || new Date().toISOString(),
      account_number: accountNumber || '',
      reference_code: referenceCode || '',
    };

    if (order.status === 'Chờ xác nhận') {
      order.status = 'Đang đóng gói';
    }

    order.statusHistory.push({
      status: order.status,
      note: `Thanh toán thành công qua SEPay (${gateway || 'Ngân hàng'}). Số tiền: ${transferAmount ? Number(transferAmount).toLocaleString('vi-VN') + ' đ' : ''}`,
      createdAt: new Date(),
    });

    await order.save();

    await notifyOrderOwner({
      user: order.user,
      order: order._id,
      title: 'Thanh toán thành công',
      message: `Đơn hàng #${order._id.toString().slice(-6)} đã được thanh toán thành công qua SEPay.`,
    });

    return res.json({ success: true, message: 'Xác nhận thanh toán thành công' });
  } catch (error) {
    console.error('sepayWebhook error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  reorderOrder,
  updateOrderStatus,
  cancelOrder,
  getSepayInfo,
  sepayWebhook,
};
