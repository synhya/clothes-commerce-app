'use client';
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const ClothCarousel: React.FC<PropType> = (props : PropType) => {
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel({loop: true, ...options }, [Autoplay({
    delay: 2000,
    stopOnMouseEnter: true
  })] )

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);



  useEffect(() => {
    if(!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api]);
  // Array.from({ length: 5}).map...
  return (
    <>
      <Carousel setApi={setApi} className="w-full max-w-xs" ref={emblaRef}>
        <CarouselContent>
          {slides.map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </>
  );
};

export default ClothCarousel;
