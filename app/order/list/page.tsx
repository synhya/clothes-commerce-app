import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotFoundAlertDialog from '@/components/page/not-fount-alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    return <NotFoundAlertDialog description='로그인이 필요합니다' additionalLink={
      { href: '/user/login', label: '로그인' }
    } />;
  }

  const { data: orders, error: ordersError } = await supabase.from('invoices')
    .select('*').eq('profile_id', user.id).eq('state', '결제완료');

  return (
    <ScrollArea className="mx-2 md:mx-10 my-10 border shadow-border shadow-xl rounded-md h-[600px]">
      <table className="w-full">
        <thead>
        <tr>
          <th>주문일자</th>
          <th>배송방법</th>
          <th>배송주소</th>
          <th>총 주문금액</th>
        </tr>
        </thead>
        <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.created_at}</td>
            <td>{order.shipment_method}</td>
            <td>{order.customer_info.main_address}</td>
            <td>{order.total_price}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};

export default Page;
