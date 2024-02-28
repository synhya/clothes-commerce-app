import React from 'react';
import OrderItemsSection from '@/components/page/order/order-items-section';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import BasketItem from '@/components/page/order/basket-item';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import BasketForm from '@/components/forms/basket-form';
import NotFoundAlertDialog from '@/components/page/not-fount-alert-dialog';

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
        additionalLink={{ href: '/user/login', title: '로그인' }}
      />
    );
  }

  const { data: basketInfo, error } = await supabase
    .from('basket_info')
    .select('*')
    .eq('profile_id', user.id);

  return <BasketForm basketInfo={basketInfo} />;
};

export default Page;
