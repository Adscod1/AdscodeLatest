import React from 'react';
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
    verified?: boolean;
  };
  rating: number;
  text: string;
  date: string;
  status?: 'responded' | 'needs-response';
}

const ReviewsDashboard: React.FC = () => {
  const reviews: Review[] = [
    {
      id: '1',
      user: { name: 'Sarah Johnson', avatar: 'SJ', badge: 'Premium Running Shoes', verified: true },
      rating: 5,
      text: '',
      date: '2 hours ago'
    },
    {
      id: '2',
      user: { name: 'Sarah Johnson', avatar: 'SJ', badge: 'Premium Running Shoes', verified: true },
      rating: 5,
      text: 'Absolutely love these shoes! Perfect fit and great quality.',
      date: '1 day ago',
      status: 'needs-response'
    },
    {
      id: '3',
      user: { name: 'Mike Chen', avatar: 'MC', badge: 'Wireless Headphones', verified: true },
      rating: 4,
      text: 'Good sound quality but could be more comfortable for long use.',
      date: '2 days ago',
      status: 'responded'
    },
    {
      id: '4',
      user: { name: 'Emma Davis', avatar: 'ED', badge: 'Yoga Mat Pro', verified: true },
      rating: 5,
      text: 'Best yoga mat I\'ve ever owned. Great grip and cushioning.',
      date: '1 day ago',
      status: 'responded'
    },
    {
      id: '5',
      user: { name: 'Alex Thompson', avatar: 'AT', badge: 'Smart Sports Watch', verified: false },
      rating: 2,
      text: 'The app connectivity is unreliable. Often loses connection.',
      date: '4 days ago',
      status: 'needs-response'
    },
    {
      id: '6',
      user: { name: 'Lisa Wang', avatar: 'LW', badge: 'Organic Coffee Beans', verified: true },
      rating: 4,
      text: 'Rich flavor but a bit pricey. Worth it for special occasions.',
      date: '3 days ago',
      status: 'responded'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage customer feedback</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-red-500 text-medium bg-white border border-red-500 rounded hover:bg-red-500 hover:text-white text-sm w-full sm:w-auto">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">View Alerts</span>
            <span className="sm:hidden">Alerts</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-full sm:w-auto">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Reply Reviews</span>
            <span className="sm:hidden">Reply</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm text-gray-500">Total Reviews</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">2,847</div>
          <div className="text-xs sm:text-sm text-green-600">↗ +16.2% this month</div>
        </div>

        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-xs sm:text-sm text-gray-500">Average Rating</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">4.6</div>
          <div className="text-xs sm:text-sm text-green-600">↗ +0.3 vs last month</div>
        </div>

        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm text-gray-500">Response Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">94%</div>
          <div className="text-xs sm:text-sm text-green-600">↗ +5% this month</div>
        </div>

        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <span className="text-xs sm:text-sm text-gray-500">Pending Reviews</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">23</div>
          <div className="text-xs sm:text-sm text-red-500">↘ -12 to reply</div>
        </div>
      </div>

      {/* Top Row - Rating Breakdown and Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Rating Breakdown */}
        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Rating Breakdown</h3>
          <div className="space-y-4">
            {[
              { stars: 5, count: 1620, percentage: 57, color: 'bg-yellow-400' },
              { stars: 4, count: 834, percentage: 29, color: 'bg-yellow-400' },
              { stars: 3, count: 258, percentage: 9, color: 'bg-yellow-400' },
              { stars: 2, count: 85, percentage: 3, color: 'bg-yellow-400' },
              { stars: 1, count: 32, percentage: 1, color: 'bg-yellow-400' }
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-6">
                  <span className="text-sm font-medium text-gray-700">{item.stars}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {item.count}
                </span>
                <span className="text-sm text-gray-500 w-10 text-right">
                  ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Sentiment Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Positive</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">2365</div>
                <div className="text-sm text-gray-500">83%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Neutral</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">341</div>
                <div className="text-sm text-gray-500">12%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">Negative</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">141</div>
                <div className="text-sm text-gray-500">5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Recent Reviews */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Reviews</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {reviews.slice(0, 1).map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                      {review.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.user.name}</span>
                        {review.user.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{review.user.badge}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {reviews.slice(1).map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                    {review.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.user.name}</span>
                        {review.user.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{review.user.badge}</div>
                    {review.text && (
                      <p className="text-gray-700 mb-3">{review.text}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {review.status === 'needs-response' ? (
                        <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-full border border-red-200">
                          Needs Reply
                        </span>
                      ) : review.status === 'responded' ? (
                        <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                          Replied
                        </span>
                      ) : (
                        <div></div>
                      )}
                      {review.status === 'needs-response' && (
                        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Keywords & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-10 mt-6 sm:mt-8">
        {/* Frequently Mentioned Keywords */}
        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <h3 className="text-base sm:text-sm font-base text-gray-700 mb-4 sm:mb-6">Frequently Mentioned Keywords</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { keyword: 'Quality', count: 456, icon: '👍' },
              { keyword: 'Space', count: 398, icon: '😌' },
              { keyword: 'Value', count: 267, icon: '💰' },
              { keyword: 'Delivery', count: 245, icon: '📦' },
              { keyword: 'Price', count: 189, icon: '💲' },
              { keyword: 'Size', count: 167, icon: '📏' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-full border border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-gray-700 p-x-2 font-base">{item.keyword}</span>
                </div>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-500 text-sm">Track your store's <br/>performance and insights</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <select className="text-sm border border-gray-200 rounded px-3 py-2 bg-white w-full sm:w-auto">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
                <option>Last 365 days</option>
              </select>
              <button className="flex items-center justify-center gap-2 text-sm text-white hover:text-white bg-blue-600 px-3 py-2 rounded w-full sm:w-auto">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          
          {/* Simple Chart Placeholder */}
          <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 rounded flex items-center justify-center border border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-3xl mb-2">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-gray-600 font-medium">Analytics Chart</p>
              <p className="text-gray-500 text-sm">Performance insights will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsDashboard;