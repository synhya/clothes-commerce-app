'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import type { PaymentWidgetInstance } from '@tosspayments/payment-widget__types';
import { useQuery } from 'react-query';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { BASE_URL } from '@/lib/paths';
import { PaymentRequestParameters } from '@tosspayments/payment-widget__types/types/types/widget';
import { useFormContext } from 'react-hook-form';
import { checkoutAction } from '@/lib/actions/checkout-actions';
import { InvoiceFormValues } from '@/components/page/order/invoice-form-section';
import { LineItem } from '@/lib/types/database';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const clientKey = 'test_ck_DnyRpQWGrNWDKpYjAxWO8Kwv1M9E';

function usePaymentWidget (clientKey: string, customerKey: string) {
  return useQuery({
    queryKey: ['payment-widget', clientKey, customerKey],
    queryFn: () => {
      // ------  결제위젯 초기화 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
      return loadPaymentWidget(clientKey, customerKey);
    },
  });
}

type TossWidgetProps = {
  customerKey: string;
  price: number;
  orderName: string,
  customerEmail: string,
  lineItems: LineItem[],
};

const TossWidget = ({
  customerKey, price, lineItems, ...orderInfo
}: TossWidgetProps) => {
  const { data: paymentWidget } = usePaymentWidget(clientKey, customerKey);
  const pathname = usePathname();
  const { handleSubmit } = useFormContext();

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    // ------  결제위젯 렌더링 ------
    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      '#payment-widget',
      { value: price },
      { variantKey: 'DEFAULT' },
    );

    // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
    paymentWidget.renderAgreement('#agreement', {
      variantKey: 'AGREEMENT',
    });

  }, [paymentWidget]);

  // http://localhost:3000/api/auth/callback/kakao
  //   https://jang-admin-app.vercel.app/api/auth/callback/kakao

  // useEffect(() => {
  //   const paymentMethodsWidget = paymentMethodsWidgetRef.current;
  //
  //   if (paymentMethodsWidget == null) {
  //     return;
  //   }
  //
  //   // ------ 금액 업데이트 ------
  //   // @docs https://docs.tosspayments.com/reference/widget-sdk#updateamount결제-금액
  //   paymentMethodsWidget.updateAmount(price);
  // }, [price]);

  const onSubmit = async (data: InvoiceFormValues) => {
    console.log('결제 처리');

    const formData = {
      ...data,
      lineItems: JSON.stringify(lineItems),
      total_price: price.toString(),
    };

    const { data: invoice, error } = await checkoutAction(formData);

    if (error) {
      console.log(error);
      return;
    }

    await handlePayment(invoice.id, data.name, data.phone);
  };

  const handlePayment = async (invoiceId: string, name: string, phone: string) => {
    try {
      // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
      await paymentWidget?.requestPayment({
        orderName: orderInfo.orderName,
        customerEmail: orderInfo.customerEmail,
        customerName: name,
        customerMobilePhone: phone,
        orderId: invoiceId,
        successUrl: BASE_URL + pathname + '/success',
        failUrl: BASE_URL + pathname + '/fail',
      });
    } catch (error) {
      // 에러 처리하기
      console.error(error);
    }
  };

  return (
    <>
      <div id='payment-widget' style={{ width: '100%' }} />
      <div id='agreement' style={{ width: '100%' }} />
      <div className='bg-white flex justify-center pb-6'>
        <Button
          variant='secondary'
          size='lg'
          onClick={handleSubmit(onSubmit)}
        >
          결제하기
        </Button>
      </div>
    </>
  )
};

export default TossWidget;
