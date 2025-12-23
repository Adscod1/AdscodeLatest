import { create } from "zustand";

export interface CreateServiceInput {
  title: string;
  category?: string;
  tags?: string;
  description?: string;
  serviceProvider?: string;
  location?: string;
  duration?: string;
  serviceType?: string;
  experience?: number;
  whatsIncluded?: string;
  targetAudience?: string;
  termsAndConditions?: string;
  status?: string;
  storeId: string;
  price?: number;
  comparePrice?: number;
  costPerService?: number;
  currency?: string;
  requiresBooking?: boolean;
  media?: Array<{
    url: string;
    type: string;
    filename: string;
    size: number;
  }>;
}

interface ServiceStore {
  service: Partial<CreateServiceInput>;
  setService: (service: Partial<CreateServiceInput>) => void;
  updateService: (update: Partial<CreateServiceInput>) => void;
  reset: () => void;
}

const initialState: Partial<CreateServiceInput> = {
  status: "DRAFT",
  experience: 0,
  media: [],
};

export const useServiceStore = create<ServiceStore>((set) => ({
  service: initialState,
  setService: (service) => set({ service }),
  updateService: (update) =>
    set((state) => {
      // Deep merge arrays and objects
      const mergedService = {
        ...state.service,
        ...update,
        media: update.media || state.service.media,
      };
      return { service: mergedService };
    }),
  reset: () => set({ service: initialState }),
}));