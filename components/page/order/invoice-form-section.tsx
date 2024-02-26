'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomerInfo, LineItem, shipmentMethodEnums } from '@/lib/types/database';
import { z, ZodTypeAny } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import AddressFormField from '@/components/page/address-form-field';
import TossWidget from '@/components/page/order/toss-widget';
import { MaskedInput } from '@/components/page/masked-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string()
    .min(2, { message: '이름은 2자 이상입니다.' })
    .max(20, { message: '이름은 20자 이하입니다.' })
    .regex(/^[가-힣a-zA-Z]+$/, { message: '이름은 한글 또는 영문으로 입력하세요.' }),
  phone: z.string()
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, { message: '전화번호는 010-1234-5678 형식입니다.' }),
  main_address: z.string({
    invalid_type_error: '주소를 입력해주세요.',
  }),
  extra_address: z.string()
    .max(100, { message: '상세주소는 100자 이하입니다.' }),
  shipment_method: z.enum(shipmentMethodEnums, {
    invalid_type_error: '색상을 선택 해주세요.',
  }),
} satisfies Record<keyof CustomerInfo | 'shipment_method', ZodTypeAny>);

type Props = {
  lineItems: LineItem[];
  itemsPrice: number;
  customInfoFromUser?: Partial<CustomerInfo>;
  customerId: string;
  customerEmail: string;
}

export type InvoiceFormValues = z.infer<typeof formSchema>;

const InvoiceFormSection = ({ lineItems, itemsPrice, customInfoFromUser, customerId, customerEmail }: Props) => {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...customInfoFromUser,
      shipment_method: '택배배송',
    },
  });
  const deliveryPrice = itemsPrice < 50000 ? 3500 : 0;
  const [price, setPrice] = useState(itemsPrice + deliveryPrice);

  return (
    <section className='mb-6'>
      <Form {...form}>
        <form className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='shipment_method'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='shipment_method'>
                  <div className='text-xl font-semibold mb-4'>배송방법</div>
                </FormLabel>
                <div className='border-t-2 border-b border-gray-200 py-4'>
                  <div className='flex gap-2'>
                    {shipmentMethodEnums.map((method, index) => (
                      <FormItem key={index} className='flex items-center gap-1'>
                        <FormControl>
                          <Input
                            type='radio'
                            value={method} checked={field.value == method}
                            onChange={field.onChange}
                            className='h-4 w-4'
                          />
                        </FormControl>
                        <FormLabel className='pb-1 w-fit'>{method}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div>
            <div className='text-xl font-semibold mb-4'>주문자 정보</div>
            <div className='border-t-2 border-b border-gray-200 py-4'>
              <div className='flex flex-col space-y-4'>
                <FormField name='name' control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField name='phone' control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask='phone'/>
                    </FormControl>
                    <FormDescription>결제에 사용됩니다 정확히 입력해주세요!</FormDescription>
                  </FormItem>
                )} />
                <AddressFormField isMainAddress mainAddressName='main_address' extraAddressName='extra_address' />
              </div>
            </div>
          </div>
          <div>
            <div className='text-xl font-semibold mb-4'>결제/예약</div>
            <div className='border-t-2 border-b border-gray-200 py-4'>
              <div className='flex flex-col space-y-4'>
                <div className='flex justify-between'>
                  <span>제품금액</span>
                  <span>{itemsPrice}원</span>
                </div>
                <div className='flex justify-between'>
                  <span>배송료</span>
                  <span>+ {deliveryPrice}원</span>
                </div>
                <div className='flex justify-between'>
                  <span>총 할인금액</span>
                  <span>- {0}원</span>
                </div>
                <div className='flex justify-between font-semibold'>
                  <span>총 결제금액</span>
                  <span className='text-lg'>{itemsPrice + deliveryPrice}원</span>
                </div>
                <TossWidget
                  customerKey={customerId}
                  price={price}
                  orderName={customerId + ' 주문'}
                  customerEmail={customerEmail}
                  lineItems={lineItems}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
    ;
};

export default InvoiceFormSection;
