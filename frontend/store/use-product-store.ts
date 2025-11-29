import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateProductInput } from "@/lib/api-client";

interface ProductStore {
  product: Partial<CreateProductInput>;
  setProduct: (product: Partial<CreateProductInput>) => void;
  updateProduct: (update: Partial<CreateProductInput>) => void;
  reset: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const initialState: Partial<CreateProductInput> = {
  status: "DRAFT",
  variations: [
    {
      name: "Size",
      value: "Small (S)",
      price: 20,
      stock: 6,
    },
    {
      name: "Size",
      value: "Medium (M)",
      price: 20,
      stock: 12,
    },
    {
      name: "Size",
      value: "Large (L)",
      price: 20,
      stock: 8,
    },
  ],
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      product: initialState,
      setProduct: (product) => set({ product }),
      updateProduct: (update) =>
        set((state) => {
          // Deep merge - preserve existing arrays if not explicitly updated
          const mergedProduct = {
            ...state.product,
            ...update,
            // Only update arrays if they're explicitly provided (not undefined)
            variations: update.variations !== undefined ? update.variations : state.product.variations,
            images: update.images !== undefined ? update.images : state.product.images,
            videos: update.videos !== undefined ? update.videos : state.product.videos,
          };
          return { product: mergedProduct };
        }),
      reset: () => set({ product: initialState, _hasHydrated: true }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "product-store", // localStorage key
      partialize: (state) => ({ product: state.product }), // Only persist product, not hydration state
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
