import React from 'react';
import Link from 'next/link';
import { Star, Users, TrendingUp, Zap, Play } from 'lucide-react';
import { FeedNavbar } from '../../(main)/components/navbar';
import { Footer } from '../../(main)/components/footer';

interface StatCardProps {
  value: string;
  label: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TestimonialProps {
  rating: number;
  text: string;
  name: string;
  role: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard: React.FC<TestimonialProps> = ({ rating, text, name, role }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-700 mb-4 leading-relaxed">"{text}"</p>
    <div>
      <div className="font-semibold text-gray-900">{name}</div>
      <div className="text-sm text-gray-500">{role}</div>
    </div>
  </div>
);



const HeroSection: React.FC = () => (
  <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 min-h-[80vh] flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-white">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Turn Your <br />
            <span className="text-blue-200">Influence</span> <br />
            Into Income
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of creators earning with brand partnerships. Connect, create, and get paid for authentic content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/influencer/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
              Become an Influencer →
            </Link>
            <Link href="/influencer/demo" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-500 to-blue-400 rounded-2xl p-8">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 inline-block">
              <div className="text-2xl font-bold text-blue-600">$2M+</div>
              <div className="text-sm text-gray-600">Creator Earnings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StatsSection: React.FC = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard value="50K+" label="Active Creators" />
        <StatCard value="1000+" label="Brand Partners" />
        <StatCard value="$2M+" label="Creator Earnings" />
        <StatCard value="95%" label="Satisfaction Rate" />
      </div>
    </div>
  </section>
);

const WhyChooseSection: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Why Choose <span className="text-blue-600">Adscod</span>?
        </h2>
        <p className="text-xl text-gray-600">Everything you need to build a successful creator business</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Brand Partnerships"
          description="Connect with premium brands seeking authentic voices"
        />
        <FeatureCard 
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Growth Analytics"
          description="Track your performance and optimize your content strategy"
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-blue-600" />}
          title="Instant Payouts"
          description="Get paid quickly with our secure payment system"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Brand Partnerships"
          description="Connect with premium brands seeking authentic voices"
        />
        <FeatureCard 
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Growth Analytics"
          description="Track your performance and optimize your content strategy"
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-blue-600" />}
          title="Instant Payouts"
          description="Get paid quickly with our secure payment system"
        />
      </div>
    </div>
  </section>
);

const TestimonialsSection: React.FC = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Creators Say</h2>
        <p className="text-xl text-gray-600">Join thousands of happy creators</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <TestimonialCard 
          rating={5}
          text="Adscod helped me turn my passion into a sustainable income. The brand matches are perfect!"
          name="Sarah Johnson"
          role="Fashion Influencer"
        />
        <TestimonialCard 
          rating={5}
          text="As a software reviewer, I love how Adscod connects me with relevant tech brands."
          name="Mike Chen"
          role="Tech Reviewer"
        />
        <TestimonialCard 
          rating={5}
          text="The platform is incredibly user-friendly and the payment system is reliable."
          name="Emma Davis"
          role="Lifestyle Creator"
        />
      </div>
    </div>
  </section>
);



const AdsccodLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <FeedNavbar />
      <HeroSection />
      <StatsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default AdsccodLandingPage;