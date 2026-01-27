import {
  Truck, Clock, Zap, Star, DollarSign, BadgeCheck,
  Smartphone, Bike, Calendar, MapPin, CreditCard,
  Banknote, Gift, Package, Wallet, Store, Globe,
  Shield, RotateCcw, MessageCircle, Heart, Tag,
  ShoppingBag, ThumbsUp, User, Leaf, Home, PawPrint,
  Tv, Coffee, Users, Award, Wifi, Car, UtensilsCrossed,
  Music, Dumbbell, Sparkles, Baby, Accessibility,
  ParkingCircle,
  type LucideIcon
} from 'lucide-react';

export type HighlightIconConfig = {
  icon: LucideIcon;
  color: string;
};

export const highlightIcons: Record<string, HighlightIconConfig> = {
  "Free Delivery": { icon: Truck, color: "text-gray-500" },
  "24/7 Support": { icon: Clock, color: "text-gray-500" },
  "Fast Shipping": { icon: Zap, color: "text-gray-500" },
  "Quality Products": { icon: Star, color: "text-gray-500" },
  "Best Prices": { icon: DollarSign, color: "text-gray-600" },
  "Verified Member": { icon: BadgeCheck, color: "text-gray-600" },
  "Accepts Mobile Money": { icon: Smartphone, color: "text-gray-500" },
  "Order with Glovo": { icon: Bike, color: "text-gray-600" },
  "Online Booking": { icon: Calendar, color: "text-gray-500" },
  "In-person Visits": { icon: MapPin, color: "text-gray-500" },
  "Accepts Cards": { icon: CreditCard, color: "text-gray-500" },
  "Cash on Delivery": { icon: Banknote, color: "text-gray-500" },
  "Gift Wrapping": { icon: Gift, color: "text-gray-500" },
  "Express Delivery": { icon: Package, color: "text-gray-600" },
  "Installments": { icon: Wallet, color: "text-gray-600" },
  "Local Pickup": { icon: Store, color: "text-gray-500" },
  "National Delivery": { icon: Globe, color: "text-gray-500" },
  "Warranty Included": { icon: Shield, color: "text-gray-500" },
  "Returns Accepted": { icon: RotateCcw, color: "text-gray-500" },
  "Live Chat Support": { icon: MessageCircle, color: "text-gray-500" },
  "Loyalty Program": { icon: Heart, color: "text-gray-500" },
  "Seasonal Discounts": { icon: Tag, color: "text-gray-500" },
  "New Arrivals": { icon: ShoppingBag, color: "text-gray-500" },
  "Exclusive Offers": { icon: Sparkles, color: "text-gray-500" },
  "Customer Reviews": { icon: ThumbsUp, color: "text-gray-500" },
  "Owner Operated": { icon: User, color: "text-gray-500" },
  "Eco-Friendly": { icon: Leaf, color: "text-gray-500" },
  "Family Owned": { icon: Home, color: "text-gray-600" },
  "Pet Friendly": { icon: PawPrint, color: "text-gray-500" },
  "TV": { icon: Tv, color: "text-purple-500" },
  "Coffee": { icon: Coffee, color: "text-gray-500" },
  "Lounge Area": { icon: Users, color: "text-indigo-500" },
  "Premium Service": { icon: Award, color: "text-gray-600" },
  "Free WiFi": { icon: Wifi, color: "text-gray-500" },
  "Parking Space": { icon: ParkingCircle, color: "text-gray-600" },
  "Warranty": { icon: Shield, color: "text-gray-500" },
  "Parking Available": { icon: Car, color: "text-gray-600" },
  "Dine-In": { icon: UtensilsCrossed, color: "text-gray-500" },
  "Live Music": { icon: Music, color: "text-gray-500" },
  "Gym/Fitness": { icon: Dumbbell, color: "text-gray-500" },
  "Kids Friendly": { icon: Baby, color: "text-gray-400" },
  "Wheelchair Available": { icon: Accessibility, color: "text-blue-500" },
};

export const getHighlightIcon = (highlight: string): HighlightIconConfig => {
  return highlightIcons[highlight] || { icon: Star, color: "text-gray-500" };
};