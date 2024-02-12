import { metaCategories, productCategories } from '@/lib/types/categories';
import { Database } from '@/lib/supabase/schema';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Omit<Database['public']['Tables']['products']['Row'], 'categories'> & {
  categories: (typeof productCategories)[keyof typeof productCategories][number][];
};
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Enums = Database['public']['Enums'];

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

// sample data
const test: Product[] = [
  {
    id: '1',
    name: 'product1',
    description: 'description1',
    price: 1000,
    available_colors: ['red', 'brown'],
    available_sizes: ['sm', 'md', 'lg'],
    categories: ['아우터'],
    image_url: 'https://via.placeholder.com/150',
    tags: ['best', 'sns hot'],
  },
  {
    id: '2',
    name: 'product2',
    description: 'description2',
    price: 2000,
    available_colors: ['red', 'blue'],
    available_sizes: ['sm', 'md', 'lg'],
    categories: ['아우터'],
    image_url: 'https://via.placeholder.com/150',
    tags: ['best', 'sns hot'],
  },
];