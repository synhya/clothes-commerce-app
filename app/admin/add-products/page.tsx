import React from 'react';
import ProductForm, { ProductFormSchema } from '@/components/page/admin/product-form';

const Page = async () => {
  return (
    <div className="flex flex-col lg:items-center">
      {/* Render your dashboard components here */}
      <ProductForm action="create" />
    </div>
  );
};

export default Page;
