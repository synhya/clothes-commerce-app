import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotFoundAlertDialog from '@/components/not-fount-alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import InvoicesTable from '@/components/invoices-table';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <NotFoundAlertDialog
        description="로그인이 필요합니다"
        additionalLink={{ href: '/sign-in', title: '로그인' }}
      />
    );
  }

  const { data: orders, error: ordersError } = await supabase
    .from('invoices')
    .select('*')
    .eq('profile_id', user.id)
    .eq('state', '결제완료')
    .order('created_at', { ascending: false });

  return (
    <ScrollArea className="mx-2 my-10 h-[600px] rounded-md border shadow-xl shadow-border md:mx-10">
      <InvoicesTable invoices={orders} />
    </ScrollArea>
  );
};

export default Page;
