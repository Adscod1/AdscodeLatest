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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AddCatalogDialog from "@/components/AddCatalogDialog";
import api from "@/lib/api-client";
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
import { toast } from "sonner";
import { ProductVariation, Product as ApiProduct } from "@/lib/api-client";

interface Product {
  id: string;
  title: string;
  description?: string | null;
  price?: number;
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
  const router = useRouter();
  const storeId = pathname.split("/")[1];
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storeId],
    queryFn: async () => {
      const response = await api.products.getByStore({ storeId });
      return response.products;
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => api.products.delete(productId),
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
    return variations.reduce((total, variation) => total + (variation.stock ?? 0), 0);
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
          Add Listing
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
                  <TableRow 
                    key={product.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/${storeId}/products/${product.id}`)}
                  >
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
                            {product.category || "Uncategorized"} • UGX {(product.price ?? 0).toLocaleString()}
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
                    <TableCell className="hidden sm:table-cell">UGX {(product.price ?? 0).toLocaleString()}</TableCell>
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
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/${storeId}/products/${product.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${storeId}/product/${product.id}/edit`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
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
    </div>
  );
};

export default StoreListings;
