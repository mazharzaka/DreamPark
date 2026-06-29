import { 
  ArrowUpFromLine, 
  HeartPulse, 
  Briefcase, 
  ShieldAlert,
  AlertCircle
} from "lucide-react";

export const BOOKING_URL = process.env.NEXT_PUBLIC_ZOO_BOOKING_URL || "https://dreampark.sa/booking";

export const iconMap: Record<string, any> = {
  'height': ArrowUpFromLine,
  'health': HeartPulse,
  'items': Briefcase,
  'behavior': ShieldAlert,
};

export const getIcon = (type?: string) => {
  return (type && iconMap[type]) ? iconMap[type] : AlertCircle;
};
