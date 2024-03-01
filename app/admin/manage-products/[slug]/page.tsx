import React, { useCallback } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductForm, { Inputs } from '@/components/forms/product-form';
import { DBEnums } from '@/lib/types';
import { fetchProductByName } from '@/lib/fetchers/product';

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const name = decodeURIComponent(slug);

  // name is unique
  const { data, error } = await fetchProductByName(name, supabase);

  if (error || data === null) {
    notFound();
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('products').getPublicUrl(data.image_url);

  if (!publicUrl) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col lg:items-center">
        {/* Render your dashboard components here */}
        {data && (
          <ProductForm
            defaultValues={{
              name: data.name,
              price: data.price ?? 0,
              description: data.description ?? undefined,
              categories: data.categories ?? undefined,
              tags: data.tags?.map((tag: string) => ({ value: tag })),
              available_colors: data.available_colors?.map((color: string) => ({ value: color })),
              available_sizes: data.available_sizes as DBEnums['product_size'][],
              sale_state: data.sale_state as DBEnums['sale_state'],
            }}
            defaultImageUrl={publicUrl}
            action="modify"
            productId={data.id}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
