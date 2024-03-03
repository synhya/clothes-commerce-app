'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/cards/product-card';
import { ProductCardData } from '@/lib/types';
import { ChevronsDownIcon, ChevronsUp, ChevronsUpIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import { createClient } from '@/lib/supabase/client';
import { productDataToCardData } from '@/lib/utils';
import { Product } from '@/lib/types';
import { motion } from 'framer-motion';

const PAGE_COUNT = 6;

const CategoryScrollSection = ({
  category,
  prefetchedData,
}: {
  category: string;
  prefetchedData: ProductCardData[];
}) => {
  const { ref, inView, entry } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [offset, setOffset] = useState(1);
  const [loadedProducts, setLoadedProducts] = useState(prefetchedData);
  const supabase = createClient();

  const loadMoreProducts = async (offset: number) => {
    setIsLoading(true);
    setOffset((prev) => prev + 1);
    const newProducts = await fetchMoreProducts(offset);
    if (newProducts.length < PAGE_COUNT) setIsLast(true);

    const newCardData = newProducts.map((product) =>
      productDataToCardData(product as Product, supabase),
    );
    setLoadedProducts((prev) => [...prev, ...newCardData]);

    setIsLoading(false);
  };

  const fetchMoreProducts = async (offset: number) => {
    const from = offset * PAGE_COUNT;
    const to = from + PAGE_COUNT - 1;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .contains('categories', [category === 'all' ? '' : category])
      .eq('sale_state', '판매중')
      .range(from, to)
      .order('sold', { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  };

  useEffect(() => {
    if (!isLast && inView) {
      loadMoreProducts(offset);
    }
  }, [inView]);

  const handleChevronsUpClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="mx-6 grid grid-cols-1 gap-8 md:mx-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadedProducts?.map((product, i) => {
          const recalculatedDelay =
            i >= PAGE_COUNT * 2 ? (i - PAGE_COUNT * (offset - 1)) / 15 : i / 15;

          return (
            <motion.div
              key={product.name + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.25, 0, 1],
                delay: recalculatedDelay,
              }}
            >
              <ProductCard cardData={product} />
            </motion.div>
          );
        })}
        {/* stream with infinite scroll */}
      </div>
      <div className="flex justify-center">
        {!isLast ? (
          <ChevronsDownIcon ref={ref} className="m-8 h-10 w-10" />
        ) : (
          <ChevronsUpIcon
            className="m-8 h-10 w-10 cursor-pointer"
            onClick={handleChevronsUpClick}
          />
        )}
      </div>
    </>
  );
};

export default CategoryScrollSection;
