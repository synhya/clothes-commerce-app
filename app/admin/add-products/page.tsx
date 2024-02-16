import React from 'react';
import ProductForm, { ProductFormSchema } from '@/components/page/admin/product-form';

const Page = async () => {
  return (
    <>
      <h1 className="py-4 text-2xl font-semibold">상품 추가</h1>
      <div className="flex flex-col lg:items-center">
        {/* Render your dashboard components here */}
        <ProductForm action='create'/>
      </div>
    </>
  );
};

export default Page;
