import { Route } from 'next';
import { type FileWithPath } from 'react-dropzone';
import { Database } from '@/lib/supabase/schema';
import { productCategories, subCategories } from '@/config/product';

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type SidebarNavItem = {
  label: string;
  href: Route;
  // icon: LucideIcon
}

export type HeaderItem = {
  title: string;
  description: string;
  href: Route;
}

export type AuthHeaderItem = HeaderItem & { progress?: number };

export type BreadCrumb = {
  title: string;
  href: Route;
};

export type ProductCardData = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categories: Categories;
  tags?: string[];
  availableColors?: string[];
};

export type BasketItemData = {
  imageUrl: string;
  productName: string;
  price: number;
  selectedColor: string;
  selectedSize: DBEnums['product_size'];
  quantity: number;
};

export type Categories = (
  | (typeof subCategories)[keyof typeof subCategories][number]
  | (typeof productCategories)[number]
)[];

export type ProductCategory = (typeof productCategories)[number];
export type SubCategory = {
  [K in ProductCategory]: string[];
};

export type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFilterOption<TData> {
  id?: string
  label: string
  value: keyof TData | string
  items: Option[]
  isMulti?: boolean
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}


// db

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInfo = Database['public']['Views']['profile_info']['Row'];

export type Product = Omit<Database['public']['Tables']['products']['Row'], 'categories'> & {
  categories: Categories;
};
export type ProductSubmit = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sold'>;

export type BasketInfo = Database['public']['Views']['basket_info']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type CustomerInfo = Database['public']['CompositeTypes']['invoice_customer'];
export type LineItem = Omit<
  Database['public']['Tables']['invoice_products']['Row'],
  'id' | 'invoice_id'
>;
export type DBEnums = Database['public']['Enums'];

