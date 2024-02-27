import React from 'react';
import Image from 'next/image';

const SampleItem = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex basis-1/2 items-center space-x-4">
        <div className="my-2 h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500 to-emerald-500" />
        <div>
          <div className="text-sm font-semibold sm:text-base">샘플 아이템</div>
          {/*<div className="text-sm text-gray-500">{`${selectedColor} / ${selectedSize}`}</div>*/}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-xs text-gray-500 line-through sm:text-base">
          {Math.round(9999 * 0.18) * 10}원
        </span>
        <span className="text-sm font-semibold sm:text-lg">9999원</span>
      </div>
      {/*<div className="font-semibold tracking-widest text-end">{quantity}개</div>*/}
    </div>
  );
};

export default SampleItem;
