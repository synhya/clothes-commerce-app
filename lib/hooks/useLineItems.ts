import { LineItem } from '@/lib/types';
import { create } from 'zustand';

const useLineItems = create<{
  lineItems: LineItem[];
  addLineItem: (lineItem: LineItem) => void;
  removeLineItem: (id: string) => void;
}>((set) => ({
  lineItems: [],
  addLineItem: (lineItem) =>
    set((state) => ({
      lineItems: [...state.lineItems, lineItem],
    })),
  removeLineItem: (id) =>
    set((state) => ({
      lineItems: state.lineItems.filter((item) => item.product_id !== id),
    })),
}));

export default useLineItems;
