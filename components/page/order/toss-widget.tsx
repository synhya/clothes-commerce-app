'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { BASE_URL } from '@/lib/paths';
import { useFormContext } from 'react-hook-form';
import { checkoutAction } from '@/lib/actions/checkout-actions';
import { InvoiceFormValues } from '@/components/page/order/invoice-form-section';
import { LineItem } from '@/lib/types/database';
import { usePaymentWidget } from '@/lib/hooks/useTossWidget';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type TossWidgetProps = {
  customerKey: string;
  price: number;
  orderName: string;
  customerEmail: string;
  lineItems: LineItem[];
};

const TossWidget = ({ customerKey, price, lineItems, ...orderInfo }: TossWidgetProps) => {
  const pathname = usePathname();
  const { handleSubmit } = useFormContext();
  const { data: paymentWidget } = usePaymentWidget(customerKey);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (paymentWidget == null || !isOpen) {
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
  }, [paymentWidget, isOpen]);

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
        customerMobilePhone: phone.replace(/-/g, ''),
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
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          결제하기
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit bg-white">
        <div className="min-h-[480px]">
          <div id="payment-widget" style={{ width: '100%' }} />
          <div id="agreement" style={{ width: '100%' }} />
        </div>
        <div className="flex justify-center bg-white pb-6">
          <Button variant="secondary" size="lg" onClick={handleSubmit(onSubmit)}>
            결제하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TossWidget;
