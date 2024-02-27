import { LineItem } from '@/lib/types/database';
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

// Multistep form example

// import { StepOneData, StepThreeData, StepTwoData } from '@/types';
//
// const stepVariant = {
//   1: 'stepOne',
//   2: 'stepTwo',
//   3: 'stepThree',
// };
//
// type setDataType =
//   | { step: 1; data: StepOneData }
//   | { step: 2; data: StepTwoData }
//   | { step: 3; data: StepThreeData };
//
// const useFormStore = create<{
//   stepOne: StepOneData | null;
//   stepTwo: StepTwoData | null;
//   stepThree: StepThreeData | null;
//   setData: ({ step, data }: setDataType) => void;
// }>(
//   devtools((set) => ({
//     stepOne: null,
//     stepTwo: null,
//     stepThree: null,
//     setData: ({ step, data }) =>
//       set((state) => ({
//         ...state,
//         [stepVariant[step]]: data,
//       })),
//   }))
// );
