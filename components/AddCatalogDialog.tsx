"use client";
import { X, Package, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddCatalogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

export default function AddCatalogDialog({ isOpen, onClose, storeId }: AddCatalogDialogProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleProductClick = () => {
    router.push(`/${storeId}/product/new?type=product`);
    onClose();
  };

  const handleServiceClick = () => {
    router.push(`/${storeId}/service/new?type=service`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">Cancel</span>
        </button>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            What would you like to add?
          </h1>
          <p className="text-gray-500 text-lg">
            Choose whether you're adding a product or a service to your catalog
          </p>
        </div>

        {/* Options Flex */}
        <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto">
          {/* Product Card */}
          <button 
            onClick={handleProductClick}
            className="flex-1 bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all text-center group"
          >
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors mx-auto">
              <Package size={32} className="text-gray-700" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Product</h2>
            
            <p className="text-gray-500 mb-6 leading-relaxed">
              Physical or digital items that you sell with inventory tracking
            </p>
            
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-gray-400 mt-1">•</span>
                <span>Inventory management</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-gray-400 mt-1">•</span>
                <span>Shipping & delivery options</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-gray-400 mt-1">•</span>
                <span>Product variants & SKUs</span>
              </li>
            </ul>
          </button>

          {/* Service Card */}
          <button 
            onClick={handleServiceClick}
            className="flex-1 bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all text-center group"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors mx-auto">
              <Briefcase size={32} className="text-blue-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Service</h2>
            
            <p className="text-gray-500 mb-6 leading-relaxed">
              Professional services or bookings that you offer to customers
            </p>
            
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-gray-400 mt-1">•</span>
                <span>Booking & scheduling</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-gray-400 mt-1">•</span>
                <span>Duration & pricing</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-gray-400 mt-1">•</span>
                <span>Staff assignment</span>
              </li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  );
}