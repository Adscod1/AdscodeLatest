import React from 'react';
import {
  Zap,
  Wifi,
  ParkingCircle,
  Shield,
  Tv,
  Coffee,
  Users,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Package,
  Truck,
  Headphones,
  Heart,
  MessageCircle,
} from 'lucide-react';

export type HighlightIconConfig = {
  icon: React.ComponentType<any>;
  color: string;
};

export type HighlightIconMap = Record<string, HighlightIconConfig>;

export const highlightIcons: HighlightIconMap = {
  'Fast Service': {
    icon: Zap,
    color: 'text-amber-500',
  },
  'Free WiFi': {
    icon: Wifi,
    color: 'text-blue-500',
  },
  'Parking': {
    icon: ParkingCircle,
    color: 'text-slate-600',
  },
  'Warranty': {
    icon: Shield,
    color: 'text-green-500',
  },
  'TV & Rest Room': {
    icon: Tv,
    color: 'text-purple-500',
  },
  'Coffee': {
    icon: Coffee,
    color: 'text-amber-700',
  },
  'Lounge Area': {
    icon: Users,
    color: 'text-indigo-500',
  },
  'Premium Service': {
    icon: Award,
    color: 'text-yellow-500',
  },
  'Open 24/7': {
    icon: Clock,
    color: 'text-red-500',
  },
  'Delivery Available': {
    icon: Truck,
    color: 'text-blue-600',
  },
  'Customer Support': {
    icon: Headphones,
    color: 'text-cyan-500',
  },
  'Loyalty Program': {
    icon: Heart,
    color: 'text-pink-500',
  },
  'Live Chat': {
    icon: MessageCircle,
    color: 'text-green-600',
  },
  'Easy Returns': {
    icon: Package,
    color: 'text-orange-500',
  },
  'Affordable Pricing': {
    icon: DollarSign,
    color: 'text-emerald-500',
  },
  'Prime Location': {
    icon: MapPin,
    color: 'text-rose-500',
  },
};

export function getHighlightIcon(highlight: string) {
  return highlightIcons[highlight];
}
