import React from 'react';
import Image from 'next/image';
import { BasketItemData } from '@/lib/types/client';

const BasketItem = ({
  imageUrl,
  productName,
  selectedColor,
  selectedSize,
  price,
  quantity,
}: BasketItemData) => {
  // 430
  return (
    <div className='max-[430px]:grid max-[430px]:grid-cols-2 flex items-center justify-between'>
      <div className='max-[430px]:col-span-2 flex items-center space-x-4 basis-1/2'>
        <Image
          src={imageUrl}
          alt='Product'
          width='80'
          height='80'
          style={{
            objectFit: 'cover',
          }}
          className='w-auto object-cover'
        />
        <div>
          <div className='font-semibold text-sm sm:text-base'>{productName}</div>
          <div className='text-sm text-gray-500'>{`${selectedColor} / ${selectedSize}`}</div>
        </div>
      </div>
      <div className='space-y-1 flex flex-col items-center'>
        <span className='text-gray-500 line-through text-xs sm:text-base'>{Math.round(price * 0.11) * 10}원</span>
        <span className='font-semibold text-sm sm:text-lg'>{price}원</span>
      </div>
      <div className='font-semibold tracking-widest text-end max-[430px]:text-center'>{quantity}개</div>
    </div>
  );
};

export default BasketItem;
