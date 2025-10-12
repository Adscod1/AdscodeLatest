"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { getCurrentProfile } from '@/actions/profile';
import { Profile } from '@prisma/client';
import { auth } from '@/utils/auth';
import { useIsMobile } from '@/hooks/use-mobile';

import { useQueryClient } from '@tanstack/react-query';
import { 
  Home, 
  Edit3, 
  TrendingUp, 
  Users, 
  User, 
  Bell, 
  Settings, 
  HelpCircle,
  MessageCircle,
  PlayCircle,
  MessageSquare,
  BookOpen,
  UserCheck,
  Share2,
  Mail
} from 'lucide-react';

const HelpCenter = ({ user }: { user: Profile }) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: getCurrentProfile,
    initialData: user,
  });

  const avatarUrl =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || "User"
    )}&background=DC143C&color=fff&size=150`;
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: false },
    { icon: Edit3, label: 'Write Reviews', active: false },
    { icon: TrendingUp, label: 'My Progress', active: false },
    { icon: Users, label: 'Community', active: false },
    { icon: User, label: 'Profile', active: false },
  ];

  const featureItems = [
    { icon: Bell, label: 'Notifications', subtitle: 'Get notified', detail: 'Available for Verified' },
    { icon: MessageCircle, label: 'Messaging', subtitle: 'Message brands', detail: 'Available for Verified' },
    { icon: Share2, label: 'Social Sharing', subtitle: 'Share to socials', detail: 'Available for Verified' },
  ];

  const helpTopics = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      articles: '12 articles',
      description: 'Learn the basics of becoming an Influencer on Adzcord'
    },
    {
      icon: Edit3,
      title: 'Writing Reviews',
      articles: '8 articles',
      description: 'Tips for creating engaging and helpful product reviews'
    },
    {
      icon: UserCheck,
      title: 'Building Your Profile',
      articles: '6 articles',
      description: 'How to optimize your profile for maximum impact'
    },
    {
      icon: Share2,
      title: 'Social Media Integration',
      articles: '10 articles',
      description: 'Connect and grow your social media presence'
    }
  ];

  const faqs = [
    {
      question: 'How do I become an Aspiring Influencer?',
      answer: 'Complete the required tasks including writing 10+ reviews, gaining followers, and connecting social media accounts.'
    },
    {
      question: "What's the difference between user levels?",
      answer: 'New Users start with basic features, Aspiring Influencers get messaging, and Verified Influencers access brand campaigns.'
    },
    {
      question: 'How long does verification take?',
      answer: 'Once you complete all requirements, verification typically takes 2-3 business days.'
    },
    {
      question: 'Can I connect multiple social media accounts?',
      answer: 'Yes! You can connect Instagram, TikTok, YouTube, and other platforms to showcase your reach.'
    }
  ];

  return (
    <DashboardLayout profile={profile}>
      <div>
        {/* Header */}
        <div className={`bg-white border-b border-gray-200 ${isMobile ? 'px-4 py-4 -mx-4 sm:-mx-8 -mt-4 sm:-mt-8 mb-4' : 'px-8 py-6 -mx-8 -mt-8 mb-8'}`}>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">Find answers and get support for your influencer journey</p>
        </div>

        {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-4">Get help from our support team</p>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">Watch step-by-step guides</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                Watch Now
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Forums</h3>
              <p className="text-sm text-gray-600 mb-4">Ask questions and share tips</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Join Discussion
              </button>
            </div>
          </div>

          {/* Browse Help Topics */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Help Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpTopics.map((topic, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <topic.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{topic.articles}</p>
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className={`p-6 ${index !== faqs.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
                <p className="text-gray-600 mb-4">Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.</p>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Contact Support Team
                </button>
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default HelpCenter;