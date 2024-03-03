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
    <div className="relative h-full ">
      <div className="fixed left-1 top-16 z-10 mt-0.5">
        <Hamburger toggled={open} toggle={setOpen} color="grey" size={24} />
      </div>
      <div
        className={cn('flex h-full min-w-48 flex-col justify-between', {
          hidden: !open,
        })}
      >
        <div className="fixed inset-y-0 top-16 flex flex-col px-8 border-r items-center gap-y-4">
          <p className="mt-16 text-xl font-medium">관리자 페이지</p>
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
    </div>
  );
};

export default AdminSidebar;
