'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Autoplay, { AutoplayType } from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PropType extends React.HTMLAttributes<typeof Carousel> {
  options?: EmblaOptionsType;
  cardClassName?: string;
}

const HeroSection = ({ options, className }: PropType) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
    // api.on("autoplay:stop" as EmblaEventType, () => {
    //   console.log('stop');
    // });
  }, [api]);

  const onMouseLeave = useCallback(() => {
    if (api) {
      (api.plugins().autoplay as AutoplayType).play();
    }
  }, [api]);

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, ...options }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnMouseEnter: true,
          }),
        ]}
        onMouseLeave={() => onMouseLeave()}
        className={cn('relative w-full', className)}
      >
        {/*https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg*/}
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="flex items-center justify-center">
              <div
                className={cn('relative m-0 rounded-md')}
              >
                <Image
                  src={`/sample-slides/slide-${index + 1}.png`}
                  alt="sampleImage"
                  width={800}
                  height={500}
                  style={{ objectFit: 'cover'}}
                  className="rounded-md aspect-video"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Button
              key={index}
              onClick={() => api?.scrollTo(index)}
              variant="secondary"
              className={cn('h-px px-1 py-1 transition-colors duration-500', {
                'bg-primary hover:bg-primary': index === current - 1,
                'bg-secondary': index !== current - 1,
              })}
            ></Button>
          ))}
        </div>
      </Carousel>
    </>
  );
};

export default HeroSection;