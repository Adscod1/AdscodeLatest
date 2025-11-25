"use client";
import React, { useState } from 'react';
import InfluencerSidebar from '@/components/ui/influencersidebar';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Award, 
  Settings, 
  DollarSign, 
  User,
  Home,
  BarChart3,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Camera,
  Play,
  Bell
} from 'lucide-react';

const AdScodAcademy = () => {
  const [activeTab, setActiveTab] = useState('My Courses');

  const courses = [
    {
      title: 'Content Creation Fundamentals',
      description: 'Learn the basics of creating engaging content for social media',
      duration: '3 hours',
      lessons: 12,
      level: 'Beginner',
      progress: 100,
      category: 'Content Creation',
      status: 'Completed'
    },
    {
      title: 'Brand Partnership Essentials',
      description: 'Understanding how to work effectively with brands',
      duration: '2.5 hours',
      lessons: 10,
      level: 'Beginner',
      progress: 100,
      category: 'Business',
      status: 'Completed'
    },
    {
      title: 'Social Media Strategy',
      description: 'Advanced strategies for growing your social media presence',
      duration: '4 hours',
      lessons: 16,
      level: 'Intermediate',
      progress: 35,
      category: 'Strategy',
      status: 'Continue'
    },
    {
      title: 'Photography & Visual Design',
      description: 'Create stunning visuals that capture attention',
      duration: '3.5 hours',
      lessons: 14,
      level: 'Intermediate',
      progress: 0,
      category: 'Creative',
      status: 'Start Course'
    }
  ];

  const achievements = [
    { title: 'First Course Completed', icon: CheckCircle, unlocked: true },
    { title: 'Content Creator', icon: Star, unlocked: true },
    { title: 'Brand Partner', icon: Award, unlocked: false },
    { title: 'Advanced Creator', icon: BookOpen, unlocked: false }
  ];

  const stats = [
    { icon: BookOpen, value: '2/8', label: 'Courses Completed' },
    { icon: Award, value: '1', label: 'Certifications' },
    { icon: Clock, value: '12h', label: 'Hours Learned' },
    { icon: Star, value: 'Beginner', label: 'Current Level' }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Content Creation': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Strategy': 'bg-purple-100 text-purple-800',
      'Creative': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusButton = (status: string, progress: number) => {
    if (status === 'Completed') {
      return <span className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded">✓ Completed</span>;
    }
    if (status === 'Continue') {
      return <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">Continue</button>;
    }
    return <button className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded hover:bg-gray-900">Start Course</button>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Using our reusable InfluencerSidebar component */}
      <InfluencerSidebar 
        firstName="Alex"
        lastName="Chen"
        status="PENDING"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>›</span>
            <span>Academy</span>
          </div>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Adscod Academy</h1>
            <p className="text-gray-600">Master the skills of professional influencer marketing</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-blue-100 text-blue-600' :
                    index === 1 ? 'bg-green-100 text-green-600' :
                    index === 2 ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 max-w-md">
            {['My Courses', 'Achievements', 'Course Library'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'My Courses' && (
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(course.category)}`}>
                          {course.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {course.duration}</span>
                        </span>
                        <span>Lessons: {course.lessons}</span>
                        <span>Level: {course.level}</span>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      {getStatusButton(course.status, course.progress)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Achievements' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Achievements</h2>
              <div className="grid grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-6 rounded-xl text-center transition-all ${
                    achievement.unlocked 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                  }`}>
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Course Library' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">More Courses Coming Soon</h2>
              <p className="text-gray-600 mb-6">We're constantly adding new courses to help you grow</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get Notified
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdScodAcademy;