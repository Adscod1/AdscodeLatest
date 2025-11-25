'use client'

import React, { useState } from 'react'
import { X, Instagram, Youtube, Music, Twitter } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Location
  country: string
  city: string
  
  // Content Niche
  primaryNiche: string
  secondaryNiches: string[]
  bio: string
  
  // Social Media
  instagramHandle: string
  instagramFollowers: string
  youtubeChannel: string
  youtubeSubscribers: string
  tiktokHandle: string
  tiktokFollowers: string
  twitterHandle: string
  twitterFollowers: string
  
  // Professional
  websiteUrl: string
  ratePerPost: string
  brandCollaborations: string
}

const CreatorNetworkForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isOpen, setIsOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    primaryNiche: '',
    secondaryNiches: [],
    bio: '',
    instagramHandle: '',
    instagramFollowers: '',
    youtubeChannel: '',
    youtubeSubscribers: '',
    tiktokHandle: '',
    tiktokFollowers: '',
    twitterHandle: '',
    twitterFollowers: '',
    websiteUrl: '',
    ratePerPost: '',
    brandCollaborations: ''
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSecondaryNicheToggle = (niche: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryNiches: prev.secondaryNiches.includes(niche)
        ? prev.secondaryNiches.filter(n => n !== niche)
        : [...prev.secondaryNiches, niche]
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Validate step 1 (personal info and primary niche)
        if (!formData.firstName || !formData.lastName || !formData.primaryNiche) {
          alert('Please fill in all required fields: First Name, Last Name, and Primary Industry Niche');
          return false;
        }
        return true;
        
      case 2:
        // Validate step 2 (social media presence)
        // At least one social media account must have both handle and followers
        const hasCompleteSocialAccount = (
          (formData.instagramHandle && formData.instagramFollowers) ||
          (formData.youtubeChannel && formData.youtubeSubscribers) ||
          (formData.tiktokHandle && formData.tiktokFollowers) ||
          (formData.twitterHandle && formData.twitterFollowers)
        );
        
        if (!hasCompleteSocialAccount) {
          alert('Please complete at least one social media account (handle and followers)');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'primaryNiche'] as const;
    const emptyRequiredFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyRequiredFields.length > 0) {
      alert(`Please fill in all required fields: ${emptyRequiredFields.join(', ')}`);
      return;
    }
    
    // Validate that at least one social media account is provided
    if (!formData.instagramHandle && !formData.youtubeChannel && 
        !formData.tiktokHandle && !formData.twitterHandle) {
      alert('Please provide at least one social media account');
      return;
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare social accounts data
      const socialAccounts = []
      
      if (formData.instagramHandle) {
        if (!formData.instagramFollowers) {
          alert('Please select the number of Instagram followers');
          setIsSubmitting(false);
          return;
        }
        socialAccounts.push({
          platform: 'INSTAGRAM',
          handle: formData.instagramHandle,
          followers: formData.instagramFollowers,
          url: `https://instagram.com/${formData.instagramHandle.replace('@', '')}`
        })
      }
      
      if (formData.youtubeChannel) {
        if (!formData.youtubeSubscribers) {
          alert('Please select the number of YouTube subscribers');
          setIsSubmitting(false);
          return;
        }
        socialAccounts.push({
          platform: 'YOUTUBE',
          handle: formData.youtubeChannel,
          followers: formData.youtubeSubscribers,
          url: formData.youtubeChannel.startsWith('http') ? formData.youtubeChannel : `https://youtube.com/c/${formData.youtubeChannel}`
        })
      }
      
      if (formData.tiktokHandle) {
        if (!formData.tiktokFollowers) {
          alert('Please select the number of TikTok followers');
          setIsSubmitting(false);
          return;
        }
        socialAccounts.push({
          platform: 'TIKTOK',
          handle: formData.tiktokHandle,
          followers: formData.tiktokFollowers,
          url: `https://tiktok.com/@${formData.tiktokHandle.replace('@', '')}`
        })
      }
      
      if (formData.twitterHandle) {
        if (!formData.twitterFollowers) {
          alert('Please select the number of Twitter followers');
          setIsSubmitting(false);
          return;
        }
        socialAccounts.push({
          platform: 'TWITTER',
          handle: formData.twitterHandle,
          followers: formData.twitterFollowers,
          url: `https://twitter.com/${formData.twitterHandle.replace('@', '')}`
        })
      }

      const response = await fetch('/api/influencer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          primaryNiche: formData.primaryNiche,
          secondaryNiches: formData.secondaryNiches,
          bio: formData.bio,
          websiteUrl: formData.websiteUrl,
          ratePerPost: formData.ratePerPost,
          brandCollaborations: formData.brandCollaborations,
          socialAccounts
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Application submitted successfully! Redirecting to dashboard...')
        setIsOpen(false)
        // Redirect to influencer dashboard
        router.push('/influencer/Dashboard')
      } else {
        alert(result.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const primaryNiches = [
    'Fashion & Style',
    'Beauty & Skincare',
    'Fitness & Health',
    'Food & Cooking',
    'Travel',
    'Lifestyle',
    'Technology',
    'Gaming',
    'Education',
    'Entertainment',
    'Business',
    'DIY & Crafts'
  ]

  const followerRanges = [
    '1K - 10K',
    '10K - 50K',
    '50K',
    '100K - 500K',
    '500K - 1M',
    '1M+'
  ]

  const secondaryNicheOptions = [
    'Fashion & Style',
    'Beauty & Skincare',
    'Fitness & Health',
    'Food & Cooking',
    'Travel',
    'Lifestyle',
    'Technology',
    'Gaming'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-blue-600">
              Join Adscod's Creator Network
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Connect with top brands and monetize your content like never before
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information, Location, Content Niche, Bio */}
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-medium mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country/Region
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City/State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Los Angeles, CA"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Content Niche */}
              <div>
                <h3 className="text-lg font-medium mb-4">Content Niche</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Industry Niche *
                    </label>
                    <select
                      required
                      value={formData.primaryNiche}
                      onChange={(e) => handleInputChange('primaryNiche', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    >
                      <option value="">Select your main content focus</option>
                      {primaryNiches.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Niches (Max 3)
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      onChange={(e) => {
                        if (e.target.value && formData.secondaryNiches.length < 3) {
                          handleSecondaryNicheToggle(e.target.value)
                          e.target.value = '' // Reset select
                        }
                      }}
                    >
                      <option value="">Add secondary niches</option>
                      {secondaryNicheOptions
                        .filter(niche => niche !== formData.primaryNiche && !formData.secondaryNiches.includes(niche))
                        .map(niche => (
                          <option key={niche} value={niche}>{niche}</option>
                        ))}
                    </select>
                    {formData.secondaryNiches.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.secondaryNiches.map(niche => (
                          <span key={niche} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                            {niche}
                            <button
                              type="button"
                              onClick={() => handleSecondaryNicheToggle(niche)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio/About */}
              <div>
                <h3 className="text-lg font-medium mb-4">Bio/About You</h3>
                <textarea
                  placeholder="Tell us about yourself, your content style, and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Social Media Presence */}
          {currentStep === 2 && (
            <div className="p-6 space-y-6">
              {/* Bio/About continuation from previous step */}
              <div>
                <h3 className="text-lg font-medium mb-4">Bio/About You</h3>
                <textarea
                  placeholder="Tell us about yourself, your content style, and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                />
              </div>

              {/* Social Media Presence */}
              <div>
                <h3 className="text-lg font-medium mb-4">Social Media Presence</h3>
                <div className="space-y-6">
                  {/* Instagram */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@yourusername"
                        value={formData.instagramHandle}
                        onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Followers
                      </label>
                      <select
                        value={formData.instagramFollowers}
                        onChange={(e) => handleInputChange('instagramFollowers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      >
                        <option value="">Select range</option>
                        {followerRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Youtube className="w-4 h-4 mr-2 text-red-500" />
                        YouTube Channel
                      </label>
                      <input
                        type="text"
                        placeholder="Channel name or URL"
                        value={formData.youtubeChannel}
                        onChange={(e) => handleInputChange('youtubeChannel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subscribers
                      </label>
                      <select
                        value={formData.youtubeSubscribers}
                        onChange={(e) => handleInputChange('youtubeSubscribers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      >
                        <option value="">Select range</option>
                        {followerRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Music className="w-4 h-4 mr-2 text-black" />
                        TikTok Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@yourusername"
                        value={formData.tiktokHandle}
                        onChange={(e) => handleInputChange('tiktokHandle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Followers
                      </label>
                      <select
                        value={formData.tiktokFollowers}
                        onChange={(e) => handleInputChange('tiktokFollowers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      >
                        <option value="">Select range</option>
                        {followerRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Twitter/X */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                        Twitter/X Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@yourusername"
                        value={formData.twitterHandle}
                        onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Followers
                      </label>
                      <select
                        value={formData.twitterFollowers}
                        onChange={(e) => handleInputChange('twitterFollowers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      >
                        <option value="">Select range</option>
                        {followerRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website/Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Per Post (USD)
                    </label>
                    <input
                      type="text"
                      value={formData.ratePerPost}
                      onChange={(e) => handleInputChange('ratePerPost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Step with Brand Collaborations and Submit */}
          {currentStep === 3 && (
            <div className="p-6 space-y-6">
              {/* Previous Brand Collaborations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Brand Collaborations
                </label>
                <textarea
                  placeholder="List brands you've worked with previously..."
                  value={formData.brandCollaborations}
                  onChange={(e) => handleInputChange('brandCollaborations', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                />
              </div>

              {/* Final Navigation with Submit */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreatorNetworkForm;