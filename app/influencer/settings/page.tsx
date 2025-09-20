"use client";
import React, { useState } from 'react';
import { Home, ChevronRight, Camera, Upload, X, Users, BarChart3, GraduationCap, MessageCircle, Trophy, DollarSign, Settings, User, Bell, Shield, CreditCard } from 'lucide-react';
import InfluencerSidebar from '@/components/ui/influencersidebar';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    phoneNumber: '+256 700 123 456',
    location: 'Kampala, Uganda',
    bio: 'Aspiring tech influencer passionate about reviewing the latest gadgets and sharing honest insights with my growing community.'
  });

  const tabs = [
    { id: 'Profile', name: 'Profile', icon: User },
    { id: 'Social Media', name: 'Social Media', icon: Users },
    { id: 'Notifications', name: 'Notifications', icon: Bell },
    { id: 'Privacy', name: 'Privacy', icon: Shield },
    { id: 'Account', name: 'Account', icon: CreditCard }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Using InfluencerSidebar with hardcoded values */}
      <InfluencerSidebar 
        firstName="Alex"
        lastName="Chen"
        status="Aspiring Influencer"
        className="fixed left-0 top-0"
      />

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Home className="w-4 h-4 mr-1" />
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900">Settings</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and profile settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'Profile' && (
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            </div>

            {/* Profile Picture */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AC</span>
                </div>
                <div className="space-x-3">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </button>
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 hover:text-red-900">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Account Status */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Account Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Current Tier</div>
                  <div className="font-medium text-gray-900">Aspiring Influencer</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Member Since</div>
                  <div className="font-medium text-gray-900">December 2024</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Profile Completion</div>
                  <div className="font-medium text-gray-900">85%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Verification Status</div>
                  <div className="font-medium text-orange-600">Pending</div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Placeholder content for other tabs */}
        {activeTab !== 'Profile' && (
          <div className="bg-white rounded-lg p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || User, { className: "w-12 h-12 mx-auto" })}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab} Settings</h3>
              <p className="text-gray-600">This section is coming soon. Configure your {activeTab.toLowerCase()} preferences here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;