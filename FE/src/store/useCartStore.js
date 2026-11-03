import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import useAuthStore from './useAuthStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'Cash on Delivery',
      appliedCoupon: null,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),

      // Fetch cart from backend (safely syncs if user is logged in)
      fetchCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          set({ loading: true, error: null });
          const { data } = await api.get('/cart');
          if (data && data.items && data.items.length > 0) {
            const formattedItems = data.items
              .filter((item) => item.product)
              .map((item) => ({
                product: item.product._id || item.product,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                countInStock: item.product.stock ?? 99,
                qty: item.quantity,
                variantInfo: item.variantInfo || '',
              }));
            set({ cartItems: formattedItems, loading: false });
          } else if (data && Array.isArray(data.items) && data.items.length === 0) {
            set({ cartItems: [], loading: false });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          set({ loading: false });
        }
      },

      // Sync guest cart to backend after login
      syncCartWithBackend: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const localItems = get().cartItems;
        try {
          set({ loading: true, error: null });
          if (localItems.length > 0) {
            await api.post('/cart/sync', { items: localItems });
          }
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to sync cart:', error);
          set({ loading: false });
        }
      },

      // Add item or increment quantity
      addToCart: async (product, qty = 1, isDirect = false) => {
        const productId = product._id || product.product;
        const countInStock = product.stock ?? product.countInStock ?? 99;
        const addQty = Math.max(1, Number(qty) || 1);

        const item = {
          product: productId,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock,
          qty: addQty,
        };

        const existingItem = get().cartItems.find((x) => x.product === productId);

        if (existingItem) {
          const finalQty = isDirect
            ? Math.min(countInStock, addQty)
            : Math.min(countInStock, existingItem.qty + addQty);

          set({
            error: null,
            cartItems: get().cartItems.map((x) =>
              x.product === productId ? { ...x, qty: finalQty } : x
            ),
          });
        } else {
          set({
            error: null,
            cartItems: [...get().cartItems, item]
          });
        }

        // Backend sync if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            await api.post('/cart', {
              productId,
              quantity: addQty,
            });
          } catch (error) {
            const msg = error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
            set({ error: msg });
            await get().fetchCart();
          }
        }
      },

      // Direct quantity adjustment (+, -, or direct select)
      updateQuantity: async (productId, qty) => {
        const newQty = Math.max(1, Number(qty) || 1);
        set({
          error: null,
          cartItems: get().cartItems.map((item) =>
            item.product === productId
              ? { ...item, qty: Math.min(item.countInStock || 99, newQty) }
              : item
          ),
        });

        // Backend sync if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            await api.put(`/cart/items/${productId}`, { quantity: newQty });
          } catch (error) {
            const msg = error.response?.data?.message || 'Không thể cập nhật số lượng';
            set({ error: msg });
            await get().fetchCart();
          }
        }
      },

      // Remove single item
      removeFromCart: async (productId) => {
        set({
          error: null,
          cartItems: get().cartItems.filter((x) => x.product !== productId),
        });

        // Backend sync if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            await api.delete(`/cart/items/${productId}`);
          } catch (error) {
            console.error('Failed to sync removeFromCart with backend:', error);
          }
        }
      },

      // Clear all items in cart
      clearCart: async () => {
        set({ cartItems: [], appliedCoupon: null, error: null });

        // Backend sync if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            await api.delete('/cart');
          } catch (error) {
            console.error('Failed to sync clearCart with backend:', error);
          }
        }
      },

      // Apply coupon code
      applyCoupon: async (code) => {
        try {
          set({ error: null });
          const itemsPrice = get().getItemsPrice();
          const { data } = await api.post('/coupons/apply', {
            code,
            orderTotal: itemsPrice,
          });
          set({ appliedCoupon: data });
          return { success: true, message: data.message };
        } catch (err) {
          const msg = err.response?.data?.message || 'Không thể áp dụng mã giảm giá';
          set({ error: msg });
          return { success: false, message: msg };
        }
      },

      // Remove coupon code
      removeCoupon: () => set({ appliedCoupon: null, error: null }),

      // Save Shipping Address
      saveShippingAddress: (data) => {
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...data },
        }));
      },

      // Save Payment Method
      savePaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      // Computed Calculation Helpers
      getTotalItems: () => {
        return get().cartItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
      },

      getItemsPrice: () => {
        const sum = get().cartItems.reduce(
          (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0),
          0
        );
        return Number(sum.toFixed(2));
      },

      getShippingPrice: () => {
        const itemsPrice = get().getItemsPrice();
        if (itemsPrice === 0 || itemsPrice > 100) return 0; // Free shipping over $100
        return 10;
      },

      getTaxPrice: () => {
        const itemsPrice = get().getItemsPrice();
        return Number((0.1 * itemsPrice).toFixed(2)); // 10% tax
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const itemsPrice = get().getItemsPrice();
        let discount = (itemsPrice * (coupon.discountPercentage || 0)) / 100;
        if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount;
        }
        return Number(discount.toFixed(2));
      },

      getTotalPrice: () => {
        const items = get().getItemsPrice();
        const shipping = get().getShippingPrice();
        const tax = get().getTaxPrice();
        const discount = get().getDiscountAmount();
        return Number(Math.max(0, items + shipping + tax - discount).toFixed(2));
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
