'use client'
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/page/product/product-card';

const TrendingClothes = ({className, ...props} : React.ComponentPropsWithoutRef<'div'>) => {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });


  // get trending database from server

  return (
    <div ref={ref} className={cn("flex flex-col items-center text-xl", className)}>
      <p>실시간 인기 순위</p>
      {/* carousel */}
      <div className="flex gap-x-6">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      {/*  스크롤하면 이미지 나타나게 */}
    </div>
  );
};

export default TrendingClothes;
