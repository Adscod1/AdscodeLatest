// dummy data for the app
import { Store, Users, PenSquare, LayoutDashboard } from "lucide-react";
import { Bookmark, Heart, Share2, Star as StarIcon } from "lucide-react";
import React from "react";

export type NavLinkType = {
  href: string;
  label: string;
  subText: string;
  icon: React.ElementType;
  isActive?: boolean;
};

export const navLinks: NavLinkType[] = [
  {
    href: "/",
    label: "List your business",
    subText: "Start advertising in minutes",
    icon: Store,
    isActive: true,
  },
  {
    href: "/influencer/all",
    label: "Discover Influencers",
    subText: "Find right creators",
    icon: Users,
    isActive: false,
  },
  {
    href: "/reviews",
    label: "Write reviews",
    subText: "Be a trusted voice",
    icon: PenSquare,
    isActive: false,
  },
  {
    href: "/profile",
    label: "My Dashboard",
    subText: "Track every step of your business",
    icon: LayoutDashboard,
    isActive: false,
  },
];

export type FeedProfileType = {
  name: string;
  type: string;
  time: string;
  verified: boolean;
  metrics?: string;
};

export type FeedContentType = {
  title: string;
  rating: number;
  reviews: number;
  price: string;
  discount?: string;
  description?: string;
  imageSrc: string;
};

export type FeedItemType = {
  profile: FeedProfileType;
  content: FeedContentType;
};

export const feedItems: FeedItemType[] = [
  {
    profile: {
      name: "Mega Gadgets",
      type: "Product Reviewer",
      time: "25 minutes ago",
      verified: true,
      metrics: "1M",
    },
    content: {
      title: "iPhone 14 Pro",
      rating: 5,
      reviews: 150,
      price: "UGX. 1,700,000",
      discount: "25% OFF",
      imageSrc: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    },
  },
  {
    profile: {
      name: "Ignatius_Kwatempora",
      type: "Product Reviewer",
      time: "3 hrs ago",
      verified: true,
      metrics: "9.8K",
    },
    content: {
      title: "Marketing Services",
      rating: 4,
      reviews: 182,
      price: "UGX. 1,700,000",
      description:
        "Promotion's marketing services are top notch if not the best in Kampala.",
      imageSrc: "https://images.unsplash.com/photo-1552581234-26160f608093",
    },
  },
  {
    profile: {
      name: "Carrefour",
      type: "Shopping Centre",
      time: "Just now",
      verified: true,
      metrics: "4.8M",
    },
    content: {
      title: "Weekend Shopping Offer (2 Days left)",
      rating: 5,
      reviews: 150,
      price: "UGX. 170,000",
      discount: "25% OFF",
      imageSrc: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
    },
  },
  {
    profile: {
      name: "Mega Gadgets",
      type: "Product Reviewer",
      time: "25 minutes ago",
      verified: true,
      metrics: "1M",
    },
    content: {
      title: "iPhone 14 Pro",
      rating: 5,
      reviews: 150,
      price: "UGX. 1,700,000",
      discount: "25% OFF",
      imageSrc: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
    },
  },
  {
    profile: {
      name: "Ignatius_Kwatempora",
      type: "Product Reviewer",
      time: "3 hrs ago",
      verified: true,
      metrics: "9.8K",
    },
    content: {
      title: "Marketing Services",
      rating: 4,
      reviews: 182,
      price: "UGX. 1,700,000",
      description:
        "Promotion's marketing services are top notch if not the best in Kampala.",
      imageSrc: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
    },
  },
  {
    profile: {
      name: "Carrefour",
      type: "Shopping Centre",
      time: "Just now",
      verified: true,
      metrics: "4.8M",
    },
    content: {
      title: "Weekend Shopping Offer (2 Days left)",
      rating: 5,
      reviews: 150,
      price: "UGX. 170,000",
      discount: "25% OFF",
      imageSrc: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
    },
  },
];

// Businesses page interfaces and data
export interface Business {
  id: number;
  name: string;
  verified: boolean;
  type: string;
  rating: number;
  reviews: string;
  image: string;
  tags: string[];
  description: string;
  description2: string;
  responseTime: string;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  price: string;
  rating: number;
  itemsSold: number;
  image: string;
}

