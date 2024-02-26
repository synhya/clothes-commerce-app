import React from 'react';
import Image from 'next/image';

const SampleItem = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4 basis-1/2">
        <div className="my-2 h-16 w-16 bg-gradient-to-br from-pink-500 to-emerald-500 rounded-xl" />
        <div>
          <div className="font-semibold text-sm sm:text-base">샘플 아이템</div>
          {/*<div className="text-sm text-gray-500">{`${selectedColor} / ${selectedSize}`}</div>*/}
        </div>
      </div>
      <div className="space-y-1 flex flex-col items-center">
        <span className="text-gray-500 line-through text-xs sm:text-base">{Math.round(9999 * 0.18) * 10}원</span>
        <span className="font-semibold text-sm sm:text-lg">9999원</span>
      </div>
      {/*<div className="font-semibold tracking-widest text-end">{quantity}개</div>*/}
    </div>
  );
};

export default SampleItem;
