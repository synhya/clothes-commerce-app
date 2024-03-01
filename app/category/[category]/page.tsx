import React from 'react';
import { fetchSellingProductsByCategory } from '@/lib/fetchers/product';
import { notFound } from 'next/navigation';
import { productDataToCardData } from '@/lib/utils';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import BreadCrumb from '@/app/_components/bread-crumb';
import CategoryScrollSection from '@/app/_components/category-scroll-section';
import { Route } from 'next';
import { productCategories, subCategories } from '@/config/product';

const Page = async ({
  params: { category },
  searchParams: { from },
}: {
  params: { category: string };
  searchParams: {
    from?: string;
  };
}) => {
  const decodedCategory = decodeURIComponent(category);
  const { data, error } = await fetchSellingProductsByCategory(decodedCategory, 6);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (error) {
    notFound();
  }

  const cardData = data.map((product) => productDataToCardData(product, supabase));

  //
  const upperCategory =
    from ??
    productCategories.filter((key) => subCategories[key].includes(category as never))[0] ??
    null;

  let paths:BreadCrumb[] = [{ href: '/category/all' as Route, title: '전체' }];
  if (upperCategory) {
    paths.push({ href: `/category/${encodeURIComponent(upperCategory)}` as Route, title: upperCategory });
  }
  if (decodedCategory !== 'all') {
    paths.push({
      href: `/category/${encodeURIComponent(decodedCategory)}` as Route,
      title: decodedCategory,
    });
  }

  return (
    <>
      <div className="m-8 flex items-center">
        <h1 className="mr-8 text-3xl font-semibold max-[336px]:hidden">{decodedCategory}</h1>
        <BreadCrumb paths={paths} />
      </div>
      <CategoryScrollSection category={decodedCategory} prefetchedData={cardData} />
    </>
  );
};

export default Page;
