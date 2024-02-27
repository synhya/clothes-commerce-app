'use client';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/page/category/product-card';
import { ProductCardData } from '@/lib/types/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';

type TrendingClothesProps = {
  trendingClothes: ProductCardData[];
} & React.HTMLAttributes<HTMLDivElement>;

const TrendingClothes = ({ trendingClothes, className, ...props }: TrendingClothesProps) => {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  // get trending database from server

  return (
    <div ref={ref} className={cn('flex flex-col items-center py-8 text-xl', className)}>
      <p className="mb-10 text-3xl font-semibold">실시간 인기 물품</p>
      {/* carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-fit max-w-[200px] sm:max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl"
      >
        <CarouselContent>
          {trendingClothes.map((product, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 2,
                  ease: [0.25, 0.25, 0, 1],
                  delay: index / 2,
                }}
              >
                <div className="p-1">
                  <ProductCard key={product.name} cardData={product} />
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="max-[320px]:hidden" />
        <CarouselNext className="max-[320px]:hidden" />
      </Carousel>
    </div>
  );
};

export default TrendingClothes;
