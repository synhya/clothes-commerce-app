// fails if not logged in
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export async function fetchProfileByEmail(email: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase.from('profiles').select().eq('email', email).limit(1).single();
  return data;
}

export async function fetchProfileById(
  userId: string,
  supabase: SupabaseClient,
): Promise<{
  data: Profile | null;
  error: PostgrestError | Error | null;
}> {
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
}
