import React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductCardData } from '@/lib/types/client';
import Image from 'next/image';

type ProductCardProps = {
  cardData: ProductCardData
  imageClassName?: string
} & React.ComponentPropsWithoutRef<'div'>

const ProductCard = ({ ...props }: ProductCardProps) => {
  const { imageClassName, cardData: { imageUrl, name, description, price, tags, categories } } = props;

  // className="hover:scale-110 transition-transform  duration-300 rounded-md"
  return (
    <div className={cn(
      'flex flex-col items-center gap-2',
      props.className)}>
      <Link
        href={`/product/${name}`}
        className={cn(
          'relative min-w-[200px] min-h-[200px]',
          imageClassName,
        )}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='hover:scale-110 transition-transform'
          sizes='(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 20vw'
        />
      </Link>
      {/*<p>avaliable colors in circle</p>*/}
      <p>{name}</p>
      <Separator />
      <p>{price} 원</p>
      <div className='flex gap-0.5'>
        {tags?.map((tag, i) => (
          <Badge key={i}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
