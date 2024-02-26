import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotFoundAlertDialog from '@/components/page/not-fount-alert-dialog';
import { LOGIN_PATH } from '@/lib/paths';
import InvoiceFormSection from '@/components/page/order/invoice-form-section';
import OrderItemsSection from '@/components/page/order/order-items-section';
import { basketInfoToLineItem } from '@/lib/utils';

const Page = async ({
  searchParams: {
    basketId,
  },
}: {
  searchParams: {
    basketId?: string;
  }
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    // not logged in
    // show dialog and redirect to login page
    return <NotFoundAlertDialog
      additionalLink={{ href: LOGIN_PATH, label: '로그인페이지로' }}
      description='로그인이 필요합니다.'
    />;
  }

  const { data: basketInfos, error: basketError } = basketId ?
    await supabase.from('basket_info').select('*')
      .eq('id', basketId).eq('is_selected', true) :
    await supabase.from('basket_info').select('*')
      .eq('profile_id', user.id).eq('is_selected', true);

  if (basketError || basketInfos.length === 0) {
    // show alert dialog and return
    return <NotFoundAlertDialog description='해당 장바구니가 없습니다.' />;
  }

  const totalPrice = basketInfos.reduce((acc, current) => acc + current.price * current.quantity, 0);

  const { data: profileInfo, error: profileError } =
    await supabase.from('profile_info').select('*').eq('id', user.id).single();

  return (
    <div className='max-w-2xl lg:max-w-6xl px-4 sm:px-10 mx-auto my-10'>
      <div className='text-3xl font-bold mb-6'>주문서작성</div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <OrderItemsSection basketInfos={basketInfos} totalPrice={totalPrice} />
        <InvoiceFormSection
          lineItems={basketInfos.map((info) => (basketInfoToLineItem(info)))}
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

