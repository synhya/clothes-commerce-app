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
import { ViewVerticalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { productCategories, subCategories } from '@/config/product';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MainNavItem, SidebarNavItem } from '@/lib/types';
import { Route } from 'next';

interface MobileNavProps {
  items: MainNavItem[]
}

const MobileNav = ({ items }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="px-2 xl:hidden">
          <ViewVerticalIcon className="size-6" aria-hidden="true"/>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='pl-1 pr-0'>
        <div className='pl-8'>
          <Link href='/' className="font-header text-3xl font-semibold" onClick={() => setIsOpen(false)}>
            Boutique
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <Accordion type='multiple' className='w-full pr-8'>
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent className='flex flex-col items-start'>
                  {item.items.map((subItem) => (
                    <div key={subItem.title + index} className='flex w-full justify-between'>
                      <Button variant='link' className='peer' asChild>
                        <Link
                          href={subItem.href as Route}
                          className='w-fit'
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      </Button>
                      <div
                        className='min-h-full w-3 origin-right scale-x-0 bg-secondary transition-all duration-500 peer-hover:scale-x-100'></div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
    </SheetContent>
</Sheet>
)
  ;
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

export default MobileNav;
