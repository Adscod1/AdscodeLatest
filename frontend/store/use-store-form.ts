import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreFormData } from "@/lib/validations/store";

interface StoreFormState {
  formData: Partial<StoreFormData>;
  currentStep: number;
  setFormData: (data: Partial<StoreFormData>) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  clearAll: () => void;
}

const initialState: Partial<StoreFormData> = {
  name: undefined,
  tagline: undefined,
  description: undefined,
  category: undefined,
  regNumber: undefined,
  yearEstablished: undefined,
  phone: undefined,
  email: undefined,
  address: undefined,
  city: undefined,
  state: undefined,
  country: undefined,
  zip: undefined,
  website: undefined,
  facebook: undefined,
  instagram: undefined,
  twitter: undefined,
  logo: undefined,
  banner: undefined,
  bannerImages: [],
  galleryImages: [],
  galleryVideos: [],
  selectedHighlights: [],
  businessHours: undefined,
};

export const useStoreForm = create<StoreFormState>()(
  persist(
    (set) => ({
      formData: initialState,
      currentStep: 0,
      setFormData: (data: Partial<StoreFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setCurrentStep: (step: number) => set({ currentStep: step }),
      reset: () => set({ formData: { ...initialState }, currentStep: 0 }),
      clearAll: () => {
        // Clear the state
        set({ formData: { ...initialState }, currentStep: 0 });
        // Clear from localStorage
        localStorage.removeItem("store-form-storage");
      },
    }),
    {
      name: "store-form-storage",
    }
  )
);
