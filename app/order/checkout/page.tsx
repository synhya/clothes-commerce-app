import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotFoundAlertDialog from '@/components/not-fount-alert-dialog';
import InvoiceForm from '@/components/forms/invoice-form';
import OrderItemsSection from '@/app/order/_components/order-items-section';
import { basketInfoToLineItem } from '@/lib/utils';
import { Route } from 'next';

const Page = async ({
  searchParams: { basketId },
}: {
  searchParams: {
    basketId?: string;
  };
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    // not logged in
    // show dialog and redirect to login page
    return (
      <NotFoundAlertDialog
        additionalLink={{ href: '/sign-in' satisfies Route, title: '로그인페이지로' }}
        description="로그인이 필요합니다."
      />
    );
  }

  const { data: basketInfos, error: basketError } = basketId
    ? await supabase.from('basket_info').select('*').eq('id', basketId).eq('is_selected', true)
    : await supabase
        .from('basket_info')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_selected', true);

  if (basketError || basketInfos.length === 0) {
    // show alert dialog and return
    return <NotFoundAlertDialog description="해당 장바구니가 없습니다." />;
  }

  const totalPrice = basketInfos.reduce(
    (acc, current) => acc + current.price * current.quantity,
    0,
  );

  const { data: profileInfo, error: profileError } = await supabase
    .from('profile_info')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="mx-auto my-10 max-w-2xl px-4 sm:px-10 lg:max-w-6xl">
      <div className="mb-6 text-3xl font-bold">주문서작성</div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrderItemsSection basketInfos={basketInfos} totalPrice={totalPrice} />
        <InvoiceForm
          lineItems={basketInfos.map((info) => basketInfoToLineItem(info))}
          itemsPrice={totalPrice}
          customInfoFromUser={profileInfo}
          customerId={user.id}
          customerEmail={user.email}
        />
      </div>
    </div>
  );
};

export default Page;
