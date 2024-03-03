import React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductCardData } from '@/lib/types';
import Image from 'next/image';
import { Circle } from 'lucide-react';
import ColorOption from '@/components/color-option';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type ProductCardProps = {
  cardData: ProductCardData;
} & React.ComponentPropsWithoutRef<'div'>;

const ProductCard = ({ ...props }: ProductCardProps) => {
  const {
    cardData: { imageUrl, name, description, price, tags, categories, availableColors },
    className,
    ...rest
  } = props;

  return (
    <Card className={cn('size-full overflow-hidden rounded-sm', className)} {...rest}>
      <Link href={`/product/${name}`}>
        <CardHeader className="relative border-b p-0 group overflow-hidden">
          <AspectRatio ratio={1}>
            <Image
              src={imageUrl}
              alt={name}
              fill
              loading="lazy"
              className="transition-transform group-hover:scale-110"
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 20vw"
            />
          </AspectRatio>
          <div className="absolute top-0 right-2 flex gap-0.5">
            {tags.length > 0 ? tags?.map((tag, i) => <Badge key={i}>{tag}</Badge>) : ' '}
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <div className="flex gap-0.5 rounded-full border bg-secondary/60 p-1">
              {availableColors.map((color, i) => (
                <ColorOption color={color} key={i} />
              ))}
            </div>
          </div>
        </CardHeader>
        <span className="sr-only">{name}</span>
      </Link>
      <Link href={`/product/${name}`} tabIndex={-1}>
        <CardContent className={cn('flex flex-col items-center gap-2 p-4')}>
          <CardTitle className="line-clamp-1">{name}</CardTitle>
          <Separator />
          <CardDescription className="line-clamp-1">{price} 원</CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
