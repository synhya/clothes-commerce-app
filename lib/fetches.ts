import { Profile, Product } from '@/lib/types/database';
import { AuthError, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

// fails if not logged in
export const fetchProfileById = async (
  userId: string,
  supabase: SupabaseClient,
): Promise<{
  data: Profile | null;
  error: PostgrestError | Error | null;
}> => {
  return new Promise((resolve) => {
    supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) {
          resolve({ data: null, error: error });
        }
        if (data === null) {
          resolve({ data: null, error: new Error('No profile found') });
        }
        resolve({ data: data, error: null });
      });
  });
};

export const fetchProductByName = async (
  name: string,
  supabase: SupabaseClient,
): Promise<{
  data: Product | null;
  error: PostgrestError | null;
}> => {
  return supabase.from('products').select('*').eq('name', name).limit(1).single()
}


export const fetchProductsByCategory = async (
  category: string,
  supabase: SupabaseClient,
): Promise<{
  data: Product[] | null;
  error: PostgrestError | Error | null;
}> => {
  return new Promise((resolve) => {
    supabase
      .from('products')
      .select()
      .contains('categories', category)
      .then(({ data, error }) => {
        if (error) {
          resolve({ data: null, error: error });
        }
        resolve({ data: data, error: null });
      });
  });
};