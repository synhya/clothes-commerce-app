import { CheckoutActionProps } from '@/lib/actions/checkout-actions';
import { create } from 'zustand';

const useCheckoutProps = create<{
  checkoutProps: CheckoutActionProps;
  setCheckoutProps: (props: CheckoutActionProps) => void;
}>((set) => ({
  checkoutProps: null,
  setCheckoutProps: (props) => set({ checkoutProps: props }),
}));

export default useCheckoutProps;
