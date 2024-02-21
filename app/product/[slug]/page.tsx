import React from 'react';
import ProductCard from '@/components/page/product/product-card';
import { fetchProductByName } from '@/lib/fetches';
import { notFound } from 'next/navigation';

const ProductPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { data: product } = await fetchProductByName(decodeURIComponent(slug));

  if (!product) {
    return notFound();
  }

  return (
    <>
    </>
  );
};

export default ProductPage;
