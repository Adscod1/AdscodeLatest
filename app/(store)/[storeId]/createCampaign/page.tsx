"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Calendar, Users, Target, Package, Eye, CheckCircle, Clock, AlertCircle, X, ChevronsUpDown, Check, Search, ShoppingBag } from 'lucide-react';
import { Command as CommandPrimitive } from "cmdk";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createCampaign } from '@/actions/campaign';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Campaign type enum matching backend
type CampaignType = 'PRODUCT' | 'DISCOUNT' | 'PROFILE';

// Define types for the campaign data
interface Target {
  metric: string;
  value: string;
  unit: string;
}

interface Milestone {
  title: string;
  description: string;
  dueDate: string;
}

interface Deliverable {
  type: string;
  quantity: number;
  description: string;
}

// Type-specific campaign data interfaces
interface DiscountCampaignData {
  discountId?: string;
  discountCode?: string;
  applicationInstructions?: string;
}

interface ProductCampaignData {
  productId?: string;
}

interface ProfileCampaignData {
  profileUrl: string;
  targetMetrics?: {
    followers?: number;
    engagement?: number;
    reach?: number;
  };
}

type TypeSpecificData = DiscountCampaignData | ProductCampaignData | ProfileCampaignData | null;

interface CampaignData {
  title: string;
  category: string;
  campaignType: string; // Frontend display name
  type?: CampaignType; // Backend enum value
  typeSpecificData?: TypeSpecificData; // Type-specific data
  description: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
  targets: Target[];
  platforms: string[];
  minFollowers: string;
  maxFollowers: string;
  ageRange: string;
  gender: string;
  location: string;
  campaignObjective: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  selectedInfluencers: Array<{
    id: string;
    name: string;
    handle: string;
    followers: string;
    image?: string;
    icon?: string;
    category?: string;
    engagement?: string;
    rating?: string;
  }>;
}

