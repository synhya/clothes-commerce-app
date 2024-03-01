'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomerInfo, LineItem } from '@/lib/types';
import { z, ZodTypeAny } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel, FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import AddressFormField from '@/components/forms/address-form-field';
import TossWidget from '@/app/order/_components/toss-widget';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { isValidPhoneNumber } from 'react-phone-number-input/min';
import { shipmentMethodEnums } from '@/config/product';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: '이름은 2자 이상입니다.' })
    .max(20, { message: '이름은 20자 이하입니다.' })
    .regex(/^[가-힣a-zA-Z]+$/, { message: '이름은 한글 또는 영문으로 입력하세요.' }),
  phone: z.string().refine(isValidPhoneNumber, { message: "전화번호 형식이 잘못되었습니다." }),
  main_address: z.string({
    invalid_type_error: '주소를 입력해주세요.',
  }),
  extra_address: z.string().max(100, { message: '상세주소는 100자 이하입니다.' }),
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
};

export type InvoiceFormValues = z.infer<typeof formSchema>;

const InvoiceForm = ({
  lineItems,
  itemsPrice,
  customInfoFromUser,
  customerId,
  customerEmail,
}: Props) => {
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
    <section className="mb-6">
      <Form {...form}>
        <form className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="shipment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="shipment_method">
                  <div className="mb-4 text-xl font-semibold">배송방법</div>
                </FormLabel>
                <div className="border-b border-t-2 border-gray-200 py-4">
                  <div className="flex gap-2">
                    {shipmentMethodEnums.map((method, index) => (
                      <FormItem key={index} className="flex items-center gap-1">
                        <FormControl>
                          <Input
                            type="radio"
                            value={method}
                            checked={field.value == method}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="w-fit pb-1">{method}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />
          <div>
            <div className="mb-4 text-xl font-semibold">주문자 정보</div>
            <div className="border-b border-t-2 border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} defaultCountry="KR" international={false} />
                      </FormControl>
                      <FormDescription>결제에 사용됩니다 정확히 입력해주세요!</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AddressFormField
                  isMainAddress={false}
                  mainAddressName="main_address"
                  extraAddressName="extra_address"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4 mt-6 text-xl font-semibold">결제/예약</div>
            <div className="border-b border-t-2 border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <span>제품금액</span>
                  <span>{itemsPrice}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송료</span>
                  <span>+ {deliveryPrice}원</span>
                </div>
                <div className="flex justify-between">
                  <span>총 할인금액</span>
                  <span>- {0}원</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>총 결제금액</span>
                  <span className="text-lg">{itemsPrice + deliveryPrice}원</span>
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
  );
};

export default InvoiceForm;
