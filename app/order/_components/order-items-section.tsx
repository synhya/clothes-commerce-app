import React from 'react';
import BasketItem from '@/app/order/_components/basket-item';
import { createClient } from '@/lib/supabase/client';
import SampleItem from '@/app/order/_components/sample-item';
import { BasketInfo } from '@/lib/types';

type Props = {
  basketInfos: BasketInfo[];
  totalPrice: number;
} & React.HTMLProps<HTMLDivElement>;

const OrderItemsSection = ({ basketInfos, totalPrice }: Props) => {
  const supabase = createClient();

  return (
    <section className="mb-6">
      <div>
        <div className="mb-4 text-xl font-semibold">주문상품</div>
        <div className="border-b border-t-2 border-gray-200 py-4">
          {basketInfos.map((item, index) => {
            const {
              data: { publicUrl },
            } = supabase.storage.from('products').getPublicUrl(item.image_url);
            return (
              <BasketItem
                key={index}
                imageUrl={publicUrl}
                productName={item.name}
                selectedColor={item.selected_color}
                selectedSize={item.selected_size}
                price={item.price}
                quantity={item.quantity}
              />
            );
          })}
        </div>
      </div>
      {basketInfos.length <= 2 && totalPrice < 50000 && (
        <div className="mt-20 hidden lg:block">
          <div className="mb-4 text-xl font-semibold ">추천상품</div>
          <div className="border-b border-t-2 border-gray-200 py-4">
            <SampleItem />
            <SampleItem />
            <SampleItem />
            50,000원 이상 구매 시 무료배송
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderItemsSection;
