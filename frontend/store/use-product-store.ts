import { create } from "zustand";
import { CreateProductInput } from "@/lib/api-client";

interface ProductStore {
  product: Partial<CreateProductInput>;
  setProduct: (product: Partial<CreateProductInput>) => void;
  updateProduct: (update: Partial<CreateProductInput>) => void;
  reset: () => void;
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

export const useProductStore = create<ProductStore>((set) => ({
  product: initialState,
  setProduct: (product) => set({ product }),
  updateProduct: (update) =>
    set((state) => {
      // Deep merge arrays and objects
      const mergedProduct = {
        ...state.product,
        ...update,
        variations: update.variations || state.product.variations,
        images: update.images || state.product.images,
        videos: update.videos || state.product.videos,
      };
      return { product: mergedProduct };
    }),
  reset: () => set({ product: initialState }),
}));
