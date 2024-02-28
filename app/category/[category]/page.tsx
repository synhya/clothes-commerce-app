import React from 'react';
import { fetchSellingProductsByCategory } from '@/lib/fetchers/product';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/page/category/product-card';
import { productDataToCardData } from '@/lib/utils';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { BreadCrumb, metaCategories, MetaCategory, productCategories } from '@/lib/types';
import Breadcrumb from '@/components/page/category/breadcrumb';
import { ChevronsDownIcon } from 'lucide-react';
import CategoryScrollSection from '@/components/page/category/category-scroll-section';
import { SidebarLink } from '@/components/page/sidebar-nav';
import { Route } from 'next';

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
    metaCategories.filter((key) => productCategories[key].includes(category as never))[0] ??
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
        <Breadcrumb paths={paths} />
      </div>
      <CategoryScrollSection category={decodedCategory} prefetchedData={cardData} />
    </>
  );
};

export default Page;
