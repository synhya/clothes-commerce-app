import React from 'react';
import NextImage from 'next/image';
import { Separator } from '@/components/ui/separator';
import {Image} from "@nextui-org/react";

const ProductCard = () => {
  // className="hover:scale-110 transition-transform  duration-300 rounded-md"
  return (
    <div className="flex flex-col items-center border border-background rounded-md gap-y-2">
      <div>
        <Image
          as={NextImage}
          isZoomed
          width={400}
          height={300}
          src="/products/baby-cap-black.png"
          alt="Product Image"
        />
      </div>
      <p>avaliable colors in circle</p>
      <p>상품명</p>
      <p>
        #m.b.s! 하늘처럼 청량하고 클린한 블루.
        잔잔한 스트라이프로 제작된 셔츠
        소재감이 예뻐서 두 사이즈로 보여드려요!
        취향에 맞게 사이즈를 골라주세요 *.* ♥
      </p>
      <Separator />
      <p>가격</p>
      <p>태그 (Made, Best, Sns hot)</p>
    </div>
  );
};

export default ProductCard;
