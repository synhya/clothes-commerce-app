'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Cross1Icon, HomeIcon } from '@radix-ui/react-icons';
import useSideBar from '@/lib/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { metaCategories, productCategories } from '@/lib/types/categories';
import Link from 'next/link';

const GlobalSidebar = () => {
  const { open, setOpen } = useSideBar();
  const pathname = usePathname();

  // 모바일 환경에서는 사이드바가 main content 위에 뜨도록 하기 위해
  return (
    <aside
      className={cn(
        'nav-md:hidden absolute left-0 top-0 z-20 h-screen w-[250px] bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out border-r border-accent',
         open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className='flex justify-end px-1 py-1'>

        <Button variant="ghost" onClick={() => setOpen(false)} className="px-1.5 hover:bg-background border border-transparent hover:border-accent">
          <Cross1Icon className="size-6" />
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full px-4">
        {metaCategories.map((category, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              {productCategories[category].map((productCategory) => (
                <p key={productCategory + index}>
                  <Link
                    href={`/product-list?category=${productCategory}`}
                    passHref
                    className="w-fit"
                  >
                    {productCategory}
                  </Link>
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
};

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

const GlobalSidebarWithScroll = () => (
  <ScrollArea className="h-72 w-48 rounded-md border">
    <div className="p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
      {tags.map((tag) => (
        <>
          <div key={tag} className="text-sm">
            {tag}
          </div>
          <Separator className="my-2" />
        </>
      ))}
    </div>
  </ScrollArea>
);

export default GlobalSidebar;
