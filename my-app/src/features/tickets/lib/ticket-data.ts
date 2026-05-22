export type TicketProduct = {
  name: string;
  price: number;
  id: string;
  description: string[];
  nameAr: string;
  descriptionAr: string[];
  color?: string;     // اختياري لأنه غير موجود في قائمة الـ required
  discount?: number;   // اختياري لأنه غير موجود في قائمة الـ required
  isActive?: boolean;  // اختياري لأنه غير موجود في قائمة الـ required
  icon?: string;
};