'use client';
import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DBEnums, productSaleState, ProductSubmit } from '@/lib/types/database';
import { z, ZodTypeAny } from 'zod';
import { createProduct, deleteProduct, updateProduct } from '@/lib/actions/actions';
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
import HashtagFormField from '@/components/page/admin/hashtag-form-field';
import { CategoryFormField, SizeFormField } from '@/components/page/admin/multiselect-form-field';
import DropzoneFormField from '@/components/page/admin/dropzone-form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

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
  available_sizes: z.custom<DBEnums['product_size']>().array()
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
} satisfies Record<keyof Omit<ProductSubmit, 'image_url'> | 'imageFiles', ZodTypeAny>);

export type ProductFormSchema = z.infer<typeof addProductFormSchema>;

const currentcyFormat = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
});

type ProductFormProps = {
  defaultValues?: Partial<ProductFormSchema>;
  defaultImageUrl?: string;
  action: 'create' | 'modify';
  productId?: string;
};

const ProductForm = ({ defaultValues, defaultImageUrl, action, productId }: ProductFormProps) => {
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(addProductFormSchema),
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

  const onSubmit: SubmitHandler<ProductFormSchema> = useCallback(async (data) => {

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('categories', JSON.stringify(data.categories));
    formData.append('tags', JSON.stringify(data.tags.map((tag) => tag.value)));
    formData.append('available_sizes', JSON.stringify(data.available_sizes));
    formData.append('available_colors', JSON.stringify(data.available_colors.map((color) => color.value)));
    formData.append('sale_state', data.sale_state);
    if (action == 'create' && !data.imageFiles) {
      toast({
        title: '알림',
        description: '이미지가 없습니다.',
      });
      return;
    }
    if (action == 'modify') {
      if (!productId) {
        toast({
          title: '경고',
          description: '상품 id가 없습니다.',
        });
        return;
      }
      formData.append('id', productId);
    }

    if (data.imageFiles)
      formData.append('imageFile', data.imageFiles[0] as Blob);

    const error = action == 'create' ? await createProduct(formData) : await updateProduct(formData);

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
      description: `상품이 ${action == 'create' ? '추가' : '수정'}되었습니다.`,
    });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!productId) {
      toast({
        title: '경고',
        description: '상품 id가 없습니다.',
      });
      return;
    }
    const error = await deleteProduct(productId);

    if (error) {
      toast({
        title: '알림',
        description: '상품 삭제에 실패했습니다.',
      });
      return;
    }

    toast({
      title: '알림',
      description: '상품이 삭제되었습니다.',
    });
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-[400px] space-y-8 lg:space-y-0 lg:gap-y-8 lg:grid lg:max-w-[800px] lg:grid-cols-2 lg:gap-x-6'
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
                <FormMessage className='font-semibold' />
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
            render={({ field: { onChange, value, ref, onBlur } }) => (
              <FormItem className='max-w-[200px]'>
                <FormLabel>가격</FormLabel>
                <div className='relative'>
                  <span className='absolute top-1/2 left-3 transform -translate-y-1/2 text-sm'>₩</span>
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
                <Button className='mt-3 w-full' variant='destructive' type='button'
                        onClick={async () => handleDelete()}>
                  상품 삭제
                </Button>
              )}
            </div>
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

export default ProductForm;