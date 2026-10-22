import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'Cash on Delivery',
      loading: false,

      // Fetch cart from backend (safely syncs if user is logged in)
      fetchCart: async () => {
        try {
          set({ loading: true });
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
              }));
            set({ cartItems: formattedItems, loading: false });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          // Keep local cart items from persist if unauthenticated or offline
          set({ loading: false });
        }
      },

      // Add item or increment quantity
      addToCart: (product, qty = 1, isDirect = false) => {
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
            cartItems: get().cartItems.map((x) =>
              x.product === productId ? { ...x, qty: finalQty } : x
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, item] });
        }
      },

      // Direct quantity adjustment (+, -, or direct select)
      updateQuantity: (productId, qty) => {
        const newQty = Math.max(1, Number(qty) || 1);
        set({
          cartItems: get().cartItems.map((item) =>
            item.product === productId
              ? { ...item, qty: Math.min(item.countInStock || 99, newQty) }
              : item
          ),
        });
      },

      // Remove single item
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter((x) => x.product !== productId),
        });
      },

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

      // Clear all items in cart
      clearCart: () => set({ cartItems: [] }),

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

      getTotalPrice: () => {
        const items = get().getItemsPrice();
        const shipping = get().getShippingPrice();
        const tax = get().getTaxPrice();
        return Number((items + shipping + tax).toFixed(2));
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
