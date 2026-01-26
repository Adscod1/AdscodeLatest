"use client";
import React, { useState } from 'react';
import { Bell, BellRing, CheckCheck, Settings, ShoppingCart, Star, TrendingUp, AlertCircle, Users, Mail, Package, X, Check } from 'lucide-react';

interface Notification {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  badge?: string;
  badgeColor?: string;
  isRead: boolean;
  showActions: boolean;
}

interface NotificationPreferences {
  newOrders: boolean;
  paymentConfirmations: boolean;
  refundRequests: boolean;
  salesMilestones: boolean;
  campaignLaunches: boolean;
  performanceAlerts: boolean;
  budgetWarnings: boolean;
  conversionGoals: boolean;
  lowStockAlerts: boolean;
  outOfStockWarnings: boolean;
  productReviews: boolean;
  priceChanges: boolean;
  newCustomerRegistrations: boolean;
  supportTickets: boolean;
  customerFeedback: boolean;
  accountUpdates: boolean;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      icon: ShoppingCart,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'New order received',
      description: 'Order #1234 from John Doe for $127.00',
      time: '2 minutes ago',
      badge: 'E-commerce',
      badgeColor: 'bg-red-500',
      isRead: false,
      showActions: true
    },
    {
      id: 2,
      icon: Star,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Product review submitted',
      description: 'Sarah Smith left a 5-star review for Nike Air Max 270',
      time: '15 minutes ago',
      isRead: false,
      showActions: true
    },
    {
      id: 3,
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Campaign performance update',
      description: 'Summer Sale campaign has exceeded conversion targets by 25%',
      time: '1 hour ago',
      badge: 'Important',
      badgeColor: 'bg-red-500',
      isRead: false,
      showActions: false
    },
    {
      id: 4,
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'Low stock alert',
      description: 'Adidas Ultraboost 21 has only 5 units remaining',
      time: '2 hours ago',
      badge: 'Important',
      badgeColor: 'bg-red-500',
      isRead: false,
      showActions: true
    },
    {
      id: 5,
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'New customer registration',
      description: 'Mike Johnson signed up from New York',
      time: '3 hours ago',
      isRead: false,
      showActions: false
    },
    {
      id: 6,
      icon: Mail,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      title: 'Weekly analytics report',
      description: 'Your weekly performance report is ready to view',
      time: '1 day ago',
      isRead: false,
      showActions: false
    }
  ]);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newOrders: true,
    paymentConfirmations: true,
    refundRequests: true,
    salesMilestones: false,
    campaignLaunches: true,
    performanceAlerts: true,
    budgetWarnings: true,
    conversionGoals: false,
    lowStockAlerts: true,
    outOfStockWarnings: true,
    productReviews: true,
    priceChanges: false,
    newCustomerRegistrations: false,
    supportTickets: true,
    customerFeedback: true,
    accountUpdates: false
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">Manage your notifications and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="font-bold text-gray-700">{unreadCount} Unread</span>
              </div>
              <button className="px-4 py-2 border border-blue-500 rounded text-sm font-medium text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">All Notifications</div>
                <div className="text-lg font-bold text-gray-900">{notifications.length} Total</div>
              </div>
              <button className="ml-auto text-sm text-blue-600 font-medium hover:underline">
                View
              </button>
            </div>
            <div className="bg-white border border-gray-100 rounded p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <BellRing className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Important</div>
                <div className="text-lg font-bold text-gray-900">{notifications.filter(n => n.badge === 'Important').length} Unread</div>
              </div>
              <button className="ml-auto text-sm text-blue-600 font-medium hover:underline">
                View
              </button>
            </div>
            <div className="bg-white border border-gray-100 rounded p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Read</div>
                <div className="text-lg font-bold text-gray-900">{notifications.filter(n => n.isRead).length} Notifications</div>
              </div>
              <button className="ml-auto text-sm text-blue-600 font-medium hover:underline">
                View
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <div className="lg:col-span-2 bg-white rounded border border-gray-100">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Recent Notifications</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 ${notification.isRead ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${notification.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`w-5 h-5 ${notification.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {notification.badge && (
                            <span className={`${notification.badgeColor} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                              {notification.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.description}
                      </p>
                      {notification.showActions && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Mark as read
                          </button>
                          <button 
                            onClick={() => dismissNotification(notification.id)}
                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Dismiss
                          </button>
                        </div>
                      )}
                      {!notification.showActions && (
                        <button 
                          onClick={() => dismissNotification(notification.id)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded border border-gray-100">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            <div className="p-4 space-y-6 max-h-[800px] overflow-y-auto">
              {/* Orders & Sales */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Orders and Sales</h3>
                <p className="text-xs text-gray-500 mb-3">Get notified about new orders, payments, and sales updates</p>
                <div className="space-y-3">
                  <ToggleSwitch
                    checked={preferences.newOrders}
                    onChange={() => togglePreference('newOrders')}
                    label="New orders"
                  />
                  <ToggleSwitch
                    checked={preferences.paymentConfirmations}
                    onChange={() => togglePreference('paymentConfirmations')}
                    label="Payment confirmations"
                  />
                  <ToggleSwitch
                    checked={preferences.refundRequests}
                    onChange={() => togglePreference('refundRequests')}
                    label="Refund requests"
                  />
                  <ToggleSwitch
                    checked={preferences.salesMilestones}
                    onChange={() => togglePreference('salesMilestones')}
                    label="Sales milestones"
                  />
                </div>
              </div>

              {/* Marketing & Campaigns */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Marketing and Campaigns</h3>
                <p className="text-xs text-gray-500 mb-3">Stay updated on your marketing campaigns and performance</p>
                <div className="space-y-3">
                  <ToggleSwitch
                    checked={preferences.campaignLaunches}
                    onChange={() => togglePreference('campaignLaunches')}
                    label="Campaign launches"
                  />
                  <ToggleSwitch
                    checked={preferences.performanceAlerts}
                    onChange={() => togglePreference('performanceAlerts')}
                    label="Performance alerts"
                  />
                  <ToggleSwitch
                    checked={preferences.budgetWarnings}
                    onChange={() => togglePreference('budgetWarnings')}
                    label="Budget warnings"
                  />
                  <ToggleSwitch
                    checked={preferences.conversionGoals}
                    onChange={() => togglePreference('conversionGoals')}
                    label="Conversion goals"
                  />
                </div>
              </div>

              {/* Inventory & Products */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Inventory and Products</h3>
                <p className="text-xs text-gray-500 mb-3">Receive alerts on stock levels and product updates</p>
                <div className="space-y-3">
                  <ToggleSwitch
                    checked={preferences.lowStockAlerts}
                    onChange={() => togglePreference('lowStockAlerts')}
                    label="Low stock alerts"
                  />
                  <ToggleSwitch
                    checked={preferences.outOfStockWarnings}
                    onChange={() => togglePreference('outOfStockWarnings')}
                    label="Out of stock warnings"
                  />
                  <ToggleSwitch
                    checked={preferences.productReviews}
                    onChange={() => togglePreference('productReviews')}
                    label="Product reviews"
                  />
                  <ToggleSwitch
                    checked={preferences.priceChanges}
                    onChange={() => togglePreference('priceChanges')}
                    label="Price changes"
                  />
                </div>
              </div>

              {/* Customers & Support */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Customers and Support</h3>
                <p className="text-xs text-gray-500 mb-3">Keep track of customer activity and support requests</p>
                <div className="space-y-3">
                  <ToggleSwitch
                    checked={preferences.newCustomerRegistrations}
                    onChange={() => togglePreference('newCustomerRegistrations')}
                    label="New customer registrations"
                  />
                  <ToggleSwitch
                    checked={preferences.supportTickets}
                    onChange={() => togglePreference('supportTickets')}
                    label="Support tickets"
                  />
                  <ToggleSwitch
                    checked={preferences.customerFeedback}
                    onChange={() => togglePreference('customerFeedback')}
                    label="Customer feedback"
                  />
                  <ToggleSwitch
                    checked={preferences.accountUpdates}
                    onChange={() => togglePreference('accountUpdates')}
                    label="Account updates"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}