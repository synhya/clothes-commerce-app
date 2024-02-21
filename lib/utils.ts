import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product } from '@/lib/types/database';
import { ProductCardData } from '@/lib/types/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function productDataToCardData(product : Product, supabase?: SupabaseClient)
  : ProductCardData{
  if(!supabase) {
    supabase = createClient();
  }

  const {data: {publicUrl}} = supabase.storage.from('products').getPublicUrl(product.image_url);

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: publicUrl,
    categories: product.categories,
    tags: product.tags
  };
}