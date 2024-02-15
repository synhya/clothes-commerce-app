import React from 'react';
import { cookies } from 'next/headers';
import { auth } from '@/lib/authjs';
import { createClient } from '@/lib/supabase/server';
import AddProductForm from '@/components/page/admin/add-product-form';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const session = await auth();
  if (session) {
    const { data } = await supabase.from('notes').select(); //.insert([{ title: "Buy milk" }]);
  }

  return (
    <>
      <h1 className="py-4 text-2xl font-semibold">상품 추가</h1>
      <div className="flex flex-col lg:items-center">
        {/* Render your dashboard components here */}
        <AddProductForm />
      </div>
    </>
  );
};

export default Page;
