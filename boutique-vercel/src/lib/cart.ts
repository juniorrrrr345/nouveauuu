import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, Product, ProductPrice } from '@/types';

interface CartStore {
  cart: Cart;
  addItem: (product: Product, priceId: string, price: ProductPrice, quantity?: number) => void;
  removeItem: (productId: string, priceId: string) => void;
  updateQuantity: (productId: string, priceId: string, quantity: number) => void;
  clearCart: () => void;
  getCartMessage: () => string;
}

const initialCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0,
};

const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + (item.price.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,

      addItem: (product, priceId, price, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            (item) => item.product.id === product.id && item.priceId === priceId
          );

          let newItems: CartItem[];
          
          if (existingItemIndex > -1) {
            // Item exists, update quantity
            newItems = [...state.cart.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            // New item
            const newItem: CartItem = {
              product,
              priceId,
              price,
              quantity,
            };
            newItems = [...state.cart.items, newItem];
          }

          const { total, itemCount } = calculateCartTotals(newItems);

          return {
            cart: {
              items: newItems,
              total,
              itemCount,
            },
          };
        });
      },

      removeItem: (productId, priceId) => {
        set((state) => {
          const newItems = state.cart.items.filter(
            (item) => !(item.product.id === productId && item.priceId === priceId)
          );

          const { total, itemCount } = calculateCartTotals(newItems);

          return {
            cart: {
              items: newItems,
              total,
              itemCount,
            },
          };
        });
      },

      updateQuantity: (productId, priceId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return get().removeItem(productId, priceId);
          }

          const newItems = state.cart.items.map((item) => {
            if (item.product.id === productId && item.priceId === priceId) {
              return { ...item, quantity };
            }
            return item;
          });

          const { total, itemCount } = calculateCartTotals(newItems);

          return {
            cart: {
              items: newItems,
              total,
              itemCount,
            },
          };
        });
      },

      clearCart: () => {
        set({ cart: initialCart });
      },

      getCartMessage: () => {
        const { cart } = get();
        if (cart.items.length === 0) {
          return "Votre panier est vide";
        }

        let message = "🛒 *Commande Boutique* 🛒\n\n";
        
        cart.items.forEach((item) => {
          message += `📦 *${item.product.name}*\n`;
          message += `   ${item.price.label} - ${item.price.price}€\n`;
          message += `   Quantité: ${item.quantity}\n`;
          message += `   Sous-total: ${(item.price.price * item.quantity).toFixed(2)}€\n\n`;
        });

        message += `💰 *Total: ${cart.total.toFixed(2)}€*\n`;
        message += `📱 Articles: ${cart.itemCount}`;

        return encodeURIComponent(message);
      },
    }),
    {
      name: 'boutique-cart',
    }
  )
);