const InfluencerCampaignManager = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const storeId = params.storeId as string;

  // Check if there's a returnStep parameter in URL
  const returnStep = searchParams?.get('step');
  const initialStep = returnStep ? parseInt(returnStep) : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showProductBrowser, setShowProductBrowser] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [applicationInstructions, setApplicationInstructions] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [profileUrlError, setProfileUrlError] = useState<string>('');
  const [targetFollowers, setTargetFollowers] = useState<string>('');
  const [targetEngagement, setTargetEngagement] = useState<string>('');
  const [targetReach, setTargetReach] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    category: '',
    campaignType: '',
    description: '',
    budget: '',
    currency: 'USD ($)',
    startDate: '',
    endDate: '',
    targets: [
      { metric: 'Reach', value: '', unit: 'Users' },
      { metric: 'Engagement Rate', value: '', unit: 'Percentage' }
    ],
    platforms: [],
    minFollowers: '',
    maxFollowers: '',
    ageRange: '',
    gender: '',
    location: '',
    campaignObjective: '',
    milestones: [
      { title: 'Campaign Kickoff', description: '', dueDate: '' }
    ],
    deliverables: [
      { type: 'Instagram Post', quantity: 1, description: '' }
    ],
    selectedInfluencers: []
  });

  // Load selected influencers from localStorage on mount
  useEffect(() => {
    try {
      // Only run on client-side
      if (typeof window === 'undefined') return;
      
      const campaignTitle = campaignData.title || 'New Campaign';
      const campaignKey = `campaign_${campaignTitle}`;
      const savedInfluencers = localStorage.getItem(campaignKey);
      
      if (savedInfluencers) {
        const influencers = JSON.parse(savedInfluencers);
        setCampaignData(prev => ({
          ...prev,
          selectedInfluencers: influencers
        }));
      }
    } catch (error) {
      console.error('Error loading influencers from localStorage:', error);
    }
  }, []);

  // Load entire campaign data from localStorage on mount
  useEffect(() => {
    try {
      // Only run on client-side
      if (typeof window === 'undefined') return;
      
      const draftCampaignKey = `draft_campaign_${storeId}`;
      const savedCampaignData = localStorage.getItem(draftCampaignKey);
      
      if (savedCampaignData) {
        const parsedData = JSON.parse(savedCampaignData);
        
        // Also check for influencers saved with campaign title key
        const campaignTitle = parsedData.title || 'New Campaign';
        const campaignKey = `campaign_${campaignTitle}`;
        const savedInfluencers = localStorage.getItem(campaignKey);
        
        const influencersToUse = savedInfluencers 
          ? JSON.parse(savedInfluencers)
          : (parsedData.selectedInfluencers || []);
        
        // Restore campaign data with merged influencers
        setCampaignData({
          ...parsedData,
          selectedInfluencers: influencersToUse
        });
      }
    } catch (error) {
      console.error('Error loading campaign data from localStorage:', error);
    }
  }, [storeId]);

  // Update localStorage whenever selectedInfluencers or campaign title changes
  useEffect(() => {
    try {
      // Only run on client-side
      if (typeof window === 'undefined') return;
      
      if (campaignData.title) {
        const campaignKey = `campaign_${campaignData.title}`;
        if (campaignData.selectedInfluencers.length > 0) {
          localStorage.setItem(campaignKey, JSON.stringify(campaignData.selectedInfluencers));
        } else {
          localStorage.removeItem(campaignKey);
        }
      }
    } catch (error) {
      console.error('Error saving influencers to localStorage:', error);
    }
  }, [campaignData.title, campaignData.selectedInfluencers]);

  // Auto-save entire campaign data to localStorage whenever it changes
  useEffect(() => {
    try {
      // Only run on client-side
      if (typeof window === 'undefined') return;
      
      // Debounce the save to avoid excessive localStorage writes
      const debounceTimer = setTimeout(() => {
        const draftCampaignKey = `draft_campaign_${storeId}`;
        localStorage.setItem(draftCampaignKey, JSON.stringify(campaignData));
      }, 1000); // Save 1 second after user stops typing
      
      return () => clearTimeout(debounceTimer);
    } catch (error) {
      console.error('Error saving campaign data to localStorage:', error);
    }
  }, [campaignData, storeId]);

  // Map frontend campaign type strings to backend enum
  const mapCampaignTypeToEnum = (displayName: string): CampaignType => {
    switch (displayName) {
      case 'Product Campaign':
        return 'PRODUCT';
      case 'Discount Campaign':
        return 'DISCOUNT';
      case 'Profile Campaign':
        return 'PROFILE';
      default:
        return 'PRODUCT';
    }
  };

  // Fetch products from store
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams({
        storeId,
        limit: '50'
      });
      
      if (productSearchQuery) {
        params.append('search', productSearchQuery);
      }

      const response = await fetch(`/api/campaigns/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setUploadError('Failed to load products. Please try again.');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle product selection from browser
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    const productData: ProductCampaignData = {
      productId: product.id,
    };
    
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: productData
    }));
    
    setShowProductBrowser(false);
  };

  // Open product browser and fetch products
  const openProductBrowser = () => {
    setShowProductBrowser(true);
    fetchProducts();
  };

  // Handle discount selection from dropdown
  const handleDiscountSelect = (discountId: string) => {
    setSelectedDiscount(discountId);
    const discountData: DiscountCampaignData = {
      discountId: discountId,
      applicationInstructions: applicationInstructions
    };
    
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: discountData
    }));
  };

  // Handle discount code manual entry
  const handleDiscountCodeChange = (code: string) => {
    setDiscountCode(code);
    const discountData: DiscountCampaignData = {
      discountCode: code,
      applicationInstructions: applicationInstructions
    };
    
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: discountData
    }));
  };

  // Handle application instructions change
  const handleApplicationInstructionsChange = (instructions: string) => {
    setApplicationInstructions(instructions);
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: {
        ...(prev.typeSpecificData as DiscountCampaignData || {}),
        applicationInstructions: instructions
      }
    }));
  };

  // Profile URL handler (removed - feature disabled)
  const handleProfileUrlChange = (_url: string) => {
    // Feature disabled
  };

  // Target metrics handler (removed - feature disabled)
  const handleTargetMetricChange = (_metric: 'followers' | 'engagement' | 'reach', _value: string) => {
    // Feature disabled
  };

  const steps = [
    { id: 'basic-info', title: 'Basic Info', icon: <Users className="w-4 h-4" /> },
    { id: 'targets-goals', title: 'Targets & Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'milestones', title: 'Milestones', icon: <Calendar className="w-4 h-4" /> },
    { id: 'deliverables', title: 'Deliverables', icon: <Package className="w-4 h-4" /> },
    { id: 'preview', title: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Snapchat', 'Twitch', 'Pinterest', 'Facebook'];
  const deliverableTypes = ['Post', 'Story', 'Reel', 'TikTok Video', 'YouTube Video', 'Blog Post', 'Product Review', 'Unboxing Video'];
  const categories = ['Fashion & Beauty', 'Technology', 'Food & Beverage', 'Travel', 'Fitness & Health', 'Lifestyle', 'Gaming', 'Education'];
  const campaignTypes = ['Product Campaign', 'Discount Campaign', 'Profile Campaign'];
  const metricOptions = ['Reach', 'Views', 'Sales', 'Clicks', 'Conversion Rate', 'Engagement Rate', 'Reviews'];

  // African currencies
  const africanCurrencies = [
    { value: 'DZD (د.ج)', label: 'Algerian Dinar (DZD)', country: 'Algeria' },
    { value: 'AOA (Kz)', label: 'Angolan Kwanza (AOA)', country: 'Angola' },
    { value: 'BWP (P)', label: 'Botswana Pula (BWP)', country: 'Botswana' },
    { value: 'BIF (Fr)', label: 'Burundian Franc (BIF)', country: 'Burundi' },
    { value: 'CVE ($)', label: 'Cape Verdean Escudo (CVE)', country: 'Cape Verde' },
    { value: 'XAF (Fr)', label: 'Central African CFA Franc (XAF)', country: 'Central Africa' },
    { value: 'XOF (Fr)', label: 'West African CFA Franc (XOF)', country: 'West Africa' },
    { value: 'KMF (Fr)', label: 'Comorian Franc (KMF)', country: 'Comoros' },
    { value: 'CDF (Fr)', label: 'Congolese Franc (CDF)', country: 'DR Congo' },
    { value: 'DJF (Fr)', label: 'Djiboutian Franc (DJF)', country: 'Djibouti' },
    { value: 'EGP (£)', label: 'Egyptian Pound (EGP)', country: 'Egypt' },
    { value: 'ERN (Nfk)', label: 'Eritrean Nakfa (ERN)', country: 'Eritrea' },
    { value: 'SZL (L)', label: 'Eswatini Lilangeni (SZL)', country: 'Eswatini' },
    { value: 'ETB (Br)', label: 'Ethiopian Birr (ETB)', country: 'Ethiopia' },
    { value: 'GMD (D)', label: 'Gambian Dalasi (GMD)', country: 'Gambia' },
    { value: 'GHS (₵)', label: 'Ghanaian Cedi (GHS)', country: 'Ghana' },
    { value: 'GNF (Fr)', label: 'Guinean Franc (GNF)', country: 'Guinea' },
    { value: 'KES (KSh)', label: 'Kenyan Shilling (KES)', country: 'Kenya' },
    { value: 'LSL (L)', label: 'Lesotho Loti (LSL)', country: 'Lesotho' },
    { value: 'LRD ($)', label: 'Liberian Dollar (LRD)', country: 'Liberia' },
    { value: 'LYD (ل.د)', label: 'Libyan Dinar (LYD)', country: 'Libya' },
    { value: 'MGA (Ar)', label: 'Malagasy Ariary (MGA)', country: 'Madagascar' },
    { value: 'MWK (MK)', label: 'Malawian Kwacha (MWK)', country: 'Malawi' },
    { value: 'MRU (UM)', label: 'Mauritanian Ouguiya (MRU)', country: 'Mauritania' },
    { value: 'MUR (₨)', label: 'Mauritian Rupee (MUR)', country: 'Mauritius' },
    { value: 'MAD (د.م.)', label: 'Moroccan Dirham (MAD)', country: 'Morocco' },
    { value: 'MZN (MT)', label: 'Mozambican Metical (MZN)', country: 'Mozambique' },
    { value: 'NAD ($)', label: 'Namibian Dollar (NAD)', country: 'Namibia' },
    { value: 'NGN (₦)', label: 'Nigerian Naira (NGN)', country: 'Nigeria' },
    { value: 'RWF (Fr)', label: 'Rwandan Franc (RWF)', country: 'Rwanda' },
    { value: 'STN (Db)', label: 'São Tomé and Príncipe Dobra (STN)', country: 'São Tomé' },
    { value: 'SCR (₨)', label: 'Seychellois Rupee (SCR)', country: 'Seychelles' },
    { value: 'SLL (Le)', label: 'Sierra Leonean Leone (SLL)', country: 'Sierra Leone' },
    { value: 'SOS (Sh)', label: 'Somali Shilling (SOS)', country: 'Somalia' },
    { value: 'ZAR (R)', label: 'South African Rand (ZAR)', country: 'South Africa' },
    { value: 'SSP (£)', label: 'South Sudanese Pound (SSP)', country: 'South Sudan' },
    { value: 'SDG (ج.س.)', label: 'Sudanese Pound (SDG)', country: 'Sudan' },
    { value: 'TZS (TSh)', label: 'Tanzanian Shilling (TZS)', country: 'Tanzania' },
    { value: 'TND (د.ت)', label: 'Tunisian Dinar (TND)', country: 'Tunisia' },
    { value: 'UGX (USh)', label: 'Ugandan Shilling (UGX)', country: 'Uganda' },
    { value: 'ZMW (ZK)', label: 'Zambian Kwacha (ZMW)', country: 'Zambia' },
    { value: 'ZWL ($)', label: 'Zimbabwean Dollar (ZWL)', country: 'Zimbabwe' },
    // Add common international currencies for reference
    { value: 'USD ($)', label: 'US Dollar (USD)', country: 'United States' },
    { value: 'EUR (€)', label: 'Euro (EUR)', country: 'European Union' },
    { value: 'GBP (£)', label: 'British Pound (GBP)', country: 'United Kingdom' },
  ];

  // Helper function to get appropriate unit based on metric
  const getUnitForMetric = (metric: string): string => {
    const metricUnitMap: Record<string, string> = {
      'Reach': 'Users',
      'Views': 'Views',
      'Sales': 'Sales',
      'Clicks': 'Clicks',
      'Conversion Rate': 'Percentage',
      'Engagement Rate': 'Percentage',
      'Reviews': 'Reviews'
    };
    return metricUnitMap[metric] || 'Users';
  };

  // Helper function to get placeholder based on metric
  const getPlaceholderForMetric = (metric: string): string => {
    const metricPlaceholderMap: Record<string, string> = {
      'Reach': 'e.g., 100000',
      'Views': 'e.g., 50000',
      'Sales': 'e.g., 1000',
      'Clicks': 'e.g., 5000',
      'Conversion Rate': 'e.g., 5.5',
      'Engagement Rate': 'e.g., 3.2',
      'Reviews': 'e.g., 50'
    };
    return metricPlaceholderMap[metric] || 'Enter target value';
  };

  // Handle target change with auto-unit selection
  const handleTargetChange = (index: number, field: 'metric' | 'value' | 'unit', value: string) => {
    setCampaignData(prev => {
      const newTargets = [...prev.targets];
      newTargets[index] = { ...newTargets[index], [field]: value };
      
      // Auto-update unit when metric changes
      if (field === 'metric' && value) {
        newTargets[index].unit = getUnitForMetric(value);
      }
      
      return { ...prev, targets: newTargets };
    });
  };

  // Add new target
  const addTarget = () => {
    setCampaignData(prev => ({
      ...prev,
      targets: [...prev.targets, { metric: '', value: '', unit: 'Users' }]
    }));
  };

  // Remove target
  const removeTarget = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: keyof CampaignData, value: string | number) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handleCampaignTypeSelect = (type: string) => {
    const backendType = mapCampaignTypeToEnum(type);
    setCampaignData(prev => ({ 
      ...prev, 
      campaignType: type,
      type: backendType,
      typeSpecificData: null // Reset type-specific data when changing type
    }));
  };

  const handlePlatformChange = (platform: string) => {
    setCampaignData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...campaignData.milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: value
    };
    setCampaignData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    setCampaignData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', description: '', dueDate: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleDeliverableChange = (index: number, field: keyof Deliverable, value: string | number) => {
    const newDeliverables = [...campaignData.deliverables];
    newDeliverables[index] = {
      ...newDeliverables[index],
      [field]: value
    };
    setCampaignData(prev => ({ ...prev, deliverables: newDeliverables }));
  };

  const addDeliverable = () => {
    setCampaignData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, { type: 'Instagram Post', quantity: 1, description: '' }]
    }));
  };

  const removeDeliverable = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleObjectiveChange = (objective: string) => {
    setCampaignData(prev => ({ ...prev, campaignObjective: objective }));
  };



  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Validate type-specific data
  const validateTypeSpecificData = (): { valid: boolean; error?: string } => {
    if (!campaignData.type) {
      return { valid: false, error: 'Please select a campaign type' };
    }

    switch (campaignData.type) {
      case 'PRODUCT':
        if (!campaignData.typeSpecificData) {
          return { valid: false, error: 'Please select a product' };
        }
        const productData = campaignData.typeSpecificData as ProductCampaignData;
        if (!productData.productId) {
          return { valid: false, error: 'Product selection is required' };
        }
        break;

      case 'DISCOUNT':
        if (!campaignData.typeSpecificData) {
          return { valid: false, error: 'Please provide discount details' };
        }
        const discountData = campaignData.typeSpecificData as DiscountCampaignData;
        if (!discountData.discountId && !discountData.discountCode) {
          return { valid: false, error: 'Either discount selection or discount code is required' };
        }
        if (!applicationInstructions || applicationInstructions.trim() === '') {
          return { valid: false, error: 'Application instructions are required for Discount Campaign' };
        }
        break;

      case 'PROFILE':
        if (!profileUrl || profileUrl.trim() === '') {
          return { valid: false, error: 'Profile URL is required for Profile Campaign' };
        }
        if (profileUrlError) {
          return { valid: false, error: profileUrlError };
        }
        if (!campaignData.typeSpecificData || !('profileUrl' in campaignData.typeSpecificData)) {
          return { valid: false, error: 'Please provide a valid profile URL' };
        }
        break;

      default:
        return { valid: false, error: 'Invalid campaign type' };
    }

    return { valid: true };
  };

  // Validate basic campaign fields
  const validateBasicFields = (): { valid: boolean; error?: string } => {
    if (!campaignData.title || campaignData.title.trim() === '') {
      return { valid: false, error: 'Campaign title is required' };
    }

    if (campaignData.title.length < 3) {
      return { valid: false, error: 'Campaign title must be at least 3 characters' };
    }

    if (!campaignData.category) {
      return { valid: false, error: 'Campaign category is required' };
    }

    if (!campaignData.campaignType) {
      return { valid: false, error: 'Campaign type is required' };
    }

    if (!campaignData.description || campaignData.description.trim() === '') {
      return { valid: false, error: 'Campaign description is required' };
    }

    if (campaignData.description.length < 10) {
      return { valid: false, error: 'Campaign description must be at least 10 characters' };
    }

    if (!campaignData.budget || parseFloat(campaignData.budget) <= 0) {
      return { valid: false, error: 'Valid budget amount is required' };
    }

    if (!campaignData.startDate) {
      return { valid: false, error: 'Start date is required' };
    }

    if (!campaignData.endDate) {
      return { valid: false, error: 'End date is required' };
    }

    const startDate = new Date(campaignData.startDate);
    const endDate = new Date(campaignData.endDate);

    if (endDate <= startDate) {
      return { valid: false, error: 'End date must be after start date' };
    }

    return { valid: true };
  };

  // Handle campaign submission
  const handleSubmitCampaign = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate basic fields
      const basicValidation = validateBasicFields();
      if (!basicValidation.valid) {
        setSubmitError(basicValidation.error || 'Validation failed');
        setIsSubmitting(false);
        return;
      }

      // Platforms validation removed: UI no longer collects platforms

      // Validate type-specific data
      const typeValidation = validateTypeSpecificData();
      if (!typeValidation.valid) {
        setSubmitError(typeValidation.error || 'Type-specific validation failed');
        setIsSubmitting(false);
        return;
      }

      // Prepare campaign data for submission
      const submissionData: any = {
        title: campaignData.title,
        description: campaignData.description,
        budget: parseFloat(campaignData.budget),
        currency: campaignData.currency || 'USD',
        duration: campaignData.startDate && campaignData.endDate 
          ? Math.ceil((new Date(campaignData.endDate).getTime() - new Date(campaignData.startDate).getTime()) / (1000 * 60 * 60 * 24))
          : undefined,
        platforms: campaignData.platforms.length > 0 ? campaignData.platforms : undefined,
        targets: {
          awareness: campaignData.targets.filter(t => t.metric && t.value).map(t => `${t.metric}: ${t.value} ${t.unit}`),
          advocacy: [],
          conversions: [],
        },
        type: campaignData.type,
        typeSpecificData: campaignData.typeSpecificData || undefined,
      };

      // Call server action with publish flag to publish immediately
      const result = await createCampaign({ ...submissionData, publish: true });

      if (result.success) {
        // Clear localStorage on success
        try {
          // Clear draft campaign data
          localStorage.removeItem(`draft_campaign_${storeId}`);
          
          // Clear selected influencers data
          if (campaignData.title) {
            localStorage.removeItem(`campaign_${campaignData.title}`);
          }
          
          // Clear any other campaign-related data
          const keysToRemove = Object.keys(localStorage).filter(key => 
            key.includes('draft_campaign') || key.includes('campaign_')
          );
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
        
        // Success! Redirect to campaigns list
        router.push(`/${storeId}/campaign`);
      } else {
        // Log validation details if available
        if (result.details) {
          console.error('Validation errors:', result.details);
          // Show detailed validation errors
          const errorMessages = result.details.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
          setSubmitError(`Validation failed: ${errorMessages}`);
        } else {
          setSubmitError(result.error || 'Failed to create campaign');
        }
      }
    } catch (error) {
      console.error('Error submitting campaign:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    setSubmitError(null);

    switch (currentStep) {
      case 0: // Basic Info
        const basicValidation = validateBasicFields();
        if (!basicValidation.valid) {
          setSubmitError(basicValidation.error || 'Please complete all required fields');
          return false;
        }
        
        // Also validate type-specific data if type is selected
        if (campaignData.type) {
          const typeValidation = validateTypeSpecificData();
          if (!typeValidation.valid) {
            setSubmitError(typeValidation.error || 'Please complete type-specific requirements');
            return false;
          }
        }
        break;

      case 1: // Targets & Goals
        // Platforms requirement removed; proceed without platform selection
        break;

      case 2: // Milestones
        const validMilestones = campaignData.milestones.filter(m => m.title && m.dueDate);
        if (validMilestones.length === 0) {
          setSubmitError('Please add at least one milestone');
          return false;
        }
        break;

      case 3: // Deliverables
        const validDeliverables = campaignData.deliverables.filter(d => d.type && d.quantity > 0);
        if (validDeliverables.length === 0) {
          setSubmitError('Please add at least one deliverable');
          return false;
        }
        break;
    }

    return true;
  };

  // Enhanced nextStep with validation
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  // Product Browser Modal Component
  const ProductBrowserModal = () => {
    if (!showProductBrowser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Select Product from Shop</h2>
            <button 
              onClick={() => setShowProductBrowser(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <input
                type="text"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-250px)]">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No products found</p>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your search or add products to your store</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                      {product.price && (
                        <p className="text-blue-600 font-semibold">${product.price}</p>
                      )}
                      {product.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <button
              onClick={() => setShowProductBrowser(false)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Set up the fundamental details of your campaign</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaignData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter campaign title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={campaignData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type <span className="text-red-500">*</span>
            </label>
            <select
              value={campaignData.campaignType}
              onChange={(e) => handleCampaignTypeSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select campaign type</option>
              {campaignTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Campaign Type Specific Forms - Inline Sections */}

        {campaignData.campaignType === 'Product Campaign' && (
          <div className="mt-6">
            <div className="space-y-4">
              {selectedProduct ? (
                <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-3">
                    {selectedProduct.image && (
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">{selectedProduct.title}</p>
                      <p className="text-xs text-green-700 mt-1">
                        {selectedProduct.price && `$${selectedProduct.price}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setCampaignData(prev => ({ ...prev, typeSpecificData: null }));
                      }}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={openProductBrowser}
                  className="w-[50%] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Browse Shop
                </button>
              )}
            </div>
          </div>
        )}

        {campaignData.campaignType === 'Profile Campaign' && (
          <div className="mt-6 border-t-2 border-purple-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Campaign Setup</h3>
              </div>

              {false && profileUrl && !profileUrlError && (
                <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Profile URL Set</p>
                      <p className="text-xs text-purple-700 mt-1 truncate">{profileUrl}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Metrics (Optional)
                </h4>
                <p className="text-xs text-gray-500 mb-3">Set goals for profile growth</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Followers Goal
                    </label>
                    <input
                      type="number"
                      value={targetFollowers}
                      onChange={(e) => handleTargetMetricChange('followers', e.target.value)}
                      placeholder="e.g., 10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Engagement Goal
                    </label>
                    <input
                      type="number"
                      value={targetEngagement}
                      onChange={(e) => handleTargetMetricChange('engagement', e.target.value)}
                      placeholder="e.g., 500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Reach Goal
                    </label>
                    <input
                      type="number"
                      value={targetReach}
                      onChange={(e) => handleTargetMetricChange('reach', e.target.value)}
                      placeholder="e.g., 50000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {(targetFollowers || targetEngagement || targetReach) && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-purple-900 mb-2">Target Metrics Summary</h5>
                  <div className="space-y-1 text-xs text-purple-700">
                    {targetFollowers && (
                      <div className="flex justify-between">
                        <span>Followers:</span>
                        <span className="font-medium">{parseInt(targetFollowers).toLocaleString()}</span>
                      </div>
                    )}
                    {targetEngagement && (
                      <div className="flex justify-between">
                        <span>Engagement:</span>
                        <span className="font-medium">{parseInt(targetEngagement).toLocaleString()}</span>
                      </div>
                    )}
                    {targetReach && (
                      <div className="flex justify-between">
                        <span>Reach:</span>
                        <span className="font-medium">{parseInt(targetReach).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {campaignData.campaignType === 'Discount Campaign' && (
          <div className="mt-6 border-t-2 border-orange-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Discount Campaign Setup</h3>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-700">Select from Discount Database</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Discount (Optional)
                </label>
                <select
                  value={selectedDiscount}
                  onChange={(e) => handleDiscountSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an existing discount</option>
                  <option value="summer20">SUMMER20 - 20% Off Summer Collection</option>
                  <option value="first10">FIRST10 - $10 Off First Order</option>
                  <option value="freeship">FREESHIP - Free Shipping</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Choose a discount from your database</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Code (Optional)
                </label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => handleDiscountCodeChange(e.target.value)}
                  placeholder="Enter discount code (e.g., SAVE20)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a custom discount code manually</p>
              </div>

              {(selectedDiscount || discountCode) && (
                <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">Discount Selected</p>
                      <p className="text-xs text-orange-700 mt-1">
                        {selectedDiscount ? `ID: ${selectedDiscount}` : `Code: ${discountCode}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Instructions <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={applicationInstructions}
                  onChange={(e) => handleApplicationInstructionsChange(e.target.value)}
                  placeholder="Describe how this discount should be applied (e.g., influencers only, customers only, or both)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Specify who can use this discount and any special conditions</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={campaignData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your campaign objectives and requirements"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Campaign Objective</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Brand Awareness */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'brand-awareness' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('brand-awareness')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'brand-awareness' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'brand-awareness' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Brand Awareness</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Increase visibility and recognition of your brand</p>
              </div>
              {campaignData.campaignObjective === 'brand-awareness' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Lead Generation */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'lead-generation' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('lead-generation')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'lead-generation' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'lead-generation' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Lead Generation</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Capture potential customer information and contacts</p>
              </div>
              {campaignData.campaignObjective === 'lead-generation' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Website Traffic */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'website-traffic' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('website-traffic')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'website-traffic' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'website-traffic' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Website Traffic</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Drive more visitors to your website or landing page</p>
              </div>
              {campaignData.campaignObjective === 'website-traffic' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* App Installs */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'app-installs' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('app-installs')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'app-installs' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'app-installs' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">App Installs</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Drive mobile app downloads and installations</p>
              </div>
              {campaignData.campaignObjective === 'app-installs' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Engagement */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'engagement' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('engagement')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'engagement' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'engagement' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Engagement</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Boost likes, comments, shares and interactions</p>
              </div>
              {campaignData.campaignObjective === 'engagement' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'messages' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('messages')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'messages' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'messages' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Messages</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Encourage direct conversations and inquiries</p>
              </div>
              {campaignData.campaignObjective === 'messages' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Purchases */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'product-purchases' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('product-purchases')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'product-purchases' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'product-purchases' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Product Purchases</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Boost online product sales and conversions</p>
              </div>
              {campaignData.campaignObjective === 'product-purchases' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Catalog Sales */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'catalog-sales' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('catalog-sales')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'catalog-sales' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'catalog-sales' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Catalog Sales</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Promote products from your catalog inventory</p>
              </div>
              {campaignData.campaignObjective === 'catalog-sales' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Store Visits */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'store-visits' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('store-visits')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'store-visits' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'store-visits' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Store Visits</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Drive foot traffic to physical store locations</p>
              </div>
              {campaignData.campaignObjective === 'store-visits' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Calls */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'calls' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('calls')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'calls' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'calls' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Calls</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Drive phone calls and direct inquiries</p>
              </div>
              {campaignData.campaignObjective === 'calls' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Bookings */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'bookings' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('bookings')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'bookings' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'bookings' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Bookings</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Generate service bookings and appointments</p>
              </div>
              {campaignData.campaignObjective === 'bookings' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Event Responses */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'event-responses' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('event-responses')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'event-responses' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'event-responses' ? 'text-white' : 'text-gray-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5.8 11.3 2 22l10.7-3.79"/>
                  <path d="M4 3h.01"/>
                  <path d="M22 8h.01"/>
                  <path d="M15 2h.01"/>
                  <path d="M22 20h.01"/>
                  <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/>
                  <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/>
                  <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/>
                  <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Event Responses</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Promote events and increase attendance RSVPs</p>
              </div>
              {campaignData.campaignObjective === 'event-responses' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* UGC Content */}
          <div 
            className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'ugc-content' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('ugc-content')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                campaignData.campaignObjective === 'ugc-content' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  campaignData.campaignObjective === 'ugc-content' ? 'text-white' : 'text-gray-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-1">UGC Content</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Generate user-generated content and reviews</p>
              </div>
              {campaignData.campaignObjective === 'ugc-content' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaignData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="e.g., 5000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={currencyOpen}
                  className="w-full justify-between px-3 py-2 h-auto border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  {campaignData.currency || "Select currency..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start" side="bottom">
                <Command>
                  <div className="p-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <CommandPrimitive.Input
                        value={currencySearch}
                        onValueChange={setCurrencySearch}
                        placeholder="Search currency..."
                        className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                      {campaignData.currency && (
                        <button
                          type="button"
                          aria-label="Clear selection"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            handleInputChange('currency', '');
                            setCurrencySearch('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                      {africanCurrencies.map((currency) => (
                        <CommandItem
                          key={currency.value}
                          value={currency.label}
                          onSelect={() => {
                            handleInputChange('currency', currency.value);
                            setCurrencyOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              campaignData.currency === currency.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{currency.label}</span>
                            <span className="text-xs text-gray-500">{currency.country}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={campaignData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={campaignData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTargetsGoals = () => (
    <div className="space-y-6">
      {/* Campaign Targets Card */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Campaign Targets & Goals</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Define measurable goals for your campaign performance</p>
        
        <div className="space-y-4">
          {campaignData.targets.map((target, index) => (
            <div key={index} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex-1">
                <select
                  value={target.metric}
                  onChange={(e) => handleTargetChange(index, 'metric', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                >
                  <option value="">Select Metric</option>
                  {metricOptions.map(metric => (
                    <option key={metric} value={metric}>{metric}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={target.value}
                  onChange={(e) => handleTargetChange(index, 'value', e.target.value)}
                  placeholder={target.metric ? getPlaceholderForMetric(target.metric) : "Select a metric first"}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={target.unit}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                  placeholder="Auto-selected"
                />
              </div>
              <button
                onClick={() => removeTarget(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button
            onClick={addTarget}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Target
          </button>
        </div>
      </div>

      {/* Target Influencers Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Target Influencers</h3>
              <p className="text-sm text-gray-500">Browse and select influencers for your campaign</p>
            </div>
            <Link 
              href={`/${storeId}/creator-studio?tab=Discovery&campaignMode=true&campaignTitle=${encodeURIComponent(campaignData.title || 'New Campaign')}&step=1`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Influencers
            </Link>
          </div>

          {/* Selected Influencers List */}
          {campaignData.selectedInfluencers.length > 0 ? (
            <div className="space-y-3">
              {campaignData.selectedInfluencers.map((influencer) => (
                <div 
                  key={influencer.id} 
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Profile Picture/Icon */}
                    <div className="relative flex-shrink-0">
                      {influencer.image ? (
                        <img 
                          src={influencer.image} 
                          alt={influencer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                          {influencer.icon || influencer.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {/* Verified Badge */}
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <svg 
                          className="w-4 h-4" 
                          viewBox="0,0,256,256"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g 
                            fill="#228be6" 
                            fillRule="nonzero" 
                            stroke="none" 
                            strokeWidth="1" 
                            strokeLinecap="butt" 
                            strokeLinejoin="miter" 
                            strokeMiterlimit="10" 
                            strokeDasharray="" 
                            strokeDashoffset="0" 
                            fontFamily="none" 
                            fontWeight="none" 
                            fontSize="none" 
                            textAnchor="none" 
                            style={{mixBlendMode: 'normal'}}
                          >
                            <g transform="scale(8.53333,8.53333)">
                              <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>

                    {/* Influencer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{influencer.name}</h4>
                        <span className="text-sm text-gray-500">
                          {influencer.followers?.includes('-') 
                            ? influencer.followers.split('-')[0].trim() 
                            : influencer.followers}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {influencer.category && influencer.category.split(',').map((cat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Campaign Milestones</div>
                        <div className="font-medium text-gray-700">0-5</div>
                      </div>
                      {influencer.engagement && (
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Engagement Rate</div>
                          <div className="font-medium text-gray-700">{influencer.engagement}</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Performance Score</div>
                        <div className="font-medium text-gray-700">85%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Estimate Price</div>
                        <div className="font-medium text-gray-700">$100 - $200</div>
                      </div>
                    </div>
                  </div>

                  {/* View Profile & Remove Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/${storeId}/campaign/1/influencers/profile`}
                      className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                    >
                      {/* <Eye className="w-4 h-4" /> */}
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setCampaignData({
                          ...campaignData,
                          selectedInfluencers: campaignData.selectedInfluencers.filter(i => i.id !== influencer.id)
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
              <p className="text-sm text-gray-600">No influencers selected yet.</p>
              <p className="text-xs text-gray-500 mt-1">Click "Add Influencers" to discover and select creators for your campaign.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Campaign Milestones</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Define key milestones and deadlines for your campaign</p>
      </div>

      <div className="space-y-4">
        {campaignData.milestones.map((milestone, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Milestone {index + 1}</h3>
              {index > 0 && (
                <button 
                  onClick={() => removeMilestone(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                  placeholder="e.g., Campaign Kickoff"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={milestone.description}
                onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                placeholder="Describe this milestone..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all resize-none"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addMilestone}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>
    </div>
  );

  const renderDeliverables = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Expected Deliverables</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Specify what content you expect from influencers</p>
      </div>

      <div className="space-y-4">
        {campaignData.deliverables.map((deliverable, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Deliverable {index + 1}</h3>
              {index > 0 && (
                <button 
                  onClick={() => removeDeliverable(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={deliverable.type}
                  onChange={(e) => handleDeliverableChange(index, 'type', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                >
                  {deliverableTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={deliverable.quantity}
                  onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={2}
                value={deliverable.description}
                onChange={(e) => handleDeliverableChange(index, 'description', e.target.value)}
                placeholder="Describe the specific requirements for this deliverable..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all resize-none"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addDeliverable}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Deliverable
        </button>
      </div>
    </div>
  );

  const renderPreview = () => {
    // Check if required fields are filled
    const hasRequiredData = campaignData.title && 
                           campaignData.category && 
                           campaignData.description && 
                           campaignData.budget && 
                           campaignData.startDate && 
                           campaignData.endDate;

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
    };

    const formatDeadline = (dateString: string) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-GB'); // DD/MM/YYYY format
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">How Your Campaign Will Appear</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">This is how influencers will see your campaign</p>
        </div>

        {!hasRequiredData ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Campaign Details</h3>
              <p className="text-gray-600 mb-4">
                Fill in the required campaign information to preview how your campaign will appear to influencers.
              </p>
              <div className="text-left bg-white rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Required fields:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {!campaignData.title && <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Campaign Title</li>}
                  {!campaignData.category && <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Category</li>}
                  {!campaignData.description && <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Description</li>}
                  {!campaignData.budget && <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Budget</li>}
                  {!campaignData.startDate && <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Start Date</li>}
                  {!campaignData.endDate && <li className="flex items-center gap-2"><span className="text-red-500">✗</span> End Date</li>}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Campaign Card Preview */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Campaign Header Image */}
                <div className="h-48 sm:h-64 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-12 h-12 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="p-6">
                  {/* Title and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {campaignData.title}
                    </h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium ml-3 shrink-0">
                      Active
                    </span>
                  </div>

                  {/* Brand and Category */}
                  <p className="text-gray-600 text-sm mb-6">
                    Your Brand • {campaignData.category}
                  </p>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-6">
                      {campaignData.description}
                    </p>
                  </div>

                  {/* Campaign Info Grid */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Budget Range</span>
                      <span className="text-gray-900 font-semibold text-sm">
                        {campaignData.currency?.replace(/\s*\(.*\)/, '') || '$'}{campaignData.budget} - {campaignData.currency?.replace(/\s*\(.*\)/, '') || '$'}{campaignData.budget}
                      </span>
                    </div>
                    
                    {campaignData.location && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Location</span>
                        <span className="text-gray-900 font-semibold text-sm">
                          {campaignData.location}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Campaign Duration</span>
                      <span className="text-gray-900 font-semibold text-sm">
                        {formatDate(campaignData.startDate)} - {formatDate(campaignData.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Application Deadline</span>
                      <span className="text-gray-900 font-semibold text-sm">
                        {formatDeadline(campaignData.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600 text-sm">Current Applicants</span>
                      <span className="text-gray-900 font-semibold text-sm">0</span>
                    </div>
                  </div>

                  {/* Campaign Requirements Section - Combined */}
                  {(campaignData.targets.some(t => t.metric && t.value) || campaignData.milestones.some(m => m.title) || campaignData.deliverables.some(d => d.type)) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">Campaign Requirements</h4>
                      
                      <div className="space-y-4">
                        {/* Performance Targets */}
                        {campaignData.targets.some(t => t.metric && t.value) && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Performance Targets</h5>
                            <div className="space-y-1.5">
                              {campaignData.targets
                                .filter(t => t.metric && t.value)
                                .map((target, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{target.metric}</span>
                                    <span className="text-gray-900 font-medium">{target.value} {target.unit}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Expected Deliverables */}
                        {campaignData.deliverables.some(d => d.type) && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Expected Deliverables</h5>
                            <div className="space-y-1.5">
                              {campaignData.deliverables
                                .filter(d => d.type)
                                .map((deliverable, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{deliverable.type}</span>
                                    <span className="text-gray-900 font-medium">x{deliverable.quantity}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Key Milestones */}
                        {campaignData.milestones.some(m => m.title) && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Key Milestones</h5>
                            <div className="space-y-1.5">
                              {campaignData.milestones
                                .filter(m => m.title)
                                .map((milestone, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{milestone.title}</span>
                                    {milestone.dueDate && (
                                      <span className="text-gray-900 font-medium">{formatDate(milestone.dueDate)}</span>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apply Button */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-sm mt-6">
                    View Details & Apply Now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderTargetsGoals();
      case 2: return renderMilestones();
      case 3: return renderDeliverables();
      case 4: return renderPreview();
      default: return renderBasicInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductBrowserModal />
      
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">Create New Campaign</h1>
            <p className="text-sm text-gray-500">Set up your comprehensive influencer marketing campaign</p>
          </div>
        </div>

        {/* Tab Navigation - Wallet Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          {/* Mobile Step Navigation */}
          <div className="block sm:hidden border-b border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
                ></div>
              </div>
              <h2 className="mt-3 text-base font-medium text-gray-900">
                {steps[currentStep].title}
              </h2>
            </div>
          </div>
          
          {/* Desktop Tab Navigation - Wallet Style */}
          <div className="hidden sm:flex border-b border-gray-200 overflow-x-auto">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center justify-center gap-2 py-3.5 px-3 border-b-2 transition-all relative whitespace-nowrap flex-shrink-0 ${
                  currentStep === index
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className={`${currentStep === index ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.icon}
                </span>
                <span className={`font-medium text-xs sm:text-sm ${currentStep === index ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </span>
                {index < currentStep && (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content - Wallet Card Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {renderStepContent()}
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons - Wallet Style */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className={`w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg transition-colors text-sm font-medium ${
              currentStep === 0 || isSubmitting
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={currentStep === steps.length - 1 ? handleSubmitCampaign : handleNextStep}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white shadow-sm`}
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {currentStep === steps.length - 1 
              ? (isSubmitting ? 'Publishing...' : 'Publish Campaign')
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCampaignManager;