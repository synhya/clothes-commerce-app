import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import UpdateProfileForm from '@/components/forms/update-profile-form';
import { notFound } from 'next/navigation';
import NotFoundAlertDialog from '@/components/page/not-fount-alert-dialog';
import { Route } from 'next';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return <NotFoundAlertDialog description="로그인이 필요합니다." additionalLink={
      { href: '/user/login' satisfies Route, title: '로그인' }
    } />;
  }

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
