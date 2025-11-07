"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Calendar, Users, Target, Package, Eye, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createCampaign } from '@/actions/campaign';

// Campaign type enum matching backend
type CampaignType = 'PRODUCT' | 'COUPON' | 'VIDEO' | 'PROFILE';

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

interface CallToAction {
  action: string;
  buttonText: string;
  destinationUrl: string;
  description: string;
}

// Type-specific campaign data interfaces
interface CouponCampaignData {
  couponId?: string;
  couponCode?: string;
  applicationInstructions?: string;
}

interface ProductCampaignData {
  productId?: string;
  productLink?: string;
  shopUrl?: string;
}

interface VideoCampaignData {
  videoUrl: string;
  videoSize: number;
  videoFormat: string;
  caption: string;
}

interface ProfileCampaignData {
  profileUrl: string;
  targetMetrics?: {
    followers?: number;
    engagement?: number;
    reach?: number;
  };
}

type TypeSpecificData = CouponCampaignData | ProductCampaignData | VideoCampaignData | ProfileCampaignData | null;

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
  contentStyle: string;
  campaignObjective: string;
  callToActions: CallToAction[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  selectedInfluencers: Array<{
    id: string;
    name: string;
    handle: string;
    followers: string;
  }>;
}

const InfluencerCampaignManager = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showProductBrowser, setShowProductBrowser] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [applicationInstructions, setApplicationInstructions] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [profileUrlError, setProfileUrlError] = useState<string>('');
  const [targetFollowers, setTargetFollowers] = useState<string>('');
  const [targetEngagement, setTargetEngagement] = useState<string>('');
  const [targetReach, setTargetReach] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    contentStyle: '',
    campaignObjective: '',
    callToActions: [],
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
        // Restore campaign data but keep current influencers if they exist
        setCampaignData(prev => ({
          ...parsedData,
          selectedInfluencers: prev.selectedInfluencers || parsedData.selectedInfluencers || []
        }));
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
      case 'Coupon Campaign':
        return 'COUPON';
      case 'Video Campaign':
        return 'VIDEO';
      case 'Profile Campaign':
        return 'PROFILE';
      default:
        return 'PRODUCT';
    }
  };

  // Handle video file upload
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload MP4, MOV, AVI, or WEBM files.');
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      setUploadError('File size exceeds 500MB limit.');
      return;
    }

    setIsUploadingVideo(true);
    setUploadError(null);
    setVideoUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);  // Changed from 'video' to 'file'
      formData.append('caption', ''); // Optional caption

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setVideoUploadProgress(progress);
        }
      });

      // Handle upload completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const videoData: VideoCampaignData = {
            videoUrl: response.videoUrl,
            videoSize: response.videoSize,
            videoFormat: response.videoFormat,
            caption: ''
          };
          
          setCampaignData(prev => ({
            ...prev,
            typeSpecificData: videoData
          }));
          
          setIsUploadingVideo(false);
          setVideoUploadProgress(0);
        } else {
          const error = JSON.parse(xhr.responseText);
          setUploadError(error.error || 'Upload failed. Please try again.');
          setIsUploadingVideo(false);
          setVideoUploadProgress(0);
        }
      });

      // Handle upload error
      xhr.addEventListener('error', () => {
        setUploadError('Network error. Please check your connection and try again.');
        setIsUploadingVideo(false);
        setVideoUploadProgress(0);
      });

      xhr.open('POST', '/api/campaigns/upload-video');
      xhr.send(formData);

    } catch (error) {
      console.error('Video upload error:', error);
      setUploadError('An unexpected error occurred. Please try again.');
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    }
  };

  // Handle video caption change
  const handleVideoCaptionChange = (caption: string) => {
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: {
        ...(prev.typeSpecificData as VideoCampaignData),
        caption
      }
    }));
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
      productLink: product.link || '',
      shopUrl: product.shopUrl || ''
    };
    
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: productData
    }));
    
    setShowProductBrowser(false);
  };

  // Handle product link change (manual entry)
  const handleProductLinkChange = (link: string) => {
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: {
        ...(prev.typeSpecificData as ProductCampaignData || {}),
        productLink: link
      }
    }));
  };

  // Handle shop URL change
  const handleShopUrlChange = (url: string) => {
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: {
        ...(prev.typeSpecificData as ProductCampaignData || {}),
        shopUrl: url
      }
    }));
  };

  // Open product browser and fetch products
  const openProductBrowser = () => {
    setShowProductBrowser(true);
    fetchProducts();
  };

  // Handle coupon selection from dropdown
  const handleCouponSelect = (couponId: string) => {
    setSelectedCoupon(couponId);
    const couponData: CouponCampaignData = {
      couponId: couponId,
      applicationInstructions: applicationInstructions
    };
    
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: couponData
    }));
  };

  // Handle coupon code manual entry
  const handleCouponCodeChange = (code: string) => {
    setCouponCode(code);
    const couponData: CouponCampaignData = {
      couponCode: code,
      applicationInstructions: applicationInstructions
    };
    
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: couponData
    }));
  };

  // Handle application instructions change
  const handleApplicationInstructionsChange = (instructions: string) => {
    setApplicationInstructions(instructions);
    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: {
        ...(prev.typeSpecificData as CouponCampaignData || {}),
        applicationInstructions: instructions
      }
    }));
  };

  // Validate profile URL
  const validateProfileUrl = (url: string): boolean => {
    if (!url) {
      setProfileUrlError('Profile URL is required');
      return false;
    }

    try {
      const urlObj = new URL(url);
      
      // Check if it's a valid social media profile URL
      const validDomains = [
        'instagram.com',
        'tiktok.com',
        'youtube.com',
        'twitter.com',
        'facebook.com',
        'linkedin.com',
        'twitch.tv'
      ];

      const isValidDomain = validDomains.some(domain => 
        urlObj.hostname.includes(domain)
      );

      if (!isValidDomain) {
        setProfileUrlError('Please enter a valid social media profile URL');
        return false;
      }

      setProfileUrlError('');
      return true;
    } catch (error) {
      setProfileUrlError('Please enter a valid URL (e.g., https://instagram.com/username)');
      return false;
    }
  };

  // Handle profile URL change
  const handleProfileUrlChange = (url: string) => {
    setProfileUrl(url);
    
    if (url) {
      validateProfileUrl(url);
      
      const profileData: ProfileCampaignData = {
        profileUrl: url,
        targetMetrics: {
          followers: targetFollowers ? parseInt(targetFollowers) : undefined,
          engagement: targetEngagement ? parseInt(targetEngagement) : undefined,
          reach: targetReach ? parseInt(targetReach) : undefined
        }
      };
      
      setCampaignData(prev => ({
        ...prev,
        typeSpecificData: profileData
      }));
    }
  };

  // Handle target metrics change
  const handleTargetMetricChange = (metric: 'followers' | 'engagement' | 'reach', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    
    if (metric === 'followers') setTargetFollowers(value);
    if (metric === 'engagement') setTargetEngagement(value);
    if (metric === 'reach') setTargetReach(value);

    setCampaignData(prev => ({
      ...prev,
      typeSpecificData: {
        ...(prev.typeSpecificData as ProfileCampaignData || { profileUrl }),
        targetMetrics: {
          ...((prev.typeSpecificData as ProfileCampaignData)?.targetMetrics || {}),
          [metric]: numValue
        }
      }
    }));
  };

  const steps = [
    { id: 'basic-info', title: 'Basic Info', icon: <Users className="w-4 h-4" /> },
    { id: 'targets-goals', title: 'Targets & Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'campaign-objective', title: 'Campaign Objective', icon: <Target className="w-4 h-4" /> },
    { id: 'milestones', title: 'Milestones', icon: <Calendar className="w-4 h-4" /> },
    { id: 'deliverables', title: 'Deliverables', icon: <Package className="w-4 h-4" /> },
    { id: 'preview', title: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Snapchat', 'Twitch', 'Pinterest', 'Facebook'];
  const deliverableTypes = ['Post', 'Story', 'Reel', 'TikTok Video', 'YouTube Video', 'Blog Post', 'Product Review', 'Unboxing Video'];
  const categories = ['Fashion & Beauty', 'Technology', 'Food & Beverage', 'Travel', 'Fitness & Health', 'Lifestyle', 'Gaming', 'Education'];
  const campaignTypes = ['Product Campaign', 'Coupon Campaign', 'Video Campaign', 'Profile Campaign'];
  const metricOptions = ['Reach', 'Views', 'Sales', 'Clicks', 'Conversion Rate', 'Engagement Rate', 'Reviews'];

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

  const handleCTAChange = (index: number, field: keyof CallToAction, value: string) => {
    const newCTAs = [...campaignData.callToActions];
    newCTAs[index] = {
      ...newCTAs[index],
      [field]: value
    };
    setCampaignData(prev => ({ ...prev, callToActions: newCTAs }));
  };

  const addCTA = () => {
    setCampaignData(prev => ({
      ...prev,
      callToActions: [...prev.callToActions, { action: '', buttonText: '', destinationUrl: '', description: '' }]
    }));
  };

  const removeCTA = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      callToActions: prev.callToActions.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Validate type-specific data
  const validateTypeSpecificData = (): { valid: boolean; error?: string } => {
    if (!campaignData.type) {
      return { valid: false, error: 'Please select a campaign type' };
    }

    switch (campaignData.type) {
      case 'VIDEO':
        if (!campaignData.typeSpecificData || !('videoUrl' in campaignData.typeSpecificData)) {
          return { valid: false, error: 'Please upload a video for Video Campaign' };
        }
        const videoData = campaignData.typeSpecificData as VideoCampaignData;
        if (!videoData.caption || videoData.caption.trim() === '') {
          return { valid: false, error: 'Video caption is required' };
        }
        if (videoData.videoSize > 500 * 1024 * 1024) {
          return { valid: false, error: 'Video size must not exceed 500MB' };
        }
        break;

      case 'PRODUCT':
        if (!campaignData.typeSpecificData) {
          return { valid: false, error: 'Please select a product or provide product details' };
        }
        const productData = campaignData.typeSpecificData as ProductCampaignData;
        if (!productData.productId && !productData.productLink) {
          return { valid: false, error: 'Either product selection or product link is required' };
        }
        if (productData.productLink && !productData.shopUrl) {
          return { valid: false, error: 'Shop URL is required when using product link' };
        }
        break;

      case 'COUPON':
        if (!campaignData.typeSpecificData) {
          return { valid: false, error: 'Please provide coupon details' };
        }
        const couponData = campaignData.typeSpecificData as CouponCampaignData;
        if (!couponData.couponId && !couponData.couponCode) {
          return { valid: false, error: 'Either coupon selection or coupon code is required' };
        }
        if (!applicationInstructions || applicationInstructions.trim() === '') {
          return { valid: false, error: 'Application instructions are required for Coupon Campaign' };
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

      // Validate platforms on submission
      if (campaignData.platforms.length === 0) {
        setSubmitError('Please select at least one platform');
        setIsSubmitting(false);
        return;
      }

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
        platforms: campaignData.platforms,
        targets: {
          awareness: campaignData.targets.filter(t => t.metric && t.value).map(t => `${t.metric}: ${t.value} ${t.unit}`),
          advocacy: [],
          conversions: [],
          contentType: [campaignData.contentStyle].filter(Boolean),
        },
        type: campaignData.type,
        typeSpecificData: campaignData.typeSpecificData || undefined,
      };

      // Call server action
      const result = await createCampaign(submissionData);

      if (result.success) {
        // Success! Redirect to campaigns list
        router.push(`/${storeId}/campaigns`);
      } else {
        setSubmitError(result.error || 'Failed to create campaign');
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
        if (campaignData.platforms.length === 0) {
          setSubmitError('Please select at least one platform');
          return false;
        }
        break;

      case 2: // Campaign Objective
        if (!campaignData.campaignObjective) {
          setSubmitError('Please select a campaign objective');
          return false;
        }
        break;

      case 3: // Milestones
        const validMilestones = campaignData.milestones.filter(m => m.title && m.dueDate);
        if (validMilestones.length === 0) {
          setSubmitError('Please add at least one milestone');
          return false;
        }
        break;

      case 4: // Deliverables
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Content Type <span className="text-red-500">*</span>
            </label>
            <select
              value={campaignData.contentStyle}
              onChange={(e) => handleInputChange('contentStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a content type</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Campaign Type Specific Forms - Inline Sections */}
        {campaignData.campaignType === 'Video Campaign' && (
          <div className="mt-6 border-t-2 border-blue-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Video Campaign Setup</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video <span className="text-red-500">*</span>
                </label>
                
                {!campaignData.typeSpecificData && !isUploadingVideo && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/mp4,video/quicktime,video/x-msvideo,video/webm" 
                      className="hidden" 
                      id="video-upload"
                      onChange={handleVideoUpload}
                      disabled={isUploadingVideo}
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Click to upload video</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, or WEBM (max 500MB)</p>
                    </label>
                  </div>
                )}

                {isUploadingVideo && (
                  <div className="border-2 border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                    <div className="text-blue-600 mb-2">
                      <svg className="w-12 h-12 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-blue-700 font-medium mb-2">Uploading video...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${videoUploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600">{videoUploadProgress}%</p>
                  </div>
                )}

                {campaignData.typeSpecificData && 'videoUrl' in campaignData.typeSpecificData && (
                  <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">Video uploaded successfully</p>
                        <p className="text-xs text-green-700 mt-1">
                          {((campaignData.typeSpecificData as VideoCampaignData).videoSize / (1024 * 1024)).toFixed(2)} MB · {(campaignData.typeSpecificData as VideoCampaignData).videoFormat}
                        </p>
                      </div>
                      <button
                        onClick={() => setCampaignData(prev => ({ ...prev, typeSpecificData: null }))}
                        className="text-green-700 hover:text-green-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Caption or Campaign Brief <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={campaignData.typeSpecificData && 'caption' in campaignData.typeSpecificData ? (campaignData.typeSpecificData as VideoCampaignData).caption : ''}
                  onChange={(e) => handleVideoCaptionChange(e.target.value)}
                  placeholder="Add a video caption or campaign brief..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {campaignData.campaignType === 'Product Campaign' && (
          <div className="mt-6 border-t-2 border-green-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Product Campaign Setup</h3>
              </div>

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
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Browse Shop
                </button>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Link (Optional)
                </label>
                <input
                  type="text"
                  value={campaignData.typeSpecificData && 'productLink' in campaignData.typeSpecificData ? (campaignData.typeSpecificData as ProductCampaignData).productLink : ''}
                  onChange={(e) => handleProductLinkChange(e.target.value)}
                  placeholder="https://example.com/product"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a direct link to the product (if not selected from shop)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop URL (Optional)
                </label>
                <input
                  type="text"
                  value={campaignData.typeSpecificData && 'shopUrl' in campaignData.typeSpecificData ? (campaignData.typeSpecificData as ProductCampaignData).shopUrl : ''}
                  onChange={(e) => handleShopUrlChange(e.target.value)}
                  placeholder="https://myshop.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Your shop URL where the product is available</p>
              </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={(e) => handleProfileUrlChange(e.target.value)}
                  onBlur={(e) => validateProfileUrl(e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    profileUrlError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {profileUrlError ? (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {profileUrlError}
                  </p>
                ) : profileUrl && !profileUrlError ? (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Valid profile URL
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Enter Instagram, TikTok, YouTube, Twitter, Facebook, LinkedIn, or Twitch profile URL
                  </p>
                )}
              </div>

              {profileUrl && !profileUrlError && (
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

        {campaignData.campaignType === 'Coupon Campaign' && (
          <div className="mt-6 border-t-2 border-orange-200 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Coupon Campaign Setup</h3>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-700">Select from Coupon Database</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Coupon (Optional)
                </label>
                <select 
                  value={selectedCoupon}
                  onChange={(e) => handleCouponSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an existing coupon</option>
                  <option value="summer20">SUMMER20 - 20% Off Summer Collection</option>
                  <option value="first10">FIRST10 - $10 Off First Order</option>
                  <option value="freeship">FREESHIP - Free Shipping</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Choose a coupon from your database</p>
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
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => handleCouponCodeChange(e.target.value)}
                  placeholder="Enter coupon code (e.g., SAVE20)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a custom coupon code manually</p>
              </div>

              {(selectedCoupon || couponCode) && (
                <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">Coupon Selected</p>
                      <p className="text-xs text-orange-700 mt-1">
                        {selectedCoupon ? `ID: ${selectedCoupon}` : `Code: ${couponCode}`}
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
                  placeholder="Describe how this coupon should be applied (e.g., influencers only, customers only, or both)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Specify who can use this coupon and any special conditions</p>
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
            <select
              value={campaignData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
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

  const renderCampaignObjective = () => (
    <div className="space-y-8">
      {/* Campaign Objective Section */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3l3.293 3.293-7 7-1.586-1.586L13 3z"/>
              <path d="m11 3.207-6.793 6.793 1.586 1.586L12 5.379 11 3.207z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Campaign Objective <span className="text-red-500">*</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* App Installs */}
          <div 
            className={`relative p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'app-installs' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('app-installs')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">App Installs</h3>
              </div>
              {campaignData.campaignObjective === 'app-installs' && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Drive mobile app downloads and installations</p>
          </div>

          {/* Video Views */}
          <div 
            className={`relative p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'video-views' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('video-views')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Video Views</h3>
              </div>
              {campaignData.campaignObjective === 'video-views' && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Increase video content engagement and reach</p>
          </div>

          {/* Bookings */}
          <div 
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'bookings' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('bookings')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
              </div>
              {campaignData.campaignObjective === 'bookings' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Generate service bookings and appointments</p>
          </div>

          {/* Calls */}
          <div 
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'calls' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('calls')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Calls</h3>
              </div>
              {campaignData.campaignObjective === 'calls' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Drive phone calls and direct inquiries</p>
          </div>

          {/* Product Purchases */}
          <div 
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'product-purchases' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('product-purchases')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Product Purchases</h3>
              </div>
              {campaignData.campaignObjective === 'product-purchases' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Boost product sales and conversions</p>
          </div>

          {/* UGC Content */}
          <div 
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              campaignData.campaignObjective === 'ugc-content' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleObjectiveChange('ugc-content')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">UGC Content</h3>
              </div>
              {campaignData.campaignObjective === 'ugc-content' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Generate user-generated content and reviews</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 shrink-0">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Add Call-to-Action <span className="text-red-500">*</span>
          </h2>
        </div>

        {campaignData.callToActions.length === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Action <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                  <option value="">Select Campaign Action</option>
                  <option value="app-download">App Download</option>
                  <option value="website-visit">Website Visit</option>
                  <option value="product-purchase">Product Purchase</option>
                  <option value="sign-up">Sign Up</option>
                  <option value="contact-us">Contact Us</option>
                  <option value="book-appointment">Book Appointment</option>
                  <option value="watch-video">Watch Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter button text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief explanation of what happens when users click"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={addCTA}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add CTA
            </button>
          </div>
        )}

        {campaignData.callToActions.length > 0 && (
          <div className="space-y-6">
            {campaignData.callToActions.map((cta, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Call-to-Action {index + 1}</h3>
                  <button 
                    onClick={() => removeCTA(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Action <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={cta.action}
                      onChange={(e) => handleCTAChange(index, 'action', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Campaign Action</option>
                      <option value="app-download">App Download</option>
                      <option value="website-visit">Website Visit</option>
                      <option value="product-purchase">Product Purchase</option>
                      <option value="sign-up">Sign Up</option>
                      <option value="contact-us">Contact Us</option>
                      <option value="book-appointment">Book Appointment</option>
                      <option value="watch-video">Watch Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cta.buttonText}
                      onChange={(e) => handleCTAChange(index, 'buttonText', e.target.value)}
                      placeholder="Enter button text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    value={cta.destinationUrl}
                    onChange={(e) => handleCTAChange(index, 'destinationUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={cta.description}
                    onChange={(e) => handleCTAChange(index, 'description', e.target.value)}
                    placeholder="Brief explanation of what happens when users click"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addCTA}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another CTA
            </button>
          </div>
        )}
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
              <p className="text-sm text-gray-500">Selected influencers for this campaign</p>
            </div>
            <Link 
              href={`/${storeId}/creator-studio?tab=Discovery&campaignMode=true&campaignTitle=${encodeURIComponent(campaignData.title || 'New Campaign')}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Influencers
            </Link>
          </div>

          {/* Selected Influencers List */}
          {campaignData.selectedInfluencers.length > 0 ? (
            <div className="space-y-2">
              {campaignData.selectedInfluencers.map((influencer) => (
                <div 
                  key={influencer.id} 
                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{influencer.name}</p>
                    <p className="text-sm text-gray-600">{influencer.handle} • {influencer.followers} followers</p>
                  </div>
                  <button
                    onClick={() => {
                      setCampaignData({
                        ...campaignData,
                        selectedInfluencers: campaignData.selectedInfluencers.filter(i => i.id !== influencer.id)
                      });
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
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

        <Link 
          href={`/${storeId}/creator-studio?tab=Discovery&campaignMode=true&campaignTitle=${encodeURIComponent(campaignData.title || 'New Campaign')}`}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Discover More Influencers</h3>
              <p className="text-xs text-gray-500">Browse and select additional influencers for your campaign</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180 group-hover:text-blue-600 transition-colors" />
        </Link>
      </div>

      {/* Preferred Content Style */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Preferred Content Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Casual & Authentic', 'Professional & Polished', 'Fun & Energetic', 'Educational', 'Minimalist'].map(style => (
            <label key={style} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group">
              <input
                type="checkbox"
                checked={campaignData.contentStyle === style}
                onChange={() => handleInputChange('contentStyle', style)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{style}</span>
            </label>
          ))}
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

  const renderPreview = () => (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Campaign Preview</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Review your campaign details before publishing</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900">Campaign Targets</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {campaignData.targets.filter(t => t.metric && t.value).map((target, index) => (
            <div key={index} className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{target.metric}</h4>
              <div className="mt-2">
                <div className="text-sm text-gray-600">{target.value} {target.unit}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${Math.random() * 80 + 10}%`}}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.floor(Math.random() * 40 + 40)}% achieved</div>
              </div>
            </div>
          ))}
          {campaignData.targets.filter(t => t.metric && t.value).length === 0 && (
            <>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Reach</h4>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">35,000 / 50,000 users</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">70.0% achieved</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Engagement Rate</h4>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">4.2 / 5.5 %</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '76%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">76.4% achieved</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-green-900">Campaign Milestones</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Campaign Kickoff</h4>
              <p className="text-xs sm:text-sm text-gray-600">Initial content planning and brand guidelines review</p>
            </div>
            <div className="text-right shrink-0">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">completed</span>
              <div className="text-gray-500 mt-1 text-xs">2024-06-01</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <Clock className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Content Creation</h4>
              <p className="text-sm text-gray-600">Create and submit initial content for approval</p>
            </div>
            <div className="text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">in progress</span>
              <div className="text-gray-500 mt-1">2024-06-15</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Campaign Launch</h4>
              <p className="text-sm text-gray-600">Publish approved content and begin promotion</p>
            </div>
            <div className="text-sm">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">pending</span>
              <div className="text-gray-500 mt-1">2024-06-20</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-purple-900">Deliverables Tracker</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Instagram Post</h4>
              <p className="text-sm text-gray-600">Summer collection showcase - lifestyle shot</p>
              <div className="text-xs text-gray-500 mt-1">Due: 2024-06-10</div>
            </div>
            <div className="text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">approved</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Instagram Story</h4>
              <p className="text-sm text-gray-600">Behind-the-scenes content creation</p>
              <div className="text-xs text-gray-500 mt-1">Due: 2024-06-12</div>
            </div>
            <div className="text-sm">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">in review</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Reel</h4>
              <p className="text-sm text-gray-600">Product styling and outfit ideas</p>
              <div className="text-xs text-gray-500 mt-1">Due: 2024-06-15</div>
            </div>
            <div className="text-sm">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderTargetsGoals();
      case 2: return renderCampaignObjective();
      case 3: return renderMilestones();
      case 4: return renderDeliverables();
      case 5: return renderPreview();
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
          <div className="hidden sm:flex border-b border-gray-200">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 border-b-2 transition-all relative ${
                  currentStep === index
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className={`${currentStep === index ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.icon}
                </span>
                <span className={`font-medium text-sm ${currentStep === index ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </span>
                {index < currentStep && (
                  <CheckCircle className="w-4 h-4 text-green-500 absolute top-2 right-2" />
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