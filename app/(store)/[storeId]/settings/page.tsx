"use client";
import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Plug, 
  CreditCard,
  Eye,
  EyeOff,
  Check,
  X,
  Download,
  Trash2,
  ChevronDown
} from 'lucide-react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
    </label>
  );
};

type SettingsTab = 'account' | 'security' | 'notifications' | 'appearance' | 'integrations' | 'billing';

interface Integration {
  name: string;
  status: 'connected' | 'disconnected';
  lastSync: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Account Information
  const [fullName, setFullName] = useState('Igni Administrator');
  const [email, setEmail] = useState('igni@adscod.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [company, setCompany] = useState('Adscod Inc.');
  const [timezone, setTimezone] = useState('Eastern Time (UTC-5)');
  const [language, setLanguage] = useState('English');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [passwordExpiration, setPasswordExpiration] = useState(false);
  const [deviceTracking, setDeviceTracking] = useState(true);

  // Privacy Options
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [activityVisibility, setActivityVisibility] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('blue');
  const [sidebarPosition, setSidebarPosition] = useState('Left');

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    { name: 'Google Analytics', status: 'connected', lastSync: 'Last sync: 2 hours ago' },
    { name: 'Facebook Ads', status: 'connected', lastSync: 'Last sync: 1 day ago' },
    { name: 'Shopify', status: 'disconnected', lastSync: 'Last sync: Never' },
    { name: 'Mailchimp', status: 'connected', lastSync: 'Last sync: 3 hours ago' },
    { name: 'Stripe', status: 'connected', lastSync: 'Last sync: 5 minutes ago' },
    { name: 'Slack', status: 'disconnected', lastSync: 'Last sync: Never' },
  ]);

  const themeColors = [
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'pink', color: 'bg-pink-500' },
    { name: 'orange', color: 'bg-orange-500' },
  ];

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Data</span>
                <span className="sm:hidden">Export</span>
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-2 min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Account Information */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option>Eastern Time (UTC-5)</option>
                      <option>Pacific Time (UTC-8)</option>
                      <option>Central Time (UTC-6)</option>
                      <option>Mountain Time (UTC-7)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security & Privacy */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Security */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Security & Privacy</h2>
                    <p className="text-sm text-gray-500">Manage your security preferences</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Security Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Two-factor authentication</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security</p>
                        </div>
                        <ToggleSwitch checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Login notifications</p>
                          <p className="text-xs text-gray-500">Get notified of new sign-ins</p>
                        </div>
                        <ToggleSwitch checked={loginNotifications} onChange={() => setLoginNotifications(!loginNotifications)} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Password expiration</p>
                          <p className="text-xs text-gray-500">Require password changes every 90 days</p>
                        </div>
                        <ToggleSwitch checked={passwordExpiration} onChange={() => setPasswordExpiration(!passwordExpiration)} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Device tracking</p>
                          <p className="text-xs text-gray-500">Track and manage signed-in devices</p>
                        </div>
                        <ToggleSwitch checked={deviceTracking} onChange={() => setDeviceTracking(!deviceTracking)} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Privacy Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Analytics tracking</p>
                          <p className="text-xs text-gray-500">Allow usage analytics collection</p>
                        </div>
                        <ToggleSwitch checked={analyticsTracking} onChange={() => setAnalyticsTracking(!analyticsTracking)} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Marketing emails</p>
                          <p className="text-xs text-gray-500">Receive marketing and promotional emails</p>
                        </div>
                        <ToggleSwitch checked={marketingEmails} onChange={() => setMarketingEmails(!marketingEmails)} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Data sharing</p>
                          <p className="text-xs text-gray-500">Share anonymized data for product improvement</p>
                        </div>
                        <ToggleSwitch checked={dataSharing} onChange={() => setDataSharing(!dataSharing)} />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Activity visibility</p>
                          <p className="text-xs text-gray-500">Show your activity to team members</p>
                        </div>
                        <ToggleSwitch checked={activityVisibility} onChange={() => setActivityVisibility(!activityVisibility)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500">Configure your notification preferences</p>
                </div>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p>Notification settings available in the Notifications page</p>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500">Customize your interface</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                    <p className="text-xs text-gray-500">Use dark theme across the application</p>
                  </div>
                  <ToggleSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme Color</label>
                  <div className="flex items-center gap-3">
                    {themeColors.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setThemeColor(theme.name)}
                        className={`w-10 h-10 rounded-full ${theme.color} relative transition-transform hover:scale-110 ${
                          themeColor === theme.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                      >
                        {themeColor === theme.name && (
                          <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Position</label>
                  <select
                    value={sidebarPosition}
                    onChange={(e) => setSidebarPosition(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option>Left</option>
                    <option>Right</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Plug className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                  <p className="text-sm text-gray-500">Manage your connected services</p>
                </div>
              </div>

              <div className="space-y-3">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                        <p className="text-xs text-gray-500">{integration.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full hidden sm:inline">
                            Connected
                          </span>
                          <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Configure
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hidden sm:inline">
                            Disconnected
                          </span>
                          <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            Connect
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing & Usage */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Billing & Usage</h2>
                    <p className="text-sm text-gray-500">Manage your subscription and usage</p>
                  </div>
                </div>

                <div className=" rounded-lg p-4 sm:p-6 text-white mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold">Pro Plan</h3>
                      <p className="text-sm text-gray-900 mt-1">$49.99/month • Renews on Feb 1, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-900">API Calls Used</span>
                        <span className="font-medium text-gray-900">8,500 / 10,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black rounded-full h-2" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-900">Storage Used</span>
                        <span className="font-medium text-gray-900">45 GB / 100 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black rounded-full h-2" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                  <div className="space-y-2">
                    {[
                      { plan: 'Pro Plan - Monthly', date: '2024-01-01', amount: '$49.99', status: 'Paid' },
                      { plan: 'Pro Plan - Monthly', date: '2023-12-01', amount: '$49.99', status: 'Paid' },
                      { plan: 'Pro Plan - Monthly', date: '2023-11-01', amount: '$49.99', status: 'Paid' },
                      { plan: 'Starter Plan - Monthly', date: '2023-10-01', amount: '$19.99', status: 'Paid' },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{invoice.plan}</p>
                          <p className="text-xs text-gray-500">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-2">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
                            <p className="text-xs text-gray-500">{invoice.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-lg border border-red-200 p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                    <p className="text-sm text-red-600">Irreversible and destructive actions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-red-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delete Account</p>
                      <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-red-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Export Data</p>
                      <p className="text-xs text-gray-500">Download all of your data before deletion</p>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
