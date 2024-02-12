import React from 'react';

import { cookies } from 'next/headers';
import AddProductForm from '@/components/page/admin/add-product-form';
import { createClient } from '@/lib/supabase/server';

const AdminPage = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('notes').select(); //.insert([{ title: "Buy milk" }]);

  return (
    <div>
      <h1>Admin analytics</h1>
      어드민 analytics 페이지
      <p className="peer-valid:mb-5 peer-focus:mb-5">Input</p>
      {/*<Input className="" onInvalid={()=>{}} />*/}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default AdminPage;
