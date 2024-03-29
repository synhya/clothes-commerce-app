import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BasketInfo, LineItem, Product } from '@/lib/types';
import { BasketItemData, ProductCardData } from '@/lib/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { env } from '@/lib/env';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);
    return toast.error(errors.join('\n'));
  } else if (err instanceof Error) {
    return toast.error(err.message);
  } else {
    return toast.error('알 수 없는 오류가 발생했습니다.');
  }
}

export function productDataToCardData(
  product: Product,
  supabase?: SupabaseClient,
): ProductCardData {
  if (!supabase) {
    supabase = createClient();
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('products').getPublicUrl(product.image_url);

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: publicUrl,
    categories: product.categories,
    tags: product.tags,
    availableColors: product.available_colors,
  };
}

// typescript가 자동으로 큰타입을 작은 타입으로 변환해주지 않는다.
// 모든 값을 전달하되 타입에 따라서 숨겨줄 뿐이다.
// 따라서 별도로 이렇게 타입변환이 필요할 듯
export function basketInfoToLineItem(basketInfo: BasketInfo): LineItem {
  return {
    product_id: basketInfo.product_id,
    quantity: basketInfo.quantity,
    selected_color: basketInfo.selected_color,
    selected_size: basketInfo.selected_size,
    basket_id: basketInfo.id,
  };
}
