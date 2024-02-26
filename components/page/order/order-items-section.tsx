import React from 'react';
import BasketItem from '@/components/page/order/basket-item';
import { createClient } from '@/lib/supabase/client';
import SampleItem from '@/components/page/order/sample-item';
import { BasketInfo } from '@/lib/types/database';

type Props = {
  basketInfos: BasketInfo[];
  totalPrice: number;
} & React.HTMLProps<HTMLDivElement>;

const OrderItemsSection = ({ basketInfos, totalPrice }: Props) => {
  const supabase = createClient();

  return (
    <section className='mb-6'>
      <div>
        <div className='text-xl font-semibold mb-4'>주문상품</div>
        <div className='border-t-2 border-b border-gray-200 py-4'>
          {basketInfos.map((item, index) => {
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(item.image_url);
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
      {basketInfos.length <= 2 &&
        totalPrice < 50000 && (
          <div className='mt-20 hidden lg:block'>
            <div className='text-xl font-semibold mb-4 '>추천상품</div>
            <div className='border-t-2 border-b border-gray-200 py-4'>
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