// Sample businesses data
export const businesses: Business[] = [
  {
    id: 1,
    name: "Masoma Collection",
    verified: true,
    type: "In-Store Shopping",
    rating: 4.5,
    reviews: "2.3K",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5",
    tags: ["Shopping", "Fashion", "Clothes", "Footwear"],
    description:
      "Product ut labore exercitation eu elit occaecat incididunt aliquip labore in Lorem deserunt qui in consectetur id ad est eireeie nonnumde furcna bussaee faveieare maionema.",
    description2:
      "Product ut labore exercitation eu elit occaecat incididunt aliquip labore in Lorem deserunt qui in consectetur id ad est eireeie nonnumde furcna bussaee faveieare maionema.",
    responseTime: "10 minutes",
  },
  {
    id: 2,
    name: "Masoma Collection",
    verified: true,
    type: "In-Store Shopping",
    rating: 4.5,
    reviews: "2.3K",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
    tags: ["Shopping", "Fashion", "Clothes", "Footwear"],
    description:
      "Product ut labore exercitation eu elit occaecat incididunt aliquip labore in Lorem deserunt qui in consectetur id ad est eireeie nonnumde furcna bussaee faveieare maionema.",
    description2:
      "Product ut labore exercitation eu elit occaecat incididunt aliquip labore in Lorem deserunt qui in consectetur id ad est eireeie nonnumde furcna bussaee faveieare maionema.",
    responseTime: "3 minutes",
  },
  {
    id: 3,
    name: "Masoma Collection",
    verified: true,
    type: "In-Store Shopping",
    rating: 4.5,
    reviews: "2.3K",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    tags: ["Shopping", "Fashion", "Clothes", "Footwear"],
    description:
      "Product ut labore exercitation eu elit occaecat incididunt aliquip labore in Lorem deserunt qui in consectetur id ad est eireeie nonnumde furcna bussaee faveieare maionema.",
    description2:
      "Product ut labore exercitation eu elit occaecat incididunt aliquip labore in Lorem deserunt qui in consectetur id ad est eireeie nonnumde furcna bussaee faveieare maionema.",
    responseTime: "12 minutes",
  },
];

// Sample promotions data
export const promotions: Promotion[] = [
  {
    id: 1,
    title: "Product title",
    description:
      "Description about the product, quis maximal velenation delerius",
    price: "$230",
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    id: 2,
    title: "Product title",
    description:
      "Description about the product, quis maximal velenation delerius",
    price: "$230",
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    id: 3,
    title: "Product title",
    description:
      "Description about the product, quis maximal velenation delerius",
    price: "$230",
    rating: 5,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    id: 4,
    title: "Product title",
    description:
      "Description about the product, quis maximal velenation delerius",
    price: "$230",
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    id: 5,
    title: "Product title",
    description:
      "Description about the product, quis maximal velenation delerius",
    price: "$230",
    rating: 4,
    itemsSold: 360,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
];

// Business Detail Page interfaces and data
export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  itemsSold: number;
  saleOff: boolean;
  title?: string;
  description?: string;
}

export interface CategoryItem {
  name: string;
  active: boolean;
}

export interface DiscountCategory {
  discount: string;
  category: string;
  image: string;
  color: string;
}

// Sample categories for business page
export const categories: CategoryItem[] = [
  { name: "All", active: true },
  { name: "Fashion", active: false },
  { name: "Electronics", active: false },
  { name: "Automobile", active: false },
  { name: "Appliances", active: false },
  { name: "Kids wear", active: false },
  { name: "Furniture", active: false },
  { name: "Machines", active: false },
];

// Sample discount categories for business page
export const discountCategories: DiscountCategory[] = [
  {
    discount: "10% OFF",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    color: "text-blue-500",
  },
  {
    discount: "20% OFF",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    color: "text-purple-500",
  },
  {
    discount: "40% OFF",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1560891958-68bb1fe7fb78",
    color: "text-green-500",
  },
];

