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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600 mb-6">Set up the fundamental details of your campaign</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaignData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={campaignData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-blue-900">Campaign Targets & Goals</h2>
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
            <div className="grid grid-cols-3 gap-3">
              {platforms.map(platform => (
                <label key={platform} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaignData.platforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Followers</label>
              <input
                type="text"
                value={campaignData.minFollowers}
                onChange={(e) => handleInputChange('minFollowers', e.target.value)}
                placeholder="e.g., 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Followers</label>
              <input
                type="text"
                value={campaignData.maxFollowers}
                onChange={(e) => handleInputChange('maxFollowers', e.target.value)}
                placeholder="e.g., 100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Milestones</h2>
        <p className="text-gray-600 mb-6">Define key milestones and deadlines for your campaign</p>
      </div>

      <div className="space-y-4">
        {campaignData.milestones.map((milestone, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Milestone {index + 1}</h3>
              {index > 0 && (
                <button 
                  onClick={() => removeMilestone(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Expected Deliverables</h2>
        <p className="text-gray-600 mb-6">Specify what content you expect from influencers</p>
      </div>

      <div className="space-y-4">
        {campaignData.deliverables.map((deliverable, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Deliverable {index + 1}</h3>
              {index > 0 && (
                <button 
                  onClick={() => removeDeliverable(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={deliverable.quantity}
                  onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Preview</h2>
        <p className="text-gray-600 mb-6">Review your campaign details before publishing</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold text-blue-900">Campaign Targets</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
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

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-xl font-semibold text-green-900">Campaign Milestones</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Campaign Kickoff</h4>
              <p className="text-sm text-gray-600">Initial content planning and brand guidelines review</p>
            </div>
            <div className="text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">completed</span>
              <div className="text-gray-500 mt-1">2024-06-01</div>
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

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Package className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-xl font-semibold text-purple-900">Deliverables Tracker</h3>
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

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contract Templates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How Your Campaign Will Appear</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      case 2: return renderMilestones();
      case 3: return renderDeliverables();
      case 4: return renderPreview();
      default: return renderBasicInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
          <p className="text-gray-600">Set up your comprehensive influencer marketing campaign</p>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 border-b-2 transition-all ${
                  currentStep === index
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {step.icon}
                <span className="font-medium">{step.title}</span>
                {index < currentStep && <CheckCircle className="w-4 h-4 text-green-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2 border border-gray-300 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={currentStep === steps.length - 1 ? () => alert('Campaign Published!') : nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Publish Campaign' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCampaignManager;