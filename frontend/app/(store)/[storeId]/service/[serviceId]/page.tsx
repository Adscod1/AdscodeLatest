'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api-client';
import { 
  ArrowLeft, 
  Share, 
  Edit, 
  Trash2,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  status?: string | null;
  category?: string | null;
  serviceProvider?: string | null;
  location?: string | null;
  duration?: string | null;
  serviceType?: string | null;
  experience?: number | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{ 
    id: string;
    url: string;
  }>;
  videos?: Array<{
    id: string;
    url: string;
  }>;
}

const ServiceDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { storeId, serviceId } = params;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real service data from database
  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!serviceId) return;
        
        const response = await api.services.getById(serviceId as string);
        
        if (response.service) {
          setService(response.service as unknown as Service);
        } else {
          console.error('Service not found');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading service details...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{service.title}</h1>
            <p className="text-gray-600 text-sm">Service ID: {service.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/${storeId}/service/new?edit=${serviceId}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-green-600">+0% vs last month</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">UGX 0</p>
              <p className="text-sm text-green-600">+0% vs last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold">0.0</p>
              <p className="text-sm text-gray-500">0 reviews</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className="mt-2">{service.status || 'DRAFT'}</Badge>
            </div>
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Service Images */}
          {service.images && service.images.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Service Images</h2>
              <div className="grid grid-cols-3 gap-4">
                {service.images.map((image, index) => (
                  <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`${service.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {service.description || 'No description provided'}
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold">UGX {service.price?.toLocaleString()}</span>
              </div>
              {service.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{service.duration}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Service Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Service Information</h2>
            <div className="space-y-3">
              {service.category && (
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{service.category}</p>
                </div>
              )}
              {service.serviceType && (
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium">{service.serviceType}</p>
                </div>
              )}
              {service.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{service.location}</p>
                </div>
              )}
              {service.experience !== null && (
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium">{service.experience} years</p>
                </div>
              )}
              {service.serviceProvider && (
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-medium">{service.serviceProvider}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
