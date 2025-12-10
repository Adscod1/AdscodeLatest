/**
 * API Client for Backend
 * 
 * This module provides a centralized API client for making requests to the NestJS backend.
 * It handles authentication, request/response formatting, and error handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get authentication headers from cookies/session
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  // For server-side requests, we need to forward cookies
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ');
    return {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
    };
  }
  
  // For client-side, credentials: 'include' handles cookies
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || data.error || `HTTP error! status: ${response.status}`,
      data
    );
  }

  return data;
}

/**
 * File upload helper
 */
async function uploadFile(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<{ success: boolean; url: string; filename?: string; type?: string; size?: number; mediaType?: string }> {
  const url = `${API_BASE_URL}${endpoint}`;
  const formData = new FormData();
  formData.append('file', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || data.error || 'Upload failed',
      data
    );
  }

  return data;
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  getSession: () => apiRequest<{ user: unknown; session: unknown }>('/auth/session'),
  getMe: () => apiRequest<{ user: unknown }>('/auth/me'),
};

// ============================================================================
// HEALTH API
// ============================================================================

export const healthApi = {
  check: () => apiRequest<{ status: string; timestamp: string }>('/health'),
};

// ============================================================================
// STORES API
// ============================================================================

export interface Store {
  id: string;
  userId: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  regNumber: string | null;
  yearEstablished: number | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  website: string | null;
  logo: string | null;
  banner: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHour {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface BusinessHours {
  monday?: BusinessHour;
  tuesday?: BusinessHour;
  wednesday?: BusinessHour;
  thursday?: BusinessHour;
  friday?: BusinessHour;
  saturday?: BusinessHour;
  sunday?: BusinessHour;
}

export interface CreateStoreInput {
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  regNumber?: string;
  yearEstablished?: number;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  logo?: string;
  banner?: string;
  bannerImages?: string[];
  galleryImages?: string[];
  galleryVideos?: string[];
  businessHours?: BusinessHours;
  selectedHighlights?: string[];
}

export interface GetStoresParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const storesApi = {
  // Get user's stores
  getUserStores: () => 
    apiRequest<{ success: boolean; stores: Store[] }>('/stores'),
  
  // Get all stores (public)
  getAllStores: (params?: GetStoresParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const query = searchParams.toString();
    return apiRequest<{ stores: Store[]; pagination: unknown }>(`/stores/all${query ? `?${query}` : ''}`);
  },
  
  // Get store by ID
  getById: (id: string) => 
    apiRequest<{ success: boolean; store: Store }>(`/stores/${id}`),
  
  // Create store
  create: (data: CreateStoreInput) => 
    apiRequest<{ success: boolean; store: Store }>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update store
  update: (id: string, data: Partial<CreateStoreInput>) => 
    apiRequest<{ success: boolean; store: Store }>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete store
  delete: (id: string) => 
    apiRequest<{ success: boolean; message: string }>(`/stores/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// PRODUCTS API
// ============================================================================

export interface ProductVariation {
  id?: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

export interface ProductImage {
  id?: string;
  url: string;
}

export interface ProductVideo {
  id?: string;
  url: string;
}

export interface Product {
  id: string;
  storeId: string;
  title: string;
  description?: string;
  category?: string;
  vendor?: string;
  tags?: string;
  price?: number;
  comparePrice?: number;
  costPerItem?: number;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  sizeUnit?: string;
  countryOfOrigin?: string;
  harmonizedSystemCode?: string;
  status: string;
  variations: ProductVariation[];
  images: ProductImage[];
  videos: ProductVideo[];
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;
  specifications?: string;
  shippingCost?: number;
  offerFreeShipping?: boolean;
  processingTime?: string;
  shippingMethod?: string;
  currency?: string;
  taxRate?: number;
  productId?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  trackQuantity?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  requiresShipping?: boolean;
  store?: {
    id: string;
    name: string;
    category: string | null;
    logo: string | null;
    avatarUrl: string | null;
    verified?: boolean;
  };
  _count?: {
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  title: string;
  description?: string;
  category?: string;
  vendor?: string;
  tags?: string;
  price?: number;
  comparePrice?: number;
  costPerItem?: number;
  profit?: number;
  margin?: number;
  sku?: string;
  barcode?: string;
  trackQuantity?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  requiresShipping?: boolean;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  sizeUnit?: string;
  countryOfOrigin?: string;
  harmonizedSystemCode?: string;
  processingTime?: string;
  shippingMethod?: string;
  shippingCost?: number;
  offerFreeShipping?: boolean;
  status?: string;
  storeId: string;
  variations?: ProductVariation[];
  images?: ProductImage[];
  videos?: ProductVideo[];
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;
  specifications?: string;
  currency?: string;
  taxRate?: number;
  productId?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
}

export interface ProductQueryParams {
  storeId: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  // Create product
  create: (data: CreateProductInput) => 
    apiRequest<{ success: boolean; product: Product }>('/product', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Get products by store
  getByStore: (params: ProductQueryParams) => {
    const searchParams = new URLSearchParams();
    // Only add optional query params, storeId is in the path
    if (params.status) searchParams.set('status', params.status);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    const queryString = searchParams.toString();
    return apiRequest<{ success: boolean; products: Product[]; total: number }>(`/product/store/${params.storeId}${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get product by ID
  getById: (id: string) => 
    apiRequest<{ success: boolean; product: Product }>(`/product/${id}`),
  
  // Update product
  update: (id: string, data: Partial<CreateProductInput>) => 
    apiRequest<{ success: boolean; product: Product }>(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete product
  delete: (id: string) => 
    apiRequest<{ success: boolean; message: string }>(`/product/${id}`, {
      method: 'DELETE',
    }),
  
  // Add comment
  addComment: (productId: string, content: string) => 
    apiRequest<{ success: boolean; comment: unknown }>(`/comments/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  // Get comments
  getComments: (productId: string) => 
    apiRequest<{ success: boolean; comments: unknown[] }>(`/products/${productId}/comments`),
  
  // Upload media
  uploadMedia: (file: File) => 
    uploadFile('/product/media', file),
  
  // Get store activity
  getStoreActivity: (storeId: string) => 
    apiRequest<{ success: boolean; activities: unknown[] }>(`/product/store/${storeId}/activity`),
  
  // Get popular products
  getPopularProducts: (storeId: string) => 
    apiRequest<{ success: boolean; products: Product[] }>(`/product/store/${storeId}/popular`),
};

// ============================================================================
// SERVICES API
// ============================================================================

export interface Service {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  comparePrice?: number;
  costPerItem?: number;
  status?: string;
  images: ProductImage[];
  videos: ProductVideo[];
  variations: { name: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  title: string;
  description?: string;
  category?: string;
  tags?: string;
  serviceProvider?: string;
  location?: string;
  duration?: string;
  serviceType?: string;
  experience?: number;
  whatsIncluded?: string;
  targetAudience?: string;
  termsAndConditions?: string;
  price?: number;
  comparePrice?: number;
  costPerService?: number;
  images?: ProductImage[];
  videos?: ProductVideo[];
  status?: string;
  storeId: string;
}

export const servicesApi = {
  // Create service
  create: (data: CreateServiceInput) => 
    apiRequest<{ success: boolean; service: Service }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Get services by store
  getByStore: (storeId: string) => 
    apiRequest<{ success: boolean; services: Service[] }>(`/services?storeId=${storeId}`),
  
  // Get service by ID
  getById: (id: string) => 
    apiRequest<{ success: boolean; service: Service }>(`/services/${id}`),
  
  // Update service (full)
  update: (id: string, data: Partial<CreateServiceInput>) => 
    apiRequest<{ success: boolean; service: Service }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Update service (partial)
  patch: (id: string, data: Partial<CreateServiceInput>) => 
    apiRequest<{ success: boolean; service: Service }>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  // Delete service
  delete: (id: string) => 
    apiRequest<{ success: boolean; message: string }>(`/services/${id}`, {
      method: 'DELETE',
    }),
  
  // Upload media
  uploadMedia: (file: File) => 
    uploadFile('/services/media/upload', file),
};

// ============================================================================
// CAMPAIGNS API
// ============================================================================

export interface Campaign {
  id: string;
  storeId: string;
  title: string;
  description?: string | null;
  objective?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  currency: string;
  duration?: number;
  status: string;
  requirements?: string;
  deliverables?: string;
  targetAudience?: string;
  platforms?: string[];
  targets?: string[];
  influencerLocation?: {
    country?: string;
    stateCity?: string;
  };
  createdAt: string;
  updatedAt: string;
  _count: {
    applicants: number;
  };
}

export interface CreateCampaignInput {
  storeId?: string;
  title: string;
  description?: string;
  objective?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  currency?: string;
  duration?: number;
  requirements?: string;
  deliverables?: string;
  targetAudience?: string;
  productIds?: string[];
  platforms?: string[];
  targets?: string[];
  influencerLocation?: {
    country?: string;
    stateCity?: string;
  };
}

export interface CampaignQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  storeId?: string;
}

export const campaignsApi = {
  // Create campaign
  create: (data: CreateCampaignInput) => 
    apiRequest<{ success: boolean; campaign: Campaign }>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Get campaigns
  getAll: (params?: CampaignQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.storeId) searchParams.set('storeId', params.storeId);
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; campaigns: Campaign[] }>(`/campaigns${query ? `?${query}` : ''}`);
  },
  
  // Get campaign by ID
  getById: (id: string) => 
    apiRequest<{ success: boolean; campaign: Campaign }>(`/campaigns/${id}`),
  
  // Update campaign
  update: (id: string, data: Partial<CreateCampaignInput>) => 
    apiRequest<{ success: boolean; campaign: Campaign }>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete campaign
  delete: (id: string) => 
    apiRequest<{ success: boolean; message: string }>(`/campaigns/${id}`, {
      method: 'DELETE',
    }),
  
  // Publish campaign
  publish: (id: string) => 
    apiRequest<{ success: boolean; campaign: Campaign }>(`/campaigns/${id}/publish`, {
      method: 'POST',
    }),
  
  // Apply to campaign
  apply: (id: string) => 
    apiRequest<{ success: boolean; application: unknown }>(`/campaigns/${id}/apply`, {
      method: 'POST',
    }),
  
  // Get applicants
  getApplicants: (id: string) => 
    apiRequest<{ success: boolean; applicants: unknown[] }>(`/campaigns/${id}/applicants`),
  
  // Select influencer
  selectInfluencer: (campaignId: string, influencerId: string) => 
    apiRequest<{ success: boolean; message: string }>(`/campaigns/${campaignId}/applicants/${influencerId}/select`, {
      method: 'POST',
    }),
  
  // Get available campaigns
  getAvailable: () => 
    apiRequest<{ success: boolean; campaigns: Campaign[] }>('/campaigns/available'),
  
  // Get my applications
  getMyApplications: () => 
    apiRequest<{ success: boolean; applications: unknown[] }>('/campaigns/my-applications'),
  
  // Get campaign products
  getProducts: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<{ success: boolean; products: Product[] }>(`/campaigns/products${query}`);
  },
};

// ============================================================================
// INFLUENCERS API
// ============================================================================

export interface Influencer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  primaryNiche?: string;
  location?: string;
  status: string;
  totalFollowers: number;
  engagementRate: number;
  profilePicture?: string;
  socialLinks: Record<string, string>;
  socialAccounts: {
    platform: string;
    handle: string;
    followerCount: number;
    profileUrl?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInfluencerInput {
  firstName: string;
  lastName: string;
  bio?: string;
  primaryNiche: string;
  location?: string;
  socialAccounts: {
    platform: string;
    handle: string;
    followerCount: number;
    profileUrl?: string;
  }[];
}

export const influencersApi = {
  // Get all influencers
  getAll: () => 
    apiRequest<Influencer[]>('/influencer/list'),
  
  // Get all influencers with success wrapper
  list: () => 
    apiRequest<{ success: boolean; data: Influencer[] }>('/influencer/list'),
  
  // Get current influencer profile
  getMe: () => 
    apiRequest<{ success: boolean; influencer: Influencer | null }>('/influencer/me'),
  
  // Get influencer stats
  getStats: () => 
    apiRequest<{ success: boolean; stats: unknown }>('/influencer/stats'),
  
  // Register as influencer
  register: (data: RegisterInfluencerInput) => 
    apiRequest<{ success: boolean; message: string; influencer: Influencer }>('/influencer/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Apply to campaign
  applyCampaign: (campaignId: string) => 
    apiRequest<{ success: boolean; application: unknown; message: string }>(`/influencer/apply/${campaignId}`, {
      method: 'POST',
    }),
  
  // Check if applied to campaign
  hasAppliedToCampaign: (campaignId: string) => 
    apiRequest<{ success: boolean; hasApplied: boolean }>(`/influencer/applied/${campaignId}`),
  
  // Reset (delete) influencer profile
  reset: () => 
    apiRequest<{ success: boolean; message: string }>('/influencer/reset', {
      method: 'DELETE',
    }),
  
  // Check influencer status
  checkStatus: () => 
    apiRequest<{ isInfluencer: boolean; status: string | null }>('/check-influencer-status'),
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationsApi = {
  // Get notifications
  getAll: (params?: { limit?: number; unreadOnly?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.unreadOnly) searchParams.set('unreadOnly', 'true');
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; notifications: Notification[] }>(`/notifications${query ? `?${query}` : ''}`);
  },
  
  // Get unread count
  getUnreadCount: () => 
    apiRequest<{ success: boolean; count: number }>('/notifications/unread-count'),
  
  // Mark all as read
  markAllAsRead: () => 
    apiRequest<{ success: boolean; message: string; count: number }>('/notifications/mark-all-read', {
      method: 'POST',
    }),
  
  // Mark one as read
  markAsRead: (id: string) => 
    apiRequest<{ success: boolean; notification: Notification }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  
  // Delete notification
  delete: (id: string) => 
    apiRequest<{ success: boolean; message: string }>(`/notifications/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// PROFILES API
// ============================================================================

// Note: Role enum matches Prisma schema
export type Role = 'ADMIN' | 'USER' | 'INFLUENCER';

export interface Profile {
  id: string;
  userId: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  socials: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileInput {
  name?: string;
  location?: string;
  bio?: string;
  image?: string;
}

export const profilesApi = {
  // Get current profile
  getMe: () => 
    apiRequest<{ success: boolean; profile: Profile | null }>('/profiles/me'),
  
  // Update profile
  update: (data: UpdateProfileInput) => 
    apiRequest<{ success: boolean; profile: Profile }>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Partial update profile
  patch: (data: UpdateProfileInput) => 
    apiRequest<{ success: boolean; profile: Profile }>('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// REVIEWS API
// ============================================================================

export interface Review {
  id: string;
  storeId: string;
  userId: string;
  rating: number;
  comment: string | null;
  images: string | null;
  videos: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewInput {
  storeId: string;
  rating: number;
  comment?: string;
  images?: string;
  videos?: string;
}

export const reviewsApi = {
  // Create review
  create: (data: CreateReviewInput) => 
    apiRequest<{ success: boolean; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Get store reviews
  getByStore: (storeId: string) => 
    apiRequest<{ success: boolean; reviews: Review[] }>(`/reviews/store/${storeId}`),
  
  // Get store rating
  getStoreRating: (storeId: string) => 
    apiRequest<{ success: boolean; averageRating: number; totalReviews: number }>(`/reviews/store/${storeId}/rating`),
  
  // Update review
  update: (id: string, data: Partial<CreateReviewInput>) => 
    apiRequest<{ success: boolean; review: Review }>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete review
  delete: (id: string) => 
    apiRequest<{ success: boolean; message: string }>(`/reviews/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// COMMENTS API
// ============================================================================

export interface Comment {
  id: string;
  content: string;
  productId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface CreateCommentInput {
  content: string;
}

export const commentsApi = {
  // Get comments for a product
  getByProduct: (productId: string) => 
    apiRequest<{ success: boolean; comments: Comment[]; count: number }>(`/comments/${productId}`),
  
  // Create a comment on a product
  create: (productId: string, data: CreateCommentInput) => 
    apiRequest<{ success: boolean; comment: Comment }>(`/comments/${productId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// UPLOAD API
// ============================================================================

export const uploadApi = {
  // Upload general media (logo, banner, gallery, video)
  uploadMedia: (file: File, type?: string) => 
    uploadFile('/new/media', file, type ? { type } : undefined),
  
  // Upload review media
  uploadReviewMedia: (file: File) => 
    uploadFile('/upload/media', file),
};

// ============================================================================
// BACKWARD COMPATIBILITY - Server Action Replacements
// ============================================================================

// These functions maintain the same API as the original server actions
// to minimize changes in existing components

// Profile actions
export const getCurrentProfile = async (): Promise<Profile | null> => {
  const response = await profilesApi.getMe();
  if (!response.profile) return null;
  // Transform date strings to Date objects for Prisma compatibility
  return {
    ...response.profile,
    createdAt: new Date(response.profile.createdAt),
    updatedAt: new Date(response.profile.updatedAt),
  };
};

export const updateProfile = async (data: UpdateProfileInput): Promise<Profile> => {
  const response = await profilesApi.update(data);
  return {
    ...response.profile,
    createdAt: new Date(response.profile.createdAt),
    updatedAt: new Date(response.profile.updatedAt),
  };
};

export const updateProfileFields = async (data: UpdateProfileInput): Promise<Profile> => {
  const response = await profilesApi.patch(data);
  return {
    ...response.profile,
    createdAt: new Date(response.profile.createdAt),
    updatedAt: new Date(response.profile.updatedAt),
  };
};

// Store actions
const transformStore = (store: Store): Store => ({
  ...store,
  createdAt: new Date(store.createdAt),
  updatedAt: new Date(store.updatedAt),
});

export const createStore = async (store: CreateStoreInput) => {
  const response = await storesApi.create(store);
  return transformStore(response.store);
};

export const getAllUserStores = async () => {
  const response = await storesApi.getUserStores();
  return response.stores.map(transformStore);
};

export const getStoreById = async (storeId: string) => {
  try {
    const response = await storesApi.getById(storeId);
    return transformStore(response.store);
  } catch {
    return null;
  }
};

export const getStores = async (params?: GetStoresParams) => {
  const response = await storesApi.getAllStores(params);
  return {
    ...response,
    stores: response.stores.map(transformStore),
  };
};

export const appendStoreDetails = async (storeId: string, storeDetails: Partial<CreateStoreInput>) => {
  const response = await storesApi.update(storeId, storeDetails);
  return transformStore(response.store);
};

// Product actions
export const createProduct = async (data: CreateProductInput) => {
  const response = await productsApi.create(data);
  return response.product;
};

export const getProducts = async (storeId?: string) => {
  if (!storeId) return [];
  const response = await productsApi.getByStore({ storeId });
  return response.products;
};

export const getProductById = async (productId: string) => {
  try {
    const response = await productsApi.getById(productId);
    return response.product;
  } catch {
    return null;
  }
};

export const updateProduct = async (productId: string, data: Partial<CreateProductInput>) => {
  const response = await productsApi.update(productId, data);
  return response.product;
};

export const deleteProduct = async (productId: string) => {
  await productsApi.delete(productId);
  return { success: true };
};

export const getPopularProducts = async (storeId: string) => {
  const response = await productsApi.getPopularProducts(storeId);
  return response.products;
};

export const getStoreActivity = async (storeId: string) => {
  const response = await productsApi.getStoreActivity(storeId);
  return response.activities;
};

// Service actions
export const createService = async (data: CreateServiceInput) => {
  const response = await servicesApi.create(data);
  return response.service;
};

export const getServicesByStore = async (storeId: string) => {
  const response = await servicesApi.getByStore(storeId);
  return response.services;
};

export const getServiceById = async (serviceId: string) => {
  try {
    const response = await servicesApi.getById(serviceId);
    return response.service;
  } catch {
    return null;
  }
};

export const updateService = async (serviceId: string, data: Partial<CreateServiceInput>) => {
  const response = await servicesApi.update(serviceId, data);
  return response.service;
};

export const deleteService = async (serviceId: string) => {
  await servicesApi.delete(serviceId);
  return { success: true };
};

// Campaign actions
export const createCampaign = async (data: CreateCampaignInput) => {
  const response = await campaignsApi.create(data);
  return response.campaign;
};

export const getCampaigns = async () => {
  const response = await campaignsApi.getAll();
  return response.campaigns;
};

export const getCampaignById = async (campaignId: string) => {
  try {
    const response = await campaignsApi.getById(campaignId);
    return response.campaign;
  } catch {
    return null;
  }
};

export const updateCampaign = async (campaignId: string, data: Partial<CreateCampaignInput>) => {
  const response = await campaignsApi.update(campaignId, data);
  return response.campaign;
};

export const deleteCampaign = async (campaignId: string) => {
  await campaignsApi.delete(campaignId);
  return { success: true };
};

export const publishCampaign = async (campaignId: string) => {
  const response = await campaignsApi.publish(campaignId);
  return response.campaign;
};

export const getAvailableCampaigns = async () => {
  const response = await campaignsApi.getAvailable();
  return response.campaigns;
};

export const applyCampaign = async (campaignId: string) => {
  return campaignsApi.apply(campaignId);
};

export const getCampaignInfluencers = async (campaignId: string) => {
  const response = await campaignsApi.getApplicants(campaignId);
  return response.applicants;
};

export const selectInfluencer = async (campaignId: string, influencerId: string) => {
  return campaignsApi.selectInfluencer(campaignId, influencerId);
};

export const getStoreApplications = async (storeId: string) => {
  const response = await campaignsApi.getAll({ storeId });
  return response.campaigns;
};

// Influencer actions
export const getCurrentInfluencer = async () => {
  const response = await influencersApi.getMe();
  return response.influencer;
};

export const getInfluencerStats = async (userId: string) => {
  const response = await influencersApi.getStats();
  return response.stats;
};

export const hasAppliedToCampaign = async (campaignId: string) => {
  const response = await influencersApi.hasAppliedToCampaign(campaignId);
  return response.hasApplied;
};

// Review actions
export const createStoreReview = async (review: CreateReviewInput) => {
  const response = await reviewsApi.create(review);
  return response.review;
};

export const getStoreReviews = async (storeId: string) => {
  const response = await reviewsApi.getByStore(storeId);
  return response.reviews;
};

// Export everything as default for convenience
export default {
  auth: authApi,
  health: healthApi,
  stores: storesApi,
  products: productsApi,
  services: servicesApi,
  campaigns: campaignsApi,
  influencers: influencersApi,
  notifications: notificationsApi,
  profiles: profilesApi,
  reviews: reviewsApi,
  comments: commentsApi,
  upload: uploadApi,
};
