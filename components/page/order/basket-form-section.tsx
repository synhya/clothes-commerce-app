'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BasketInfo } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import BasketItem from '@/components/page/order/basket-item';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { revalidatePath } from 'next/cache';
import { redirect, useRouter } from 'next/navigation';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { deleteBasketItem, updateBasketItem } from '@/lib/actions/basket-actions';

const FormSchema = z.object({
  selectedItems: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: '장바구니에서 상품을 선택해주세요.',
  }),
});
type FormValues = z.infer<typeof FormSchema>;
const BasketFormSection = ({
  basketInfo,
}: { basketInfo: BasketInfo[] }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedItems: Array.from(basketInfo, (item) => item.id),
    },
  });
  const [price, setPrice] = useState(
    basketInfo.reduce((acc, item) => acc + item.price, 0),
  );
  const supabase = createClient();
  const router = useRouter();

  const handleItemDelete = async (id: string) => {
    await deleteBasketItem(id);
    form.setValue('selectedItems',
      form.getValues('selectedItems').filter((value) => value !== id));
  };

  const onSubmit = async (data: FormValues) => {
    const res = await updateBasketItem(JSON.stringify(data.selectedItems));
  };

  return (
    <section className='mx-4 md:mx-10 flex flex-col lg:flex-row gap-6'>
      <Form {...form}>
        <div className='flex-grow'>
          <h2 className='text-xl font-semibold mb-4'>상품목록</h2>
          <ScrollArea className='h-[600px] rounded-md border px-4 shadow-xl shadow-border'>
            {basketInfo.map((item, index) => {
              const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(item.image_url);
              return (
                <FormField
                  key={index}
                  name='selectedItems'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center gap-1 md:gap-4'>
                        <FormControl>
                          <Checkbox
                            className='md:size-6'
                            checked={field.value.includes(item.id)}
                            onCheckedChange={(checked) => {
                              setPrice(checked ? price + item.price : price - item.price);

                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                  field.value.filter((value) => value !== item.id),
                                );
                            }}
                          />
                        </FormControl>
                        <div className='w-full'>
                          <BasketItem
                            imageUrl={publicUrl}
                            productName={item.name}
                            selectedColor={item.selected_color}
                            selectedSize={item.selected_size}
                            price={item.price}
                            quantity={item.quantity}
                          />
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='destructive' size='sm'>삭제</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>삭제하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>
                                삭제하시면 복구가 불가능합니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => await handleItemDelete(item.id)}
                              >삭제</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      {index < basketInfo.length - 1 && <Separator />}
                    </FormItem>
                  )}
                />
              );
            })}
            {basketInfo.length == 0 && (
              <div className='flex flex-col gap-2 justify-center items-center h-[600px]'>
                <ExclamationTriangleIcon className='w-10 h-10 text-amber-400' />
                <p className='font-semibold text-xl animated-underline'>장바구니가 비어있습니다.</p>
              </div>
            )}
          </ScrollArea>
        </div>
        <div className="lg:basis-1/4">
          <h2 className='text-xl font-semibold mb-4'>주문표</h2>
          <FormField
            name='selectedItems'
            control={form.control}
            render={({ field }) => (
              <Card className="rounded-md p-4 mb-10 shadow-border shadow-xl">
                <p className='text-lg font-semibold mb-4'>총 상품금액</p>
                <p className='text-lg font-semibold mb-4'>{price}원</p>
                <FormMessage className="mb-4"/>
                <Button size='lg' onClick={form.handleSubmit(onSubmit)}>주문하기</Button>
              </Card>
            )} />
        </div>
      </Form>
    </section>
  );
};

export default BasketFormSection;
