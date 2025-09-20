import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreFormData } from "@/lib/validations/store";

interface StoreFormState {
  formData: Partial<StoreFormData>;
  currentStep: number;
  setFormData: (data: Partial<StoreFormData>) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialState: Partial<StoreFormData> = {};

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
      reset: () => set({ formData: initialState, currentStep: 0 }),
    }),
    {
      name: "store-form-storage",
    }
  )
);
