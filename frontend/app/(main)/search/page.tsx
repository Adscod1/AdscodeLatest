import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  X,
  ShoppingBag,
  Heart,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Sample data for products
const products = [
  {
    id: 1,
    name: "Velvet Shoes",
    price: 100,
    rating: 4,
    itemsSold: 350,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    sale: false,
  },
  {
    id: 2,
    name: "Ballet Flats",
    price: 100,
    rating: 4,
    itemsSold: 320,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    sale: true,
    salePercent: 10,
  },
  {
    id: 3,
    name: "Velvet Shoes",
    price: 120,
    rating: 4,
    itemsSold: 380,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f",
    sale: false,
  },
  {
    id: 4,
    name: "Red Solid Pumps",
    price: 140,
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f",
    sale: false,
  },
  {
    id: 5,
    name: "Red Handbag",
    price: 140,
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1566150905458-1bf586d2d7b3",
    sale: false,
  },
  {
    id: 6,
    name: "Small Handbag",
    price: 160,
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1566150905458-1bf586d2d7b3",
    sale: false,
  },
  {
    id: 7,
    name: "Satchel Bag",
    price: 160,
    rating: 4,
    itemsSold: 330,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e",
    sale: true,
    salePercent: 10,
  },
  {
    id: 8,
    name: "Purple Handbag",
    price: 200,
    rating: 5,
    itemsSold: 400,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e",
    sale: true,
    salePercent: 10,
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  itemsSold: number;
  image: string;
  sale: boolean;
  salePercent?: number;
}

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Collapsible className="mb-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <CollapsibleTrigger className="p-1">
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {children}
        <div className="mt-2">
          <Button variant="link" className="p-0 h-auto text-sm">
            See more
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const FilterCheckbox = ({
  id,
  label,
  checked = false,
}: {
  id: string;
  label: string;
  checked?: boolean;
}) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Checkbox id={id} defaultChecked={checked} />
      <label htmlFor={id} className="text-sm font-medium cursor-pointer">
        {label}
      </label>
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full shadow-sm h-8 w-8"
          >
            <Heart className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        {product.sale && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="destructive">Sale Off {product.salePercent}%</Badge>
          </div>
        )}

        <div className="h-48 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-blue-500 font-bold">${product.price}</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">
            {product.itemsSold} items sold
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const SearchResultsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-10 gap-4">
        <div className="bg-purple-500 p-2 rounded text-white">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold">Shopping</h1>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Input placeholder="Women fashion" className="pl-10 py-2 w-full" />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Result for &quot;Women fashion&quot;
        </h2>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-500">300 products</span>
          </div>
          <Select defaultValue="price-low-high">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Filters</h2>
            <Button variant="link" className="p-0 h-auto">
              Clear all
            </Button>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              Shoes <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              Handbag <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              EleganceCouture <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              UrbanChic Collective <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              M Size <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              From $20 to $160 <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              Last 7 days <X className="h-3 w-3 cursor-pointer" />
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              5-star rating <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          </div>

          <div className="divide-y">
            <FilterSection title="Category">
              <FilterCheckbox id="shoes" label="Shoes" checked={true} />
              <FilterCheckbox id="handbag" label="Handbag" checked={true} />
              <FilterCheckbox id="dress" label="Dress" />
            </FilterSection>

            <FilterSection title="Brand">
              <FilterCheckbox
                id="elegance"
                label="EleganceCouture"
                checked={true}
              />
              <FilterCheckbox
                id="urban"
                label="UrbanChic Collective"
                checked={true}
              />
              <FilterCheckbox id="boho" label="BohoBreeze" />
            </FilterSection>

            <FilterSection title="Size">
              <FilterCheckbox id="s" label="S" />
              <FilterCheckbox id="m" label="M" checked={true} />
              <FilterCheckbox id="l" label="L" />
              <FilterCheckbox id="xl" label="XL" />
            </FilterSection>

            <FilterSection title="Price ($)">
              <div className="mb-6 px-2">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center px-3 py-1 border rounded-full">
                    <span className="text-gray-400 mr-1">$</span>
                    <Input
                      type="number"
                      className="w-16 border-0 p-0 h-auto focus-visible:ring-0"
                      defaultValue={20}
                    />
                  </div>
                  <div className="flex items-center px-3 py-1 border rounded-full">
                    <span className="text-gray-400 mr-1">$</span>
                    <Input
                      type="number"
                      className="w-16 border-0 p-0 h-auto focus-visible:ring-0"
                      defaultValue={200}
                    />
                  </div>
                </div>
                <Slider defaultValue={[20, 160]} max={300} step={1} />
              </div>
            </FilterSection>

            <FilterSection title="Deals & Discounts">
              <FilterCheckbox id="all-discounts" label="All Discounts" />
              <FilterCheckbox id="todays-deals" label="Today's Deals" />
            </FilterSection>

            <FilterSection title="New Arrivals">
              <FilterCheckbox
                id="last-7-days"
                label="Last 7 days"
                checked={true}
              />
              <FilterCheckbox id="last-30-days" label="Last 30 days" />
              <FilterCheckbox id="last-60-days" label="Last 60 days" />
            </FilterSection>

            <FilterSection title="Rating">
              <RadioGroup defaultValue="5stars">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5stars" id="5stars" />
                  <label htmlFor="5stars" className="text-sm text-yellow-400">
                    ★★★★★
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4stars" id="4stars" />
                  <label htmlFor="4stars" className="text-sm">
                    <span className="text-yellow-400">★★★★</span>
                    <span className="text-gray-200">★</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3stars" id="3stars" />
                  <label htmlFor="3stars" className="text-sm">
                    <span className="text-yellow-400">★★★</span>
                    <span className="text-gray-200">★★</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2stars" id="2stars" />
                  <label htmlFor="2stars" className="text-sm">
                    <span className="text-yellow-400">★★</span>
                    <span className="text-gray-200">★★★</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1star" id="1star" />
                  <label htmlFor="1star" className="text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-200">★★★★</span>
                  </label>
                </div>
              </RadioGroup>
            </FilterSection>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 p-0 rounded-md mx-1"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md mx-1"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md mx-1"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md mx-1"
              >
                4
              </Button>
              <span className="mx-1">...</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md mx-1"
              >
                10
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md mx-1"
              >
                11
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0 rounded-md"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
