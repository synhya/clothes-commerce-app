import { Categories, uniqueCategories } from '@/lib/types/client';
import { Database } from '@/lib/supabase/schema';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type Product = Omit<Database['public']['Tables']['products']['Row'], 'categories'> & {
  categories: Categories;
};
export type ProductSubmit = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sold'>;

export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Enums = Database['public']['Enums'];

export const productSizeEnums = ["xs" , "sm" , "md" , "lg" , "xl" , "2xl"] as const
export const productSaleState = ["판매중", "대기중"] as const

export const categoryOptions = ['전체', ...uniqueCategories] as const;
export const sellStatusOptions = ['전체', ...productSaleState] as const;


const test2: Invoice = {
  id: 1,
  address: '서울시 강남구',
  extra_address: '123-456',
  product_id: '1',
  profile_id: '1',
  selected_color: 'red',
  selected_size: 'sm',
  quantity: 1,
  product_price: 1000,
  product_name: 'product1',
  state : '결제완료', // 결제완료, 배송중, 배송완료, 환불완료
  user_email : 'example@com',
  user_name : '홍길동',
  user_phone : '010-1234-5678',
}
