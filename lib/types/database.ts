import { Categories, uniqueCategories } from '@/lib/types/client';
import { Database } from '@/lib/supabase/schema';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInfo = Database['public']['Views']['profile_info']['Row'];

export type Product = Omit<Database['public']['Tables']['products']['Row'], 'categories'> & {
  categories: Categories;
};
export type ProductSubmit = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sold'>;

export type BasketInfo = Database['public']['Views']['basket_info']['Row'];
export type Invoice = Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at'>;
export type CustomerInfo = Database["public"]["CompositeTypes"]["invoice_customer"];
export type LineItem = Omit<Database['public']['Tables']['invoice_products']['Row'], 'id' | 'invoice_id'>;
export type DBEnums = Database['public']['Enums'];

export const productSizeEnums = ["xs" , "sm" , "md" , "lg" , "xl" , "2xl"] as const
export const productSaleState = ["판매중", "대기중"] as const
export const shipmentMethodEnums = ["택배배송", "퀵서비스", "직접수령"] as const

export const categoryOptions = ['전체', ...uniqueCategories] as const;
export const sellStatusOptions = ['전체', ...productSaleState] as const;

