import React, { Suspense } from 'react';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import SearchProductForm from '@/components/forms/search-product-form';
import ProductsTable from '@/app/admin/_components/products-table';
import { Product } from '@/lib/types';
import { productSaleState } from '@/config/product';
import { productsSearchParamsSchema } from '@/lib/validations/params';
import { DataTableSkeleton } from '@/app/admin/_components/data-table-skeleton';


//
//
// {
//   searchParams: {
//     category?: string;
//     startDate?: string;
//     endDate?: string;
//     saleState?: string;
//     searchText?: string;
//   };
interface AdminPageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

const AdminPage = async ({ searchParams }: AdminPageProps) => {
  const { from, to, name, sale_state, page, per_page, category } =
    productsSearchParamsSchema.parse(searchParams);
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  console.log("rendered");

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('created_at', from ?? '2000-01-01')
    .lte('created_at', to ?? '2100-12-31')
    .contains('categories', [category ?? ''])
    .in('sale_state', [sale_state ?? productSaleState] as const)
    .like('name', `%${name ?? ''}%`)
    .range((page - 1) * per_page, page * per_page - 1)
    .order('created_at', { ascending: false });

  const tableData = data as Product[];

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .gte('created_at', from ?? '2000-01-01')
    .lte('created_at', to ?? '2100-12-31')
    .contains('categories', [category ?? ''])
    .in('sale_state', [sale_state ?? productSaleState] as const)
    .like('name', `%${name ?? ''}%`);

  return (
    <div className="mr-2">
      <SearchProductForm />
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={6} searchableColumnCount={0} filterableColumnCount={0} />
        }
      >
        {error ? <p>에러가 발생했습니다</p> :
          <ProductsTable tableData={tableData} rowCount={count} />}
      </Suspense>
    </div>
  );
};

export default AdminPage;
