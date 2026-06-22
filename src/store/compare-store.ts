import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CompareItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number | null;
  specs: Record<string, string>;
  category: string;
  brand: string;
  stock: number;
  weight: number;
  rating: number;
  reviewCount: number;
}

interface CompareStore {
  items: CompareItem[];
  addItem: (item: CompareItem) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
}

const MAX_ITEMS = 3;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const exists = items.some((i) => i.productId === item.productId);

        if (exists) {
          return { success: false, message: 'Produk sudah ada di perbandingan' };
        }

        if (items.length >= MAX_ITEMS) {
          return {
            success: false,
            message: `Maksimal ${MAX_ITEMS} produk dapat dibandingkan`,
          };
        }

        set({ items: [...items, item] });
        return { success: true };
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clearAll: () => {
        set({ items: [] });
      },

      isInCompare: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
    }),
    {
      name: 'sepedamania-compare',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
