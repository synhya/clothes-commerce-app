import React from 'react';

import { cookies } from 'next/headers';
import AddProductForm from '@/components/page/admin/add-product-form';
import { createClient } from '@/lib/supabase/server';
import SearchProductForm from '@/components/page/admin/search-product-form';
import ProductTable from '@/components/page/admin/product-table';
import { createAdminClient } from '@/lib/supabase/admin';
import { Product } from '@/lib/types/database';

const AdminPage = async ({
  searchParams,
}: {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    searchText?: string;
  };
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  const tableData = data as Product[];

  return (
    <div>
      <SearchProductForm />
      <ProductTable tableData={tableData}/>
    </div>
  );
};

export default AdminPage;