// Sample product tabs for business page
export const productTabs: string[] = [
  "Electronics",
  "Fashion",
  "Furniture",
  "Beauty",
  "Automobile",
  "Food & Drinks",
  "Appliances",
];

// Sample products for business page
export const products: Product[] = [
  {
    id: 1,
    name: "Men Shoes",
    price: "$70",
    rating: 4,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28",
    itemsSold: 360,
    saleOff: false,
  },
  {
    id: 2,
    name: "Velvet Shoes",
    price: "$200",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    itemsSold: 360,
    saleOff: false,
  },
  {
    id: 3,
    name: "Women Sweater",
    price: "$90",
    rating: 4,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    itemsSold: 360,
    saleOff: true,
  },
  {
    id: 4,
    name: "Leather Handbag",
    price: "$120",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566150905458-1bf586d2d7b3",
    itemsSold: 360,
    saleOff: false,
  },
  {
    id: 5,
    name: "Designer Glasses",
    price: "$85",
    rating: 4,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3",
    itemsSold: 360,
    saleOff: false,
  },
  {
    id: 6,
    name: "Summer Top",
    price: "$45",
    rating: 5,
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3",
    itemsSold: 360,
    saleOff: true,
  },
  {
    id: 7,
    name: "Corduroy Pants",
    price: "$60",
    rating: 4,
    image: "https://images.unsplash.com/photo-1598522325074-042db73aa4e6",
    itemsSold: 360,
    saleOff: false,
  },
];

// Business Reviews Page interfaces and data
export interface User {
  name: string;
  image: string;
  verified?: boolean;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  time: string;
  content: string;
  likes?: number;
  hasReply?: boolean;
  images?: string[];
  isEdited?: boolean;
}

export interface ReviewDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface BusinessDetail {
  name: string;
  verified: boolean;
  type: string;
  rating: number;
  totalReviews: number;
}

// Sample data for the business reviews page
export const businessDetail: BusinessDetail = {
  name: "IHK Hospital UG",
  verified: true,
  type: "Healthcare & Medical",
  rating: 5,
  totalReviews: 144,
};

export const reviewTags: Tag[] = [
  { id: 1, name: "Shopping" },
  { id: 2, name: "Clinical Fashion" },
  { id: 3, name: "Women's Diseases" },
];

export const latestReviews: Review[] = [
  {
    id: 1,
    user: {
      name: "Jimmy Will",
      image: "https://ui-avatars.com/api/?name=Jimmy+Will&background=random",
      verified: true,
    },
    rating: 5,
    time: "08:10 AM",
    content:
      "Velit ipsum magna labore duis esse aliqua. Pariatur labore culpa id eu reprehenderit quis nulla culpa aliqua mollit esse aliquo culpa excepteur 😊",
    likes: 2,
    hasReply: true,
    images: [],
  },
  {
    id: 2,
    user: {
      name: "Alisa Grill",
      image: "https://ui-avatars.com/api/?name=Alisa+Grill&background=random",
      verified: false,
    },
    rating: 4,
    time: "06:24 AM",
    content:
      "Amet culpa nulla mollit do in nulla id aliquip occaecat ipsum officia et incididunt enim esse. Ad est deserunt amet pariatur excepteur reprehenderit fugiat quis. Nisi mollit aliquip adipisicing cillum ut proident labore aliqua anim dolor nulla officia ullamco 🔥",
    likes: 0,
    hasReply: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    ],
  },
  {
    id: 3,
    user: {
      name: "Chris Helson",
      image: "https://ui-avatars.com/api/?name=Chris+Helson&background=random",
      verified: false,
    },
    rating: 5,
    time: "05:47 AM",
    content:
      "Deserunt minim incididunt culpa molestie de voluptate excepteur excepteur. 😊😊😊",
    likes: 0,
    hasReply: false,
    images: [],
    isEdited: true,
  },
  {
    id: 4,
    user: {
      name: "Green William",
      image: "https://ui-avatars.com/api/?name=Green+William&background=random",
      verified: false,
    },
    rating: 4,
    time: "05:29 AM",
    content:
      "Deserunt minim incididunt cillum nostrud do de voluptate excepteur excepteur minim ea minim est laborum 😉 Mollit commodo in do dolor id in mollit est",
    likes: 0,
    hasReply: false,
    images: [],
  },
  {
    id: 5,
    user: {
      name: "Jennifer King",
      image: "https://ui-avatars.com/api/?name=Jennifer+King&background=random",
      verified: true,
    },
    rating: 5,
    time: "05:00",
    content:
      "Nulla labore fugiat fugiat minim minim excepteur eiumsod quis. Laborere est minim id cillum nostrud ullan consectetur 😀😀😀",
    likes: 0,
    hasReply: false,
    images: [],
  },
];

