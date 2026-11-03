const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to format and return cart with populated product data
const populateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price image stock lowStockThreshold'
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  } else {
    // Filter out any items whose product has been deleted
    const validItems = cart.items.filter((item) => item.product !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
  }

  return cart;
};

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getMyCart = async (req, res) => {
  try {
    const cart = await populateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    console.error('getMyCart error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variantInfo } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Thiếu mã sản phẩm (productId)' });
    }

    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: `Sản phẩm "${product.name}" hiện đang hết hàng` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variantInfo === (variantInfo || '')
    );

    if (existingIndex >= 0) {
      const currentQty = cart.items[existingIndex].quantity;
      const newQty = currentQty + qtyToAdd;

      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Không thể thêm! Bạn đã có ${currentQty} sản phẩm trong giỏ, kho chỉ còn ${product.stock} sản phẩm.`
        });
      }

      cart.items[existingIndex].quantity = newQty;
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          message: `Số lượng yêu cầu (${qtyToAdd}) vượt quá tồn kho (${product.stock}) của sản phẩm "${product.name}"`
        });
      }

      cart.items.push({
        product: productId,
        quantity: qtyToAdd,
        variantInfo: variantInfo || ''
      });
    }

    await cart.save();
    const updatedCart = await populateCart(req.user._id);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const newQty = Number(quantity);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId || item._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // If new quantity <= 0, remove item from cart
    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      const updatedCart = await populateCart(req.user._id);
      return res.json(updatedCart);
    }

    // Check stock
    const actualProductId = cart.items[itemIndex].product;
    const product = await Product.findById(actualProductId);
    if (!product) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(404).json({ message: 'Sản phẩm không còn tồn tại' });
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        message: `Số lượng yêu cầu (${newQty}) vượt quá tồn kho hiện tại (${product.stock}) của "${product.name}"`
      });
    }

    cart.items[itemIndex].quantity = newQty;
    await cart.save();

    const updatedCart = await populateCart(req.user._id);
    res.json(updatedCart);
  } catch (error) {
    console.error('updateCartItemQuantity error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId && item._id.toString() !== productId
    );

    await cart.save();
    const updatedCart = await populateCart(req.user._id);
    res.json(updatedCart);
  } catch (error) {
    console.error('removeCartItem error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully', items: [] });
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Sync local guest cart with user cart upon login
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const guestItem of items) {
      const prodId = guestItem.product || guestItem._id;
      const qty = Math.max(1, Number(guestItem.qty || guestItem.quantity) || 1);
      const product = await Product.findById(prodId);

      if (!product || product.stock <= 0) continue;

      const existingIndex = cart.items.findIndex(
        (it) => it.product.toString() === prodId.toString()
      );

      if (existingIndex >= 0) {
        const combinedQty = Math.min(product.stock, cart.items[existingIndex].quantity + qty);
        cart.items[existingIndex].quantity = combinedQty;
      } else {
        const addQty = Math.min(product.stock, qty);
        cart.items.push({
          product: prodId,
          quantity: addQty,
          variantInfo: guestItem.variantInfo || ''
        });
      }
    }

    await cart.save();
    const updatedCart = await populateCart(req.user._id);
    res.json(updatedCart);
  } catch (error) {
    console.error('syncCart error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  syncCart,
};
