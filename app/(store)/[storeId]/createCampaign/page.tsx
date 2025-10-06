"use client";
import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Calendar, Users, Target, Package, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

interface CampaignData {
  title: string;
  category: string;
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
}

const InfluencerCampaignManager = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    category: '',
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
    ]
  });

  const steps = [
    { id: 'basic-info', title: 'Basic Info', icon: <Users className="w-4 h-4" /> },
    { id: 'targets-goals', title: 'Targets & Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'campaign-objective', title: 'Campaign Objective', icon: <Target className="w-4 h-4" /> },
    { id: 'milestones', title: 'Milestones', icon: <Calendar className="w-4 h-4" /> },
    { id: 'deliverables', title: 'Deliverables', icon: <Package className="w-4 h-4" /> },
    { id: 'preview', title: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Snapchat', 'Twitch', 'Pinterest', 'Facebook'];
  const deliverableTypes = ['Instagram Post', 'Instagram Story', 'Instagram Reel', 'TikTok Video', 'YouTube Video', 'Blog Post', 'Product Review', 'Unboxing Video'];
  const categories = ['Fashion & Beauty', 'Technology', 'Food & Beverage', 'Travel', 'Fitness & Health', 'Lifestyle', 'Gaming', 'Education'];

  const handleInputChange = (field: keyof CampaignData, value: string | number) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handleTargetChange = (index: number, field: keyof Target, value: string) => {
    const newTargets = [...campaignData.targets];
    newTargets[index] = {
      ...newTargets[index],
      [field]: value
    };
    setCampaignData(prev => ({ ...prev, targets: newTargets }));
  };

  const addTarget = () => {
    setCampaignData(prev => ({
      ...prev,
      targets: [...prev.targets, { metric: '', value: '', unit: 'Users' }]
    }));
  };

  const removeTarget = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index)
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
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
          <h2 className="text-lg sm:text-xl font-semibold text-blue-900">Campaign Targets & Goals</h2>
        </div>
        
        <div className="space-y-4">
          {campaignData.targets.map((target, index) => (
            <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={target.metric}
                  onChange={(e) => handleTargetChange(index, 'metric', e.target.value)}
                  placeholder="Metric"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={target.value}
                  onChange={(e) => handleTargetChange(index, 'value', e.target.value)}
                  placeholder="Target Value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <select
                  value={target.unit}
                  onChange={(e) => handleTargetChange(index, 'unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Users</option>
                  <option>Percentage</option>
                  <option>Clicks</option>
                  <option>Sales</option>
                </select>
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
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Target
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Target Influencers</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Platforms <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {platforms.map(platform => (
                <label key={platform} className="flex items-center space-x-2 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaignData.platforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 truncate">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Followers</label>
              <input
                type="text"
                value={campaignData.minFollowers}
                onChange={(e) => handleInputChange('minFollowers', e.target.value)}
                placeholder="e.g., 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Followers</label>
              <input
                type="text"
                value={campaignData.maxFollowers}
                onChange={(e) => handleInputChange('maxFollowers', e.target.value)}
                placeholder="e.g., 100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Age Range</label>
              <select
                value={campaignData.ageRange}
                onChange={(e) => handleInputChange('ageRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select age range</option>
                <option>18-24</option>
                <option>25-34</option>
                <option>35-44</option>
                <option>45-54</option>
                <option>55+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Gender</label>
              <select
                value={campaignData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Any</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={campaignData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., US, UK, Global"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Content Style</label>
            <select
              value={campaignData.contentStyle}
              onChange={(e) => handleInputChange('contentStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select content style</option>
              <option>Casual & Authentic</option>
              <option>Professional & Polished</option>
              <option>Fun & Energetic</option>
              <option>Educational</option>
              <option>Minimalist</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Campaign Milestones</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Define key milestones and deadlines for your campaign</p>
      </div>

      <div className="space-y-4">
        {campaignData.milestones.map((milestone, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Milestone {index + 1}</h3>
              {index > 0 && (
                <button 
                  onClick={() => removeMilestone(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded shrink-0 ml-2"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={milestone.description}
                onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                placeholder="Describe this milestone..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addMilestone}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>
    </div>
  );

  const renderDeliverables = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Expected Deliverables</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Specify what content you expect from influencers</p>
      </div>

      <div className="space-y-4">
        {campaignData.deliverables.map((deliverable, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Deliverable {index + 1}</h3>
              {index > 0 && (
                <button 
                  onClick={() => removeDeliverable(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={deliverable.type}
                  onChange={(e) => handleDeliverableChange(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {deliverableTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={deliverable.quantity}
                  onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={deliverable.description}
                onChange={(e) => handleDeliverableChange(index, 'description', e.target.value)}
                placeholder="Describe the specific requirements for this deliverable..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addDeliverable}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
          {/* Default metrics if none provided */}
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
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Website Clicks</h4>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">650 / 1000 clicks</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">65.0% achieved</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Conversions</h4>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">28 / 50 sales</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '56%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">56.0% achieved</div>
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

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Contract Templates</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-blue-500 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Standard Influencer Agreement</h4>
            <p className="text-sm text-gray-600 mb-3">Basic agreement for Instagram collaborations</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Content usage rights</li>
              <li>• Payment terms</li>
              <li>• Deliverable timeline</li>
              <li>• FTC compliance</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Exclusive Partnership Contract</h4>
            <p className="text-sm text-gray-600 mb-3">Long-term exclusive brand partnership</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Exclusivity clause</li>
              <li>• Performance bonuses</li>
              <li>• Multi-platform rights</li>
              <li>• Extended timeline</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">User-Generated Content License</h4>
            <p className="text-sm text-gray-600 mb-3">Content creation and usage rights agreement</p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Perpetual usage rights</li>
              <li>• Commercial licensing</li>
              <li>• Content modifications</li>
              <li>• Attribution requirements</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Preview Contract
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Generate Contract
          </button>
        </div>
      </div>

      {/* Campaign Listings Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">How Your Campaign Will Appear</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-orange-100 to-pink-100 relative">
              <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{campaignData.title || 'Summer Fashion Collection'}</h4>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">StyleCo • {campaignData.category || 'Fashion & Beauty'}</p>
              <p className="text-sm text-gray-700 mb-4">
                {campaignData.description || 'Looking for fashion influencers to showcase our new summer collection. Perfect for style-conscious influencers who love trendy, sustainable fashion.'}
              </p>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Budget Range</span>
                  <span>${campaignData.budget ? `${campaignData.budget.split('-')[0]} - ${campaignData.budget}` : '$2,000 - $5,000'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span>{campaignData.location || 'United States'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Campaign Duration</span>
                  <span>{campaignData.startDate && campaignData.endDate ? `${campaignData.startDate} - ${campaignData.endDate}` : '01/06/2024 - 31/07/2024'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Application Deadline</span>
                  <span>15/07/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Current Applicants</span>
                  <span>23</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 relative">
              <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">Fitness App Beta Launch</h4>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Health & Fitness</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">FitTech Pro</p>
              <p className="text-sm text-gray-700 mb-4">Seeking fitness enthusiasts to promote our new workout app. Great for trainers, athletes, and fitness content creators.</p>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Budget Range</span>
                  <span>$2,000 - $8,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span>Remote</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Campaign Duration</span>
                  <span>20/07/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Followers</span>
                  <span>10K - 100K</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Instagram</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">YouTube</span>
              </div>
              
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Details & Apply
              </button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
          <p className="text-sm sm:text-base text-gray-600">Set up your comprehensive influencer marketing campaign</p>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8">
          {/* Mobile Step Navigation */}
          <div className="block sm:hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
                  ></div>
                </div>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                {steps[currentStep].title}
              </h2>
            </div>
          </div>
          
          {/* Desktop Step Navigation */}
          <div className="hidden sm:flex">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 lg:px-6 border-b-2 transition-all ${
                  currentStep === index
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {step.icon}
                <span className="font-medium text-sm lg:text-base hidden md:inline">{step.title}</span>
                <span className="font-medium text-sm md:hidden">{index + 1}</span>
                {index < currentStep && <CheckCircle className="w-4 h-4 text-green-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 border border-gray-300 rounded-lg transition-colors text-sm sm:text-base ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={currentStep === steps.length - 1 ? () => alert('Campaign Published!') : nextStep}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
          >
            {currentStep === steps.length - 1 ? 'Publish Campaign' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCampaignManager;