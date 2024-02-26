import { useQuery } from 'react-query';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';

const clientKey = 'test_ck_DnyRpQWGrNWDKpYjAxWO8Kwv1M9E';

export function usePaymentWidget (customerKey: string) {
  return useQuery({
    queryKey: ['payment-widget', clientKey, customerKey],
    queryFn: () => {
      // ------  결제위젯 초기화 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
      return loadPaymentWidget(clientKey, customerKey);
    },
  });
}
