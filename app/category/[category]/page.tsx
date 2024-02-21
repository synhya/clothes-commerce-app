import React from 'react';
import { fetchSellingProductsByCategory } from '@/lib/fetches';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/page/product/product-card';
import { productDataToCardData } from '@/lib/utils';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { metaCategories, MetaCategory, productCategories } from '@/lib/types/client';
import Breadcrumb from '@/components/page/product/breadcrumb';
import { ChevronsDownIcon } from 'lucide-react';
import CategoryScrollSection from '@/components/page/product/category-scroll-section';

const Page = async ({
  params: { category },
  searchParams: {
    from,
  },
}: {
  params: { category: string },
  searchParams: {
    from?: string;
  }
}) => {
  const decodedCategory = decodeURIComponent(category);
  const { data, error } = await fetchSellingProductsByCategory(decodedCategory, 6);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (error) {
    notFound();
  }

  const cardData = data.map((product) => (
    productDataToCardData(product, supabase)
  ));

  //
  const upperCategory = from ??
    metaCategories.filter((key) => productCategories[key].includes(category as never))[0]
    ?? null;

  let paths = [{ href: `/category/all`, label: '전체' }]
  if (upperCategory) {
    paths.push({ href: `/category/${encodeURIComponent(upperCategory)}`, label: upperCategory });
  }
  if (decodedCategory !== 'all') {
    paths.push({ href: `/category/${encodeURIComponent(decodedCategory)}`, label: decodedCategory });
  }

  return (
    <>
      <div className='m-8 flex items-center'>
        <h1 className='text-3xl font-semibold max-[336px]:hidden mr-8'>{decodedCategory}</h1>
        <Breadcrumb paths={paths} />
      </div>
      <CategoryScrollSection category={decodedCategory} prefetchedData={cardData} />
    </>
  );
};

export default Page;
