import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminSidebar from '@/components/page/admin/admin-sidebar';

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const data = await supabase.auth.getUser();

  return (
    <div className="flex h-full bg-background">
      {/* 사이드바 */}
      <AdminSidebar />
      <div className="flex-grow mb-5 ml-2">
        {children}
      </div>
    </div>
  )
};

export default Layout;
