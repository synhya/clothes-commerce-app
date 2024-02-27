import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import UpdateProfileForm from '@/components/page/user/update-profile-form';
import { notFound } from 'next/navigation';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    notFound();
  }

  return (
    <section className="h-fit rounded-md border p-4 shadow-xl shadow-border">
      <UpdateProfileForm email={profile?.email} name={profile?.name} phone={profile?.phone} />
    </section>
  );
};

export default Page;
