'use client';
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative border-r">
      <div
        className={cn('flex h-full min-w-[200px] flex-col justify-between', {
          hidden: !open,
        })}
      >
        <div className="mx-4 flex flex-col items-center gap-y-6">
          <p className="mt-4 text-xl">관리자 페이지</p>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="products">
              <AccordionTrigger>상품</AccordionTrigger>
              <AccordionContent className="flex flex-col items-start gap-0.5">
                <Button variant="link" asChild>
                  <Link href="/admin/add-products">상품 추가</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/admin/search-products">상품 관리</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="invoices">
              <AccordionTrigger>주문</AccordionTrigger>
              <AccordionContent  className="flex flex-col items-start gap-0.5">
                <Button variant="link" asChild>
                <Link href="/admin/invoices">주문 관리</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Button
        size="icon"
        className={cn('absolute bottom-0 left-0 m-4', {
          'bg-secondary': open,
        })}
        onClick={() => setOpen(!open)}
      >
        <HamburgerMenuIcon />
      </Button>
    </div>
  );
};

export default AdminSidebar;
