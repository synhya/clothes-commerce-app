import { Profile, Product } from '@/lib/types/database';
import { AuthError, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export const fetchProductByName = async (
  name: string,
  supabase?: SupabaseClient,
): Promise<{
  data: Product | null;
  error: PostgrestError | null;
}> => {
  if (!supabase) {
    const cookieStore = cookies();
    supabase = createClient(cookieStore);
  }

  return supabase.from('products').select('*').eq('name', name).limit(1).single();
};

export const fetchProductById = async (
  id: string,
  supabase?: SupabaseClient,
): Promise<{
  data: Product | null;
  error: PostgrestError | null;
}> => {
  if (!supabase) {
    const cookieStore = cookies();
    supabase = createClient(cookieStore);
  }

  return supabase.from('products').select('*').eq('id', id).limit(1).single();
};

export const fetchSellingProductsByCategory = async (
  category: string,
  limit: number,
  supabase?: SupabaseClient,
): Promise<{
  data: Product[] | null;
  error: PostgrestError | Error | null;
}> => {
  if (supabase === undefined) {
    const cookieStore = cookies();
    supabase = createClient(cookieStore);
  }

  return supabase
    .from('products')
    .select('*')
    .contains('categories', [category === 'all' ? '' : category])
    .eq('sale_state', '판매중')
    .order('sold', { ascending: false })
    .limit(limit);
};
