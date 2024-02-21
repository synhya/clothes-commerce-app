import React from 'react';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import SearchProductForm from '@/components/page/admin/search-product-form';
import ProductTable from '@/components/page/admin/product-table';
import {  Product, productSaleState } from '@/lib/types/database';


const AdminPage = async ({
  searchParams,
}: {
  searchParams: {
    category?: string;
    startDate?: string;
    endDate?: string;
    saleState?: string;
    searchText?: string;
  };
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('created_at', searchParams.startDate ?? '2000-01-01')
    .lte('created_at', searchParams.endDate ?? '2100-12-31')
    .contains('categories', [searchParams.category ?? ''])
    .in('sale_state', [searchParams.saleState ?? productSaleState] as const)
    .like('name', `%${searchParams.searchText ?? ''}%`)
    .order('created_at', { ascending: false });

  const tableData = data as Product[];

  return (
    <div className="mr-2">
      <h1 className="py-4 text-2xl font-semibold">상품 관리</h1>
      <SearchProductForm />
      {error ? (
        <p>에러가 발생했습니다</p>
      ) : (
        <ProductTable tableData={tableData} />
      )}
    </div>
  );
};

export default AdminPage;
