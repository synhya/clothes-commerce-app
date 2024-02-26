import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotFoundAlertDialog from '@/components/page/not-fount-alert-dialog';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    return <NotFoundAlertDialog description='로그인이 필요합니다' additionalLink={
      { href: '/user/login', label: '로그인' }
    } />;
  }

  return (
    <div>
      <h1>주문내역</h1>
    </div>
  );
};

export default Page;
