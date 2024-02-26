'use client';
import React, { useRef } from 'react';
import Script from 'next/script';
import { PaymentWidgetInstance } from '@tosspayments/payment-widget__types';
import { BASE_URL } from '@/lib/paths';
import PaymentWidget from '@tosspayments/payment-widget__types/types/Widget';

const TossWidgetScript = () => {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);

  return (
    <>
      <div id='payment-method'></div>
      <div id='agreement'></div>
      <button
        id='payment-button'
        onClick={async () => {
          console.log('결제하기 버튼 클릭');
          await paymentWidgetRef.current?.requestPayment({
            orderId: '1W_pCfO4rzG9szJEcThKe',
            orderName: '토스 티셔츠 외 2건',
            successUrl: BASE_URL + '/order/payment/success',
            failUrl: BASE_URL + '/order/payment/fail',
            customerEmail: 'customer123@gmail.com',
            customerName: '김토스',
            customerMobilePhone: '01012341234',
          });
        }}
      >결제하기
      </button>
      <Script
        src='https://js.tosspayments.com/v1/payment-widget'
        onLoad={() => {
          const button = document.getElementById('payment-button');

          // 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요.
          // 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
          const widgetClientKey = 'test_ck_DnyRpQWGrNWDKpYjAxWO8Kwv1M9E';
          const customerKey = 'AYV3rh8qd4vcBIPxpH06N';
          const paymentWidget = PaymentWidget(widgetClientKey, customerKey); // 회원 결제
          // const paymentWidget = PaymentWidget(widgetClientKey, PaymentWidget.ANONYMOUS) // 비회원 결제
          paymentWidgetRef.current = paymentWidget;

          const paymentMethodWidget = paymentWidget.renderPaymentMethods(
            '#payment-method',
            { value: 50000 },
            { variantKey: 'DEFAULT' },
          );

          paymentWidget.renderAgreement(
            '#agreement',
            { variantKey: 'AGREEMENT' },
          );
        }}
      />
    </>
  );
};

export default TossWidgetScript;
