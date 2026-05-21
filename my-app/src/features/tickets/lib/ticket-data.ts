export type TicketProduct = {
  name: string;
  price: number;
  id: string;
  description: string;
  nameAr: string;
  descriptionAr: string;
  discount?: number;   // اختياري لأنه غير موجود في قائمة الـ required
  isActive?: boolean;  // اختياري لأنه غير موجود في قائمة الـ required
};