export const reviewDistribution: ReviewDistribution[] = [
  { stars: 5, count: 97, percentage: 70 },
  { stars: 4, count: 24, percentage: 15 },
  { stars: 3, count: 12, percentage: 8 },
  { stars: 2, count: 7, percentage: 5 },
  { stars: 1, count: 4, percentage: 2 },
];

export const reviewsList: Review[] = [
  {
    id: 1,
    user: {
      name: "Jeren Rayner",
      image: "https://ui-avatars.com/api/?name=Jeren+Rayner&background=random",
    },
    rating: 4,
    time: "A day ago",
    content:
      "Deserunt minim incididunt minim excepteur eiumsod quis. Laborere est minim id cillum nostrud ullan",
  },
  {
    id: 2,
    user: {
      name: "Jason D.",
      image: "https://ui-avatars.com/api/?name=Jason+D&background=random",
      verified: true,
    },
    rating: 5,
    time: "5 days ago",
    content:
      "Magna pariatur et ut ullamco minim excepteur eiumsod quis. Laborere est minim id cillum nostrud ullan nisi",
  },
  {
    id: 3,
    user: {
      name: "Jennifer King",
      image: "https://ui-avatars.com/api/?name=Jennifer+King&background=random",
      verified: true,
    },
    rating: 5,
    time: "3 weeks ago",
    content:
      "Nulla labore fugiat fugiat minim minim excepteur eiumsod quis. Laborere est minim excepteur eiumsod quis. Laborere est minim id cillum nostrud ullan consectetur",
  },
];

// Influencers Page interfaces and data
export interface Influencer {
  id: string;
  name: string;
  image: string;
  description: string;
  followers: string;
  engagement: string;
  price: string;
  contentType: string;
  category: string;
}

export const influencers: Influencer[] = [
  {
    id: "1",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "40K",
    engagement: "86%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "2",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "700",
    engagement: "62%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "3",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "40K",
    engagement: "86%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "1",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "700",
    engagement: "62%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "2",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "40K",
    engagement: "86%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "3",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "700",
    engagement: "62%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "1",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "40K",
    engagement: "86%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "2",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "700",
    engagement: "62%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
  {
    id: "3",
    name: "Elizabeth Lopez",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200",
    description: "Nulla dolor culpa aliqua consectetur idlorem",
    followers: "40K",
    engagement: "86%",
    price: "$30/Post + story",
    contentType: "How-to-do Guides",
    category: "Technology",
  },
];

// Influencer page data
export const influencerStats = [
  { label: "Following", value: "99", icon: Bookmark },
  {
    label: "Rating",
    value: "4.8/5",
    icon: StarIcon,
  },
  { label: "Followers", value: "45k", icon: Heart },
  { label: "Engagement", value: "86%", icon: Share2 },
];

export const influencerReviews = [
  {
    id: 1,
    name: "Jenny Davis",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
    rating: 5,
    date: "3 day ago",
    content:
      "Magna id sint aute in lorem esse est nisi amet reprehenderit dolor amet labore.",
  },
  {
    id: 2,
    name: "Jason Sniper",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
    rating: 5,
    date: "5 day ago",
    content:
      "Magna id sint aute in lorem esse est nisi amet reprehenderit dolor denim voluptate culpa.",
  },
];

export const influencerWorkImages = [
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&h=400",
];

export const influencerGalleryImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=300&h=300",
];
