"use client";

import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Users, Calendar, DollarSign, ArrowLeft, Check, Video, Image, Package, Film, Camera, MessageSquare, LucideIcon, UserCheck, Briefcase, Laptop } from 'lucide-react';
import InfluencerSidebar from '@/components/ui/influencersidebar';

interface ActiveCampaign {
  id: string;
  name: string;
  brand: string;
  budget: number;
  dueDate: string;
  category: 'Banking' | 'Technology';
  deliverables: number;
  status: 'active' | 'completed';
  progress: number;
  statusColor?: 'blue' | 'orange';
  deliveryItems: { name: string }[];
}

interface Transaction {
  id: string;
  title: string;
  campaign?: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
}

interface UploadedFile {
  name: string;
  size: string;
}

const CampaignsPage = () => {
  const [selectedTab, setSelectedTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'details' | 'upload' | 'success'>('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedContentType, setSelectedContentType] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const campaigns = [
    {
      id: 1,
      name: 'Summer Fashion Collection Launch',
      brand: 'Fashion Brand Co.',
      budget: 2500,
      dueDate: '15/07/2024',
      category: 'Banking',
      deliverables: 3,
      progress: 65,
      status: 'In Progress',
      statusColor: 'blue',
      location: 'Remote',
      applicants: '45,100',
      deliveryItems: [
        { name: 'Posts', dueDate: '10/07/2024', status: 'In Progress', statusColor: 'blue' },
        { name: 'Stories', dueDate: '12/07/2024', status: 'Pending', statusColor: 'gray' },
        { name: 'Reel', dueDate: '14/07/2024', status: 'Pending', statusColor: 'gray' }
      ],
      description: 'Create engaging content showcasing our new summer collection. Focus on vibrant colors, beach vibes, and comfortable everyday wear. Target audience: 18-35 year old fashion-conscious individuals.',
      requirements: [
        '3 high-quality Banking posts featuring different outfits',
        '2 Banking stories with behind-the-scenes content',
        '1 Banking Reel (30-60 seconds) showing outfit transitions',
        'Use branded hashtags: #SummerVibes2024 #FashionBrandCo',
        'Tag @fashionbrandco in all posts'
      ]
    },
    {
      id: 2,
      name: 'Fitness App Beta Launch',
      brand: 'Fitness Sensations',
      budget: 1800,
      dueDate: '20/07/2024',
      category: 'Technology',
      deliverables: 2,
      progress: 100,
      status: 'Review',
      statusColor: 'orange',
      location: 'Kampala',
      applicants: '23,350',
      deliveryItems: [
        { name: 'Video Review', dueDate: '18/07/2024', status: 'Completed', statusColor: 'green' },
        { name: 'Posts', dueDate: '20/07/2024', status: 'Completed', statusColor: 'green' }
      ],
      description: 'Review our new fitness app and create engaging content for your audience.',
      requirements: [
        '1 comprehensive video review (10-15 minutes)',
        '2 social media posts promoting the app',
        'Honest feedback about features and user experience'
      ]
    }
  ];

  const recentTransactions = [
    { id: 1, title: 'Payment from Fashion Brand Co.', campaign: 'Summer Campaign', date: '14/06/2024', amount: 2500, status: 'completed', type: 'credit' },
    { id: 2, title: 'Bank withdrawal', date: '14/06/2024', amount: -1500, status: 'completed', type: 'debit' },
    { id: 3, title: 'Escrowed payment', campaign: 'Fitness App Campaign', date: '14/06/2024', amount: 1800, status: 'pending', type: 'credit' },
    { id: 4, title: 'Performance bonus', campaign: 'Tech Review Campaign', date: '12/06/2024', amount: 500, status: 'completed', type: 'credit' }
  ];

  const contentTypes = [
    { id: 'ugc', name: 'UGC Content', icon: Video },
    { id: 'product-review', name: 'Product Review', icon: MessageSquare },
    { id: 'social-post', name: 'Social Post', icon: Image },
    { id: 'social-reel', name: 'Social Reel', icon: Film },
    { id: 'unboxing', name: 'Unboxing Video', icon: Package },
    { id: 'product-photos', name: 'Product Photos', icon: Camera }
  ];

  const stats = [
    { label: 'Available', count: 24, color: 'text-blue-600' },
    { label: 'Applied', count: 3, color: 'text-orange-500' },
    { label: 'Completed', count: 0, color: 'text-green-600' },
    { label: 'Total Earned (UGX)', count: 0, color: 'text-purple-600' }
  ];

  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setCurrentView('details');
  };

  const handleUploadContent = (campaign: any) => {
    setSelectedCampaign(campaign);
    setCurrentView('upload');
    setUploadStep(1);
    setSelectedContentType('');
    setUploadedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2)
      });
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      campaign.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{campaign.brand}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${campaign.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due {campaign.dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  {campaign.category === 'Banking' ? <Briefcase className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                  <span>{campaign.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{campaign.deliverables} deliverables</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{campaign.location}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{campaign.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {campaign.deliveryItems.map((item: any, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {item.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleViewDetails(campaign)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleUploadContent(campaign)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Content
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                    {transaction.campaign && (
                      <div className="text-xs text-gray-500">{transaction.campaign}</div>
                    )}
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : ''}{transaction.amount > 0 ? '$' : '-$'}{Math.abs(transaction.amount)}
                    </div>
                    <div className="text-xs text-gray-500">{transaction.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedCampaign) return null;

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCampaign.name}</h2>
              <p className="text-gray-600">{selectedCampaign.brand}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded ${
              selectedCampaign.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {selectedCampaign.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Budget</span>
              </div>
              <div className="text-xl font-bold text-gray-900">${selectedCampaign.budget.toLocaleString()}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Due Date</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{selectedCampaign.dueDate}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Location</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{selectedCampaign.location}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                {selectedCampaign.category === 'Banking' ? <Briefcase className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                <span className="text-sm">Category</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{selectedCampaign.category}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Deliverables</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{selectedCampaign.deliverables}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <UserCheck className="w-4 h-4" />
                <span className="text-sm">Applied</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{selectedCampaign.applicants} applied</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Overall Progress</h3>
              <span className="text-sm font-semibold text-gray-900">{selectedCampaign.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${selectedCampaign.progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Description</h3>
            <p className="text-gray-700 leading-relaxed">{selectedCampaign.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
            <ul className="space-y-2">
              {selectedCampaign.requirements.map((req: string, index: number) => (
                <li key={index} className="flex gap-3 text-gray-700">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Schedule</h3>
            <div className="space-y-3">
              {selectedCampaign.deliveryItems.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">Due {item.dueDate}</div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${
                    item.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                    item.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Apply Now
            </button>
            <button 
              onClick={() => handleUploadContent(selectedCampaign)}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Content
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUpload = () => {
    if (!selectedCampaign) return null;

    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentView('details')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Campaign</span>
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Content</h2>
          <p className="text-sm text-gray-600 mb-8">{selectedCampaign.name} - {selectedCampaign.brand}</p>

          <div className="flex justify-center items-center gap-4 mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              uploadStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {uploadStep > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-0.5 ${uploadStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              uploadStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {uploadStep > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <div className={`w-16 h-0.5 ${uploadStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              uploadStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>

          {uploadStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Content Type</h3>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedContentType(type.id)}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        selectedContentType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                      <div className="text-sm font-medium text-gray-900 text-center">{type.name}</div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setUploadStep(2)}
                disabled={!selectedContentType}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {uploadStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload Files</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                            <Image className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">{uploadedFile.name}</div>
                            <div className="text-xs text-gray-500">{uploadedFile.size} MB</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Choose files</div>
                        <div className="text-xs text-gray-500">No file chosen</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setUploadStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setUploadStep(3)}
                  disabled={!uploadedFile}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {uploadStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Details</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caption / Description</label>
                  <textarea
                    rows={4}
                    placeholder="Add your caption or description here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                  <input
                    type="text"
                    placeholder="#SummerVibes2024 #FashionBrandCo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Any additional information for the brand..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setUploadStep(2)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentView('success')}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuccess = () => {
    if (!selectedCampaign) return null;

    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Campaign</span>
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Submitted Successfully!</h2>
          <p className="text-gray-600 mb-8">Your content has been submitted for review and will be processed soon.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedCampaign.name}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                Product Review
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">{selectedCampaign.brand}</p>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-gray-900 font-medium mb-2">
                <Image className="w-4 h-4" />
                <span className="text-sm">Uploaded Files</span>
              </div>
              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Image className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{uploadedFile.name}</div>
                      <div className="text-xs text-gray-500">{uploadedFile.size} MB</div>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Uploaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('details')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Campaign
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <InfluencerSidebar 
        firstName="Alex"
        lastName="Chen"
        status="PENDING"
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                <p className="text-gray-600">Discover and apply to brand partnerships</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Create Alert
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-8">
            {[
              { label: 'Available', count: 24, color: 'text-blue-600' },
              { label: 'Applied', count: 3, color: 'text-orange-500' },
              { label: 'Completed', count: 0, color: 'text-green-600' },
              { label: 'Total Earned (UGX)', count: 0, color: 'text-purple-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.count}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns, brands, categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Category</span>
              <span>Budget</span>
              <span>Location</span>
            </div>
          </div>

          <div className="flex space-x-8 border-b border-gray-200">
            {['available', 'applied', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-4 px-1 text-sm font-medium capitalize ${
                  selectedTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {currentView === 'dashboard' && selectedTab === 'available' && renderDashboard()}
          {currentView === 'details' && renderDetails()}
          {currentView === 'upload' && renderUpload()}
          {currentView === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;