import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotFoundAlertDialog from '@/components/page/shared/not-fount-alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import InvoicesTable from '@/components/page/shared/invoices-table';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: orders, error: ordersError } = await supabase
    .from('invoices')
    .select('*')
    .neq('state', '결제대기');

  return (
    <ScrollArea className="mx-2 my-10 h-[600px] rounded-md border shadow-xl shadow-border md:mx-10">
      <InvoicesTable invoices={orders} />
    </ScrollArea>
  );
};

export default Page;
