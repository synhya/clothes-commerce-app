'use client';
import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Image } from '@nextui-org/react';
import { Enums, Product, productSaleState } from '@/lib/types/database';
import { z, ZodTypeAny } from 'zod';
import { createProduct } from '@/lib/actions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import HashtagFormField from '@/components/page/admin/hashtag-form-field';
import { CategoryFormField, SizeFormField } from '@/components/page/admin/multiselect-form-field';
import DropzoneFormField from '@/components/page/admin/dropzone-form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CurrencyInput from 'react-currency-input-field';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const addProductFormSchema = z.object({
  name: z.string({
    required_error: '상품명을 입력해주세요.',
  }).min(1, { message: '상품명은 1자 이상입니다.' })
    .max(100, { message: '상품명은 100자 이하입니다.' }),

  price: z.coerce.number({
    required_error: '가격을 입력해주세요.',
  }).positive('가격은 양수입니다.').int('가격은 정수입니다.'),
  description: z.string({
    required_error: '상품 설명을 입력해주세요.',
  }),
  // z.array(z.string()) equals z.string().array()
  // z.string().optional().array(); // (string | undefined)[]
  // z.string().array().optional(); // string[] | undefined
  categories: z.string().array()
    .min(1, { message: '카테고리를 한개 이상 선택해주세요' }),
  tags: z.object({
    value: z
      .string({
        required_error: '태그를 입력해주세요.',
      })
      .min(1, { message: '태그를 입력해주세요.' }),
  }).array(),
  available_sizes: z.custom<Enums['product_size']>().array()
    .min(1, { message: '사이즈를 한개 이상 선택해주세요' }),
  available_colors: z.object({
    value: z
      .string({
        required_error: '색상을 입력해주세요.',
      })
      .min(1, { message: '색상을 입력해주세요.' }),
  }).array(),
  imageFiles: z.custom<FileList>(),
  sale_state: z.enum(productSaleState),
} satisfies Record<keyof Omit<Product, 'id' | 'image_url' | 'created_at' | 'updated_at'> | 'imageFiles', ZodTypeAny>);

export type ProductFormSchema = z.infer<typeof addProductFormSchema>;

const currentcyFormat = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW"
});

const AddProductForm = () => {
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: '검은 청바지',
      price: 10000,
      description: '옷입니다',
      categories: ['top'],
      tags: [{ value: 'new' }],
      available_sizes: ['md'],
      available_colors: [{ value: 'black' }, { value: 'white'}],
      sale_state: '판매중',
    },
  });
  const onSubmit: SubmitHandler<ProductFormSchema> = async (data) => {

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('categories', JSON.stringify(data.categories));
    formData.append('tags', JSON.stringify(data.tags.map((tag) => tag.value)));
    formData.append('available_sizes', JSON.stringify(data.available_sizes));
    formData.append('available_colors', JSON.stringify(data.available_colors.map((color) => color.value)));
    formData.append('sale_state', data.sale_state);
    if (!data.imageFiles) {
      // for (const file of Array.from(data.imageFiles)) {
      //   formData.append('imageFiles', file);
      // }
      toast({
        title: '알림',
        description: '이미지가 없습니다.',
      });
      return;
    }

    formData.append('imageFile', data.imageFiles[0] as Blob);

    const error = await createProduct(formData);
    if (error) {
      toast({
        title: '알림',
        description: error,
      });
      return;
    }

    // also show toast
    toast({
      title: '알림',
      description: '상품이 추가되었습니다.',
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-[400px] space-y-8 lg:space-y-0 lg:gap-y-8 lg:grid lg:w-[800px] lg:grid-cols-2 lg:gap-x-6'
        >
          <FormField
            control={form.control}
            name='name'
            // rules={{
            //   required: '상품명을 입력해주세요.',
            //   minLength: { value: 1, message: '상품명은 1자 이상입니다.' },
            //   maxLength: { value: 100, message: '상품명은 100자 이하입니다.' },
            // }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>상품명</FormLabel>
                <FormControl>
                  <Input placeholder='상품 이름을 입력해주세요' {...field} />
                </FormControl>
                <FormDescription>상품 이름을 입력해주세요.</FormDescription>
                <FormMessage className="font-semibold"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            // rules={{
            //   required: '가격을 입력해주세요.',
            //   validate: {
            //     positive: (value) => value > 0 || '가격은 0원 이상입니다.',
            //     integer: (value) => Number.isInteger(value) || '가격은 정수입니다.',
            //   },
            // }}
            render={({ field: {onChange, value, ref, onBlur}}) => (
              <FormItem className="max-w-[200px]">
                <FormLabel>가격</FormLabel>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-sm">₩</span>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='가격을 입력해주세요'
                      {...{onChange, value, ref, onBlur}}
                      className="pl-8"
                    />
                  </FormControl>
                </div>
                <FormMessage className="font-semibold"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='lg:col-span-2'>

                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea {...field} className='min-h-[100px]' />
                </FormControl>
                <FormMessage className="font-semibold"/>
              </FormItem>
            )}
          />
          <CategoryFormField />
          <SizeFormField />
          <HashtagFormField arrayPath={'tags'} label='태그' />
          <HashtagFormField arrayPath={'available_colors'} label='색상' />
          <DropzoneFormField />
          <div className="pt-1.5">
            <FormField
              control={form.control}
              name='sale_state'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>판매상태</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="판매상태를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productSaleState.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-semibold"/>
                </FormItem>
              )}
            />
            <Button className='mt-3 w-full' type='submit'>
              상품 추가
            </Button>
          </div>
        </form>
      </Form>
      <Toaster />
    </>
  );
};

// price: z.number(),
//   description: z.string(),
//   categories: z.array(z.string()),
//   tags: z.array(z.string()),
//   available_sizes: z.array(z.custom<Enums['product_size']>()),
//   available_colors: z.array(z.string()),

export default AddProductForm;
