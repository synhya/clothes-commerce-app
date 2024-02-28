'use client';
import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DBEnums, productSaleState, ProductSubmit } from '@/lib/types/database';
import { z, ZodTypeAny } from 'zod';
import { createProduct, deleteProduct, updateProduct } from '@/lib/actions/product';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import HashtagFormField from '@/components/forms/hashtag-form-field';
import { CategoryFormField, SizeFormField } from '@/components/forms/multiselect-form-field';
import DropzoneFormField from '@/components/forms/dropzone-form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { productSchema } from '@/lib/validations/product';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export type Inputs = z.infer<typeof productSchema>;

const currentcyFormat = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
});

type ProductFormProps = {
  defaultValues?: Partial<Inputs>;
  defaultImageUrl?: string;
  action: 'create' | 'modify';
  productId?: string;
};

const ProductForm = ({ defaultValues, defaultImageUrl, action, productId }: ProductFormProps) => {
  const form = useForm<Inputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || '티셔츠',
      price: defaultValues?.price || 10000,
      description: defaultValues?.description || '시원한 티셔츠',
      categories: defaultValues?.categories || ['top'],
      tags: defaultValues?.tags || [{ value: 'new' }],
      available_sizes: defaultValues?.available_sizes || ['md'],
      available_colors: defaultValues?.available_colors || [{ value: 'black' }, { value: 'white' }],
      sale_state: defaultValues?.sale_state || '판매중',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'imageFiles') {
        if(value)
          formData.append('imageFile', (value as FileList)[0] as Blob);
      } else if (key === 'categories' || key === 'available_sizes') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'tags' || key === 'available_colors') {
        formData.append(key, JSON.stringify((value as { value: string }[]).map((tag) => tag.value)));
      } else {
        formData.append(key, value.toString());
      }
    });

    if (action == 'create' && !data.imageFiles) {
      toast('알림', { description: '이미지가 없습니다' });
      return;
    }
    if (action == 'modify') {
      if (!productId) {
        toast('경고',{ description: '상품 id가 없습니다.' });
        return;
      }
      formData.append('id', productId);
    }

    if (data.imageFiles) formData.append('imageFile', data.imageFiles[0] as Blob);

    const error = action == 'create' ? await createProduct(formData) : await updateProduct(formData);

    if (error) {
      toast('알림', { description: error });
      return;
    }

    // also show toast
    toast('알림', {
      description: `상품이 ${action == 'create' ? '추가' : '수정'}되었습니다.`,
    });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!productId) {
      toast('경고',{ description: '상품 id가 없습니다.' });
      return;
    }
    const error = await deleteProduct(productId);

    if (error) {
      toast('알림',{ description: '상품 삭제에 실패했습니다.' });
      return;
    }

    toast('알림', { description: '상품이 삭제되었습니다.' });
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-[400px] space-y-8 lg:grid lg:max-w-[800px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8 lg:space-y-0'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>상품명</FormLabel>
                <FormControl>
                  <Input placeholder='상품 이름을 입력해주세요' {...field} />
                </FormControl>
                <FormDescription>상품 이름을 입력해주세요.</FormDescription>
                <FormMessage className='font-semibold' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            render={({ field: { onChange, value, ref, onBlur } }) => (
              <FormItem className='max-w-[200px]'>
                <FormLabel>가격</FormLabel>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 transform text-sm'>
                    ₩
                  </span>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='가격을 입력해주세요'
                      {...{ onChange, value, ref, onBlur }}
                      className='pl-8'
                    />
                  </FormControl>
                </div>
                <FormMessage className='font-semibold' />
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
                <FormMessage className='font-semibold' />
              </FormItem>
            )}
          />
          <CategoryFormField />
          <SizeFormField />
          <HashtagFormField arrayPath={'tags'} label='태그' />
          <HashtagFormField arrayPath={'available_colors'} label='색상' />
          <DropzoneFormField defaultImageUrl={defaultImageUrl} />
          <div className='pt-1.5'>
            <FormField
              control={form.control}
              name='sale_state'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>판매상태</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='판매상태를 선택하세요' />
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
                  <FormMessage className='font-semibold' />
                </FormItem>
              )}
            />
            <div className='flex gap-2'>
              <Button className='mt-3 w-full' type='submit'>
                {action == 'create' ? '상품 추가' : '상품 수정'}
              </Button>
              {action == 'modify' && (
                <Button
                  className='mt-3 w-full'
                  variant='destructive'
                  type='button'
                  onClick={async () => handleDelete()}
                >
                  상품 삭제
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

// price: z.number(),
//   description: z.string(),
//   categories: z.array(z.string()),
//   tags: z.array(z.string()),
//   available_sizes: z.array(z.custom<Enums['product_size']>()),
//   available_colors: z.array(z.string()),

export default ProductForm;
