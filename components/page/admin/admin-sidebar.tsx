'use client'
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative border-r">
      <div className={cn("min-w-[200px] h-full flex flex-col justify-between",
        {
          'hidden': !open
        }
        )}>
        <div className="flex flex-col items-center gap-y-6">
          <p className="text-xl mt-4">관리자 페이지</p>
          <Separator className="px-2"/>
          <Button variant="link" className="text-xl" asChild>
            <Link href="/admin/add-products">상품 추가</Link>
          </Button>
          <Separator className="px-2"/>
          <Button variant="link" className="text-xl" asChild>
            <Link href="/admin/search-products">상품 관리</Link>
          </Button>
          <Separator className="px-2"/>
          <Button variant="link" className="text-xl" asChild>
            <Link href="/admin/invoices">주문 관리</Link>
          </Button>
        </div>
      </div>
      <Button size="icon" className={cn("absolute bottom-0 left-0 m-4",
        {
          'bg-secondary': open,
        }
        )}
        onClick={() => setOpen(!open)}
      >
        <HamburgerMenuIcon />
      </Button>
    </div>
  );
};

export default AdminSidebar;
