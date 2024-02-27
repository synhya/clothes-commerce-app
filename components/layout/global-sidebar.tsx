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
import useSideBar from '@/lib/stores/useSidebar';
import { cn } from '@/lib/utils';
import { metaCategories, productCategories } from '@/lib/types/client';
import Link from 'next/link';

const GlobalSidebar = () => {
  const { open, setOpen } = useSideBar();
  const pathname = usePathname();

  // 모바일 환경에서는 사이드바가 main content 위에 뜨도록 하기 위해
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen w-[250px] border-r border-accent bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out nav-md:hidden',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex justify-end px-1 py-1">
        <Button
          variant="ghost"
          onClick={() => setOpen(false)}
          className="border border-transparent px-1.5 hover:border-accent hover:bg-background"
        >
          <Cross1Icon className="size-6" />
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full px-4">
        {metaCategories.map((upperCategory, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{upperCategory}</AccordionTrigger>
            <AccordionContent className="flex flex-col items-start">
              {productCategories[upperCategory].map((productCategory) => (
                <div key={productCategory + index} className="flex w-full justify-between">
                  <Button variant="link" className="peer" asChild>
                    <Link
                      href={`/category/${encodeURIComponent(productCategory)}?from=${upperCategory}`}
                      passHref
                      className="w-fit"
                    >
                      {productCategory}
                    </Link>
                  </Button>
                  <div className="min-h-full w-3 origin-right scale-x-0 bg-secondary transition-all duration-500 peer-hover:scale-x-100"></div>
                </div>
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
