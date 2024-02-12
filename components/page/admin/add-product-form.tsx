'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { Enums, Product } from '@/lib/types/database';
import { z, ZodTypeAny } from 'zod';
import { createProduct } from '@/lib/actions';
import { SubmitHandler } from 'react-hook-form';

const formSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  available_sizes: z.array(z.custom<Enums['product_size']>()),
  available_colors: z.array(z.string()),
  imageFile: z.custom<File>(),
} satisfies Record<keyof Omit<Product, 'id' | 'image_url'> | 'imageFile', ZodTypeAny>);

export type ProductFormSchema = z.infer<typeof formSchema>;

const AddProductForm = () => {
  const router = useRouter();

  const onSubmit: SubmitHandler<ProductFormSchema> = async (data) => {
    // do async for fast response
    const error = await createProduct(data);
    if (error) {
      console.error(error);
      return;
    }

    // also show toast
    router.refresh();
  };

  return (
    <form>
      <Input name="title" type="text"></Input>
      <Button
        type="submit"
        radius="full"
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 px-4 py-2 text-white shadow-lg"
      >
        상품등록
      </Button>
    </form>
  );
};

export default AddProductForm;
