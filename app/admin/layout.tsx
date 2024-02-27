import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminSidebar from '@/components/page/admin/admin-sidebar';
import DefaultLayout from '@/components/layout/default-layout';

const routes = [
  { label: '상품추가', pathname: '/admin/add-products' },
  { label: '상품관리', pathname: '/admin/search-products' },
  { label: '상품수정', pathname: '/admin/manage-products', matchOptions: { inclusive: true } },
  { label: '주문관리', pathname: '/admin/invoices' },
  { label: '대시보드', pathname: '/admin' },
];

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const data = await supabase.auth.getUser();

  return (
    <div className="flex h-full bg-background">
      {/* 사이드바 */}
      <AdminSidebar />
      <div className="mb-5 ml-2 flex-grow">
        <DefaultLayout routes={routes}>{children}</DefaultLayout>
      </div>
    </div>
  );
};

export default Layout;
