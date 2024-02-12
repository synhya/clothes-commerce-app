import React from 'react';
import { cookies } from 'next/headers';
import { auth } from '@/lib/authjs';
import { createClient } from '@/lib/supabase/server';
import AddProductForm from '@/components/page/admin/add-product-form';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const session = await auth();
  if(session) {
    const { data } = await supabase.from('notes').select(); //.insert([{ title: "Buy milk" }]);
  }

  return (
    <div>
      <h1>Admin</h1>
      {/* Render your dashboard components here */}
      Add product page
      <AddProductForm />
    </div>
  );
};

export default Page;
