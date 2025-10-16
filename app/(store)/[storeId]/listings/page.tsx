"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  X,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Star,
  BarChart3,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddCatalogDialog from "@/components/AddCatalogDialog";
import { deleteProduct, getProducts } from "@/actions/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ProductVariation {
  id: string;
  name: string;
  value: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  category?: string | null;
  status: string;
  images?: { url: string }[];
  variations: ProductVariation[];
  productCode?: string;
  rating?: number;
  warehouse?: string;
  brand?: string;
  weight?: string;
  dimensions?: string;
  supplier?: string;
  createdAt?: Date | string;
}

const StoreListings = () => {
  const pathname = usePathname();
  const storeId = pathname.split("/")[1];
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => getProducts(storeId),
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-500";
      case "DRAFT":
        return "bg-yellow-500/10 text-yellow-500";
      case "ARCHIVED":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  // Calculate total stock for a product from its variations
  const getTotalStock = (variations: ProductVariation[]) => {
    return variations.reduce((total, variation) => total + variation.stock, 0);
  };

  // Get stock status
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600", bgColor: "bg-red-100" };
    if (stock < 0) return { label: "Out of Stock", color: "text-red-600", bgColor: "bg-red-100" };
    if (stock <= 10) return { label: "Low Stock", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { label: "In Stock", color: "text-green-600", bgColor: "bg-green-100" };
  };

  // Generate dummy data for products without database fields
  const enrichProductData = (product: Product) => {
    const totalStock = getTotalStock(product.variations);
    const stockStatus = getStockStatus(totalStock);
    
    return {
      ...product,
      productCode: product.productCode || `PROD-${product.id.substring(0, 8).toUpperCase()}`,
      rating: product.rating || 4.3,
      warehouse: product.warehouse || "Warehouse A, Section 3",
      brand: product.brand || product.title.split(' ')[0],
      weight: product.weight || "1.2 kg",
      dimensions: product.dimensions || "15.6 x 7.8 x 0.8 cm",
      supplier: product.supplier || "Tech Distribution Ltd.",
      addedDate: product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "March 15, 2024",
      totalSold: 145,
      revenue: 72500000,
      avgOrder: 500000,
      stockStatus,
      totalStock,
      growth: "+12.5%",
      pageViews: 2456,
      cartAdds: 156,
      clicks: 387,
      wishlistAdds: 89,
      returns: 3,
      conversionRate: "3.2%",
      monthlyGrowth: "+12.5%",
      returnRate: "2.1%",
      costPrice: Math.round(product.price * 0.7),
      sellingPrice: product.price,
      competitorAvg: Math.round(product.price * 1.04),
      margin: "30%"
    };
  };

  // Handle view details
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(enrichProductData(product));
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Listings</h1>
          <p className="text-gray-600 text-sm">
            Manage your product and service catalog
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-full lg:max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input type="text" placeholder="Search products" className="pl-10 w-full" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Product</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No products found. Start by adding a new product.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg mr-2 sm:mr-3 overflow-hidden flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <p className="text-[8px]">No img</p>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-sm sm:text-base truncate block">{product.title}</span>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {product.category || "Uncategorized"} • UGX {product.price.toLocaleString()}
                        </div>
                        <div className="md:hidden mt-1 flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getTotalStock(product.variations)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(product.status)} lg:hidden`}
                          >
                            {product.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 hidden sm:table-cell">
                    {product.category || "Uncategorized"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">UGX {product.price.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {getTotalStock(product.variations)} in stock
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(product.status)}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/${storeId}/product/${product.id}/edit`}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(product as any)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &ldquo;
                                {product.title}&rdquo;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                  deleteProductMutation.mutate(product.id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
          <span>
            Showing {products?.length || 0} product
            {(products?.length || 0) !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add Catalog Dialog */}
      <AddCatalogDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        storeId={storeId}
      />

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <DialogTitle className="text-base sm:text-lg">Product Details</DialogTitle>
            </div>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 sm:space-y-6">
              {/* Product Header */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden relative">
                    {selectedProduct.images && selectedProduct.images[0] ? (
                      <Image
                        src={selectedProduct.images[0].url}
                        alt={selectedProduct.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge className={`text-xs ${selectedProduct.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {selectedProduct.status}
                        </Badge>
                        <h3 className="text-lg sm:text-xl font-semibold truncate">{selectedProduct.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                        <span className="font-medium">{selectedProduct.productCode}</span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 sm:line-clamp-none">
                        {selectedProduct.description || "High-quality smartphone with advanced features and premium build quality. Perfect for everyday use with excellent camera performance."}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span className="text-gray-600 truncate">{selectedProduct.warehouse}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span className="text-gray-600 hidden sm:inline">Added {selectedProduct.addedDate}</span>
                          <span className="text-gray-600 sm:hidden">{selectedProduct.addedDate.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-gray-600">{selectedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">UGX {selectedProduct.price.toLocaleString()}</div>
                      <div className="text-xs sm:text-sm text-gray-500">Current Price</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs text-gray-600 uppercase truncate">Total Sold</div>
                      <div className="text-base sm:text-xl font-bold truncate">{selectedProduct.totalSold}</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs text-gray-600 uppercase truncate">Revenue</div>
                      <div className="text-base sm:text-xl font-bold truncate">UGX {(selectedProduct.revenue / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 ${selectedProduct.stockStatus.bgColor} rounded-lg flex-shrink-0`}>
                      {selectedProduct.totalStock > 0 ? (
                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedProduct.stockStatus.color}`} />
                      ) : (
                        <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedProduct.stockStatus.color}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs text-gray-600 uppercase truncate">Stock Status</div>
                      <div className={`text-sm sm:text-lg font-bold ${selectedProduct.stockStatus.color} truncate`}>
                        {selectedProduct.stockStatus.label}
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs text-gray-600 uppercase truncate">Growth</div>
                      <div className="text-base sm:text-xl font-bold text-green-600 truncate">{selectedProduct.growth}</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Product Information & Inventory Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h3 className="font-semibold text-base sm:text-lg">Product Information</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Category</span>
                      <span className="font-medium text-xs sm:text-sm text-right truncate max-w-[60%]">{selectedProduct.category || "Electronics"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Brand</span>
                      <span className="font-medium text-xs sm:text-sm text-right truncate max-w-[60%]">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Weight</span>
                      <span className="font-medium text-xs sm:text-sm text-right">{selectedProduct.weight}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Dimensions</span>
                      <span className="font-medium text-xs sm:text-sm text-right">{selectedProduct.dimensions}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Supplier</span>
                      <span className="font-medium text-xs sm:text-sm text-right truncate max-w-[60%]">{selectedProduct.supplier}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h3 className="font-semibold text-base sm:text-lg">Inventory Management</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">Available</span>
                      <span className={`font-medium text-xs sm:text-sm ${selectedProduct.totalStock >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.totalStock >= 0 ? selectedProduct.totalStock : `-${Math.abs(selectedProduct.totalStock)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">Reserved</span>
                      <span className="font-medium text-xs sm:text-sm">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">In Transit</span>
                      <span className="font-medium text-xs sm:text-sm text-blue-600">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">Reorder Point</span>
                      <span className="font-medium text-xs sm:text-sm text-orange-600">20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">Last Restocked</span>
                      <span className="font-medium text-xs sm:text-sm text-right">Sept 10, 2024</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sales Performance & Customer Engagement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h3 className="font-semibold text-base sm:text-lg">Sales Performance</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <div className="text-[10px] sm:text-sm text-gray-600 uppercase mb-1">Total Revenue</div>
                        <div className="text-base sm:text-xl font-bold">UGX {(selectedProduct.revenue / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-sm text-gray-600 uppercase mb-1">Avg. Order</div>
                        <div className="text-base sm:text-xl font-bold">UGX {(selectedProduct.avgOrder / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-medium">{selectedProduct.conversionRate}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Monthly Growth</span>
                        <span className="font-medium text-green-600">{selectedProduct.monthlyGrowth}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Return Rate</span>
                        <span className="font-medium">{selectedProduct.returnRate}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h3 className="font-semibold text-base sm:text-lg">Customer Engagement</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <div className="text-[10px] sm:text-sm text-gray-600 uppercase mb-1">Page Views</div>
                        <div className="text-base sm:text-xl font-bold">{selectedProduct.pageViews}</div>
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-sm text-gray-600 uppercase mb-1">Cart Adds</div>
                        <div className="text-base sm:text-xl font-bold">{selectedProduct.cartAdds}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Clicks</span>
                        <span className="font-medium">{selectedProduct.clicks}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Wishlist Adds</span>
                        <span className="font-medium">{selectedProduct.wishlistAdds}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Returns</span>
                        <span className="font-medium text-red-600">{selectedProduct.returns}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Pricing Analysis */}
              <Card className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <h3 className="font-semibold text-base sm:text-lg">Pricing Analysis</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Cost Price</div>
                    <div className="text-xl sm:text-2xl font-bold">UGX {selectedProduct.costPrice.toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Base cost from supplier</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Selling Price</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">UGX {selectedProduct.sellingPrice.toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-green-600 mt-1">Margin: {selectedProduct.margin}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Competitor Average</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">UGX {selectedProduct.competitorAvg.toLocaleString()}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Market comparison</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreListings;
