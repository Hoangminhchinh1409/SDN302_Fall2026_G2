import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',
      loading: false,
      
      fetchCart: async () => {
        try {
          set({ loading: true });
          const { data } = await api.get('/cart');
          // Map backend structure to frontend structure
          const formattedItems = data.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            countInStock: item.product.stock,
            qty: item.quantity,
          }));
          set({ cartItems: formattedItems, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },

      addToCart: async (product, qty) => {
        const item = {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.stock,
          qty,
        };

        const existItem = get().cartItems.find((x) => x.product === item.product);

        if (existItem) {
          set({
            cartItems: get().cartItems.map((x) =>
              x.product === existItem.product ? item : x
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, item] });
        }
      },

      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((x) => x.product !== id),
        });
      },

      saveShippingAddress: (data) => {
        set({ shippingAddress: data });
      },

      savePaymentMethod: (data) => {
        set({ paymentMethod: data });
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
