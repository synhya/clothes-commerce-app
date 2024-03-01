import React from 'react';
import Image from 'next/image';
import { BasketItemData } from '@/lib/types';

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
    <div className="flex items-center justify-between max-[430px]:grid max-[430px]:grid-cols-2">
      <div className="flex basis-1/2 items-center space-x-4 max-[430px]:col-span-2">
        <Image
          src={imageUrl}
          alt="Product"
          width="80"
          height="80"
          style={{
            objectFit: 'cover',
          }}
          className="w-auto object-cover"
        />
        <div>
          <div className="text-sm font-semibold sm:text-base">{productName}</div>
          <div className="text-sm text-gray-500">{`${selectedColor} / ${selectedSize}`}</div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-xs text-gray-500 line-through sm:text-base">
          {Math.round(price * 0.11) * 10}원
        </span>
        <span className="text-sm font-semibold sm:text-lg">{price}원</span>
      </div>
      <div className="text-end font-semibold tracking-widest max-[430px]:text-center">
        {quantity}개
      </div>
    </div>
  );
};

export default BasketItem;
