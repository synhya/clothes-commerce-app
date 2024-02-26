import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { productDataToCardData } from '@/lib/utils';
import { Product } from '@/lib/types/database';
import TrendingClothes from '@/components/page/trending-clothes';

// ------ Payment 객체 ------
// @docs https://docs.tosspayments.com/reference#payment-객체
interface Payment {
  orderName: string;
  approvedAt: string;
  receipt: {
    url: string;
  };
  totalAmount: number;
  method: '카드' | '가상계좌' | '계좌이체';
  paymentKey: string;
  orderId: string;
}

const fetchPayment = async (
  paymentKey: string, orderId: string, amount: string,
): Promise<Payment> => {
  try {
    const { data: payment } = await axios.post<Payment>(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.TOSS_SECRET_KEY}:`,
          ).toString('base64')}`,
        },
      },
    );

    return payment;
  } catch (error) {
    console.error(error);
    throw new Error('결제 정보를 가져오는데 실패했습니다.');
  }
};

const Page = async ({
  searchParams,
}: {
  searchParams: {
    paymentKey: string, orderId: string, amount: string
  }
}) => {
  const { paymentKey, orderId, amount } = searchParams;
  const cookieStore = cookies();

  const payment = await fetchPayment(paymentKey, orderId, amount);

  const supabase = createClient(cookieStore);
  const { data: basketData } = await supabase.from('invoice_products')
    .select('basket_id').eq('invoice_id', payment.orderId);

  basketData.map(async ({basket_id}) => {
    const { error: deleteError } = await supabase.from('basket')
      .delete().eq('id', basket_id);

    if (deleteError) {
      console.error(deleteError);
      // show toast instead of throwing error
    }
  });

  const { error: invoiceError } = await supabase.from('invoices')
    .update({state: '결제완료'}).eq('id', payment.orderId);

  if (invoiceError) {
    console.error(invoiceError);
    throw new Error('주문 상태를 변경하는데 실패했습니다. 관리자에게 문의해주세요.');
  }

  const {
    data: trendingProducts,
    error: trendingFetchError,
  } = await supabase.from('products').select('*').limit(5).order('sold', { ascending: false });

  const trendingClothes = trendingProducts.map((product) => {
    return productDataToCardData(product as Product, supabase);
  });

  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='h-[400px] flex flex-col justify-center items-center gap-10'>
        <h2 className='text-4xl font-semibold'>
          🎉 결제 성공 🎉
        </h2>
        <div className='grid grid-cols-2 gap-8'>
          <Button variant='default' size='lg' asChild>
            <Link href='/category/all'>쇼핑 계속하기</Link>
          </Button>
          <Button variant='default' size='lg' asChild>
            <Link href='/order/list'>주문 내역</Link>
          </Button>
        </div>
      </div>
      <div>
        {!trendingFetchError && <TrendingClothes trendingClothes={trendingClothes} />}
      </div>
    </div>
  );
};

export default Page;
