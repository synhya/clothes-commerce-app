'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { checkoutAction } from '@/lib/actions/checkout';
import { InvoiceFormValues } from '@/components/forms/invoice-form';
import { LineItem } from '@/lib/types';
import { usePaymentWidget } from '@/lib/hooks/useTossWidget';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

type TossWidgetProps = {
  customerKey: string;
  price: number;
  orderName: string;
  customerEmail: string;
  lineItems: LineItem[];
};

const TossWidget = ({ customerKey, price, lineItems, ...orderInfo }: TossWidgetProps) => {
  const pathname = usePathname();
  const { handleSubmit, trigger } = useFormContext();
  const { data: paymentWidget } = usePaymentWidget(customerKey);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedClose = useDebouncedCallback(async () => {
    setIsOpen(false);
  }, 1000);
  
  const delayedWidgetRendering = useCallback(
    async (ms: number) => await new Promise((res) => setTimeout(res, ms)).then(
      () => {
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
      }
    ),
    [paymentWidget, price],
  );

  useEffect(() => {
    if (paymentWidget == null || !isOpen) {
      return;
    }

    delayedWidgetRendering(100);
  }, [paymentWidget, isOpen]);

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
      await Promise.all([
        debouncedClose(),
        paymentWidget?.requestPayment({
          orderName: orderInfo.orderName,
          customerEmail: orderInfo.customerEmail,
          customerName: name,
          customerMobilePhone: phone.replace('+82', '0'),
          orderId: invoiceId,
          successUrl: env.NEXT_PUBLIC_APP_URL + pathname + '/success',
          failUrl: env.NEXT_PUBLIC_APP_URL + pathname + '/fail',
        })])
    } catch (error) {
      // 에러 처리하기
      console.error(error);
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="secondary"
        size="lg"
        type="button"
        onClick={async () => {
          trigger().then((result) => {
            if (result) {
              setIsOpen(true);
            }
          });
        }}
      >
        결제하기
      </Button>
      <DialogContent className={cn('h-fit bg-white')}>
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
