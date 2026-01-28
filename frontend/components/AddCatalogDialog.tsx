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
      <div className="bg-white rounded w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded p-2"
        >
          <X size={16} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            What would you like to add?
          </h1>
          <p className="text-gray-500 text-md">
            Choose whether you're adding a product or service to your catalog
          </p>
        </div>

        {/* Options Flex */}
        <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto">
          {/* Product Card */}
          <button 
            onClick={handleProductClick}
            className="flex-1 bg-white rounded p-8 border border-gray-100 hover:shadow-lg hover:border-gray-100 transition-all text-center group"
          >
            <div className="bg-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors mx-auto">
              <Package size={32} className="text-gray-700" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-3">Product</h2>
            
            <p className="text-gray-500 mb-6 leading-relaxed">
              Physical or digital items that you <br/> sell with inventory tracking
            </p>
            
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">•</span>
                <span>Inventory management</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">•</span>
                <span>Shipping and delivery options</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">•</span>
                <span>Product variants and SKUs</span>
              </li>
            </ul>
          </button>

          {/* Service Card */}
          <button 
            onClick={handleServiceClick}
            className="flex-1 bg-white rounded p-8 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all text-center group"
          >
            <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors mx-auto">
              <Briefcase size={32} className="text-blue-500" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-3">Service</h2>
            
            <p className="text-gray-500 mb-6 leading-relaxed">
              Professional services or bookings <br/> that you offer to customers
            </p>
            
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">•</span>
                <span>Booking and scheduling</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">•</span>
                <span>Duration and pricing</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-400">•</span>
                <span>Staff assignment</span>
              </li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  );
}