'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/actions/product';
import { 
  ArrowLeft, 
  Share, 
  Edit, 
  Trash2, 
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  Eye,
  Users,
  BarChart3,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Product {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  status?: string | null;
  category?: string | null;
  vendor?: string | null;
  tags?: string | null;
  comparePrice?: number | null;
  costPerItem?: number | null;
  weight?: number | null;
  weightUnit?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  sizeUnit?: string | null;
  countryOfOrigin?: string | null;
  harmonizedSystemCode?: string | null;
  views?: number | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{ 
    id: string;
    url: string;
  }>;
  variations: Array<{
    id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
  videos?: Array<{
    id: string;
    url: string;
  }>;
}

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { storeId, productId } = params;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real product data from database
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        
        const productData = await getProductById(productId as string);
        
        if (productData) {
          setProduct(productData as Product);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getTotalStock = (variations: any[]) => {
    return variations?.reduce((total, variation) => total + (variation.stock || 0), 0) || 0;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6  mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p className="text-gray-600 text-sm">Product ID: {product.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
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
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">UGX 71,000,000</p>
              <p className="text-sm text-green-600">+12.5% vs last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">142</p>
              <p className="text-sm text-green-600">+8.2% vs last month</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">4.1%</p>
              <p className="text-sm text-red-600">-2.1% vs last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold">4.7/5</p>
              <p className="text-sm text-gray-600">85 reviews</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Product Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Product Information</h2>
              <Badge className="bg-green-100 text-green-600">ACTIVE</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                <Package className="w-8 h-8 text-purple-600 mb-2" />
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                <Package className="w-8 h-8 text-purple-600 mb-2" />
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                <Package className="w-8 h-8 text-purple-600 mb-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium">{product.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Vendor</p>
                <p className="font-medium">{product.vendor || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tags</p>
                <p className="font-medium">{product.tags || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-medium">{product.status || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-800">{product.description || 'No description available'}</p>
            </div>
          </Card>

          {/* Technical Specifications */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Technical Specifications</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Weight</p>
                <p className="font-medium">{product.weight ? `${product.weight} ${product.weightUnit || 'g'}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Dimensions</p>
                <p className="font-medium">
                  {product.length && product.width && product.height 
                    ? `${product.length} x ${product.width} x ${product.height} ${product.sizeUnit || 'cm'}`
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Country of Origin</p>
                <p className="font-medium">{product.countryOfOrigin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">HS Code</p>
                <p className="font-medium">{product.harmonizedSystemCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Cost Per Item</p>
                <p className="font-medium">{product.costPerItem ? `UGX ${product.costPerItem.toLocaleString()}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Compare Price</p>
                <p className="font-medium">{product.comparePrice ? `UGX ${product.comparePrice.toLocaleString()}` : 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Performance Analytics */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Performance Analytics</h2>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Total Views</span>
                    </div>
                    <p className="text-2xl font-bold">{product.views || 0}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Wishlist</span>
                    </div>
                    <p className="text-2xl font-bold">234</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">View to Cart Rate</span>
                    <span className="font-medium">12.3%</span>
                  </div>
                  <Progress value={12.3} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cart to Purchase</span>
                    <span className="font-medium">34.8%</span>
                  </div>
                  <Progress value={34.8} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Return Rate</span>
                    <span className="font-medium">2.3%</span>
                  </div>
                  <Progress value={2.3} className="h-2" />
                </div>
              </TabsContent>
              
              <TabsContent value="traffic" className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Traffic Sources</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Organic Search</span>
                        </div>
                        <span className="font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Social Media</span>
                        </div>
                        <span className="font-medium">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Direct</span>
                        </div>
                        <span className="font-medium">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">Referral</span>
                        </div>
                        <span className="font-medium">9%</span>
                      </div>
                      <Progress value={9} className="h-2" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sales" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">This Week</p>
                    <p className="text-xl font-bold">18 sales</p>
                    <p className="text-sm text-green-600">+22% vs last week</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">This Month</p>
                    <p className="text-xl font-bold">76 sales</p>
                    <p className="text-sm text-green-600">+15% vs last month</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing & Profit */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Pricing & Profit</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selling Price</span>
                <span className="font-bold">UGX {product.price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compare At</span>
                <span className="text-gray-500">{product.comparePrice ? `UGX ${product.comparePrice.toLocaleString()}` : 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost</span>
                <span>{product.costPerItem ? `UGX ${product.costPerItem.toLocaleString()}` : 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit Margin</span>
                <span className="text-green-600 font-medium">
                  {product.costPerItem ? 
                    `${(((product.price - product.costPerItem) / product.price) * 100).toFixed(1)}%` : 
                    'N/A'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit per Unit</span>
                <span className="text-green-600 font-bold">
                  {product.costPerItem ? 
                    `UGX ${(product.price - product.costPerItem).toLocaleString()}` : 
                    'N/A'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tax Rate</span>
                <span>18%</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Discount</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-600">
                  {product.comparePrice && product.comparePrice > product.price ?
                    `${(((product.comparePrice - product.price) / product.comparePrice) * 100).toFixed(0)}% OFF` :
                    'No Discount'
                  }
                </Badge>
              </div>
            </div>
          </Card>

          {/* Inventory Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Inventory Status</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Stock</span>
                <span className="text-2xl font-bold">{getTotalStock(product.variations)}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SKU</span>
                  <span className="text-sm font-medium">{product.id.slice(-8).toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Stock Alert</span>
                  <span className="text-sm">10 units</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Reorder Point</span>
                  <span className="text-sm">15 units</span>
                </div>
                
                {/* Show individual variations */}
                {product.variations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Variations:</span>
                    {product.variations.map((variation) => (
                      <div key={variation.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm">{variation.name}: {variation.value}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">Stock: {variation.stock}</div>
                          <div className="text-xs text-gray-500">UGX {variation.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Supplier</span>
                  </div>
                  <p className="text-sm text-gray-600">{product.vendor || 'Direct Supplier'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-sm text-gray-600">Warehouse A - Zone 3</p>
                </div>
              </div>
            </div>
          </Card>

          {/* SEO Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">SEO Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Page Title</p>
                <p className="text-sm">{product.title} | Your Store</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Meta Description</p>
                <p className="text-sm">Buy {product.title} - {product.description ? product.description.substring(0, 100) + '...' : 'Quality product with competitive pricing'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">URL Handle</p>
                <p className="text-sm text-blue-600">/products/{product.title.toLowerCase().replace(/\s+/g, '-')}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;