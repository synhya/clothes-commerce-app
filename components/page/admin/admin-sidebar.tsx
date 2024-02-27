'use client';
import React, { useState } from 'react';
import { Divide as Hamburger } from 'hamburger-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
    <div className="relative h-full border-r">
      <div
        className={cn('flex h-full min-w-[200px] flex-col justify-between', {
          hidden: !open,
        })}
      >
        <div className="sticky top-12 mx-4 flex flex-col items-center gap-y-4">
          <p className="mt-8 text-xl font-medium">관리자 페이지</p>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="dashboard">
              <AccordionTrigger>메인</AccordionTrigger>
              <AccordionContent className="flex flex-col items-start gap-0.5">
                <Button variant="link" asChild>
                  <Link href="/admin">대시보드</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
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
              <AccordionContent className="flex flex-col items-start gap-0.5">
                <Button variant="link" asChild>
                  <Link href="/admin/invoices">주문 관리</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="fixed left-1 top-7 z-10 mt-0.5">
        <Hamburger toggled={open} toggle={setOpen} color="grey" size={24} />
      </div>
    </div>
  );
};

export default AdminSidebar;
