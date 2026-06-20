import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
  maxStock: number;
  variantLabel?: string;
  weight: number;
}

interface CartStore {
  items: CartItem[];
  voucherCode: string | null;
  voucherDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
  getTotalWeight: () => number;
  applyVoucher: (code: string, discount: number) => void;
  removeVoucher: () => void;
}

function itemKey(productId: string, variantId?: string) {
  return `${productId}::${variantId || ''}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      voucherCode: null,
      voucherDiscount: 0,

      addItem: (newItem) => {
        const items = get().items;
        const key = itemKey(newItem.productId, newItem.variantId);
        const existing = items.find((i) => itemKey(i.productId, i.variantId) === key);

        if (existing) {
          set({
            items: items.map((i) =>
              itemKey(i.productId, i.variantId) === key
                ? { ...i, qty: Math.min(i.qty + newItem.qty, i.maxStock) }
                : i
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId, variantId) => {
        const key = itemKey(productId, variantId);
        set({ items: get().items.filter((i) => itemKey(i.productId, i.variantId) !== key) });
      },

      updateQty: (productId, variantId, qty) => {
        const key = itemKey(productId, variantId);
        set({
          items: qty <= 0
            ? get().items.filter((i) => itemKey(i.productId, i.variantId) !== key)
            : get().items.map((i) =>
                itemKey(i.productId, i.variantId) === key
                  ? { ...i, qty: Math.min(qty, i.maxStock) }
                  : i
              ),
        });
      },

      clearCart: () => set({ items: [], voucherCode: null, voucherDiscount: 0 }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      getTotalWeight: () => get().items.reduce((sum, i) => sum + i.weight * i.qty, 0),

      applyVoucher: (code, discount) => {
        set({ voucherCode: code, voucherDiscount: discount });
      },

      removeVoucher: () => {
        set({ voucherCode: null, voucherDiscount: 0 });
      },
    }),
    {
      name: 'sepedamania-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
