'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/cards/product-card';
import { ProductCardData } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { motion, Variants } from 'framer-motion';

type TrendingClothesProps = {
  trendingClothes: ProductCardData[];
} & React.HTMLAttributes<HTMLDivElement>;

const TrendingClothes = ({ trendingClothes, className, ...props }: TrendingClothesProps) => {

  return (
    <div className={cn('flex flex-col items-center py-8 text-xl', className)}>
      {/* carousel */}
      <p className="mb-10 text-3xl font-semibold">실시간 인기 물품</p>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-[calc(100vw-8rem)] max-w-min"
      >
        <CarouselContent>
          {trendingClothes.map((product, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <motion.div
                key={product.name}
                initial={{
                  opacity: 0,
                  y: 40
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 2,
                    ease: [0.25, 0.25, 0, 1],
                  }
                }}
                viewport={{ once: true }}
              >
                <ProductCard key={product.name} cardData={product} />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default TrendingClothes;
