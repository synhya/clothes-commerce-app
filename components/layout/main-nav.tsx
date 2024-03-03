'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useThrottledCallback } from 'use-debounce';
import { productCategories, subCategories } from '@/config/product';
import { MainNavItem } from '@/lib/types';
import { Route } from 'next';

interface MainNavProps {
  items: MainNavItem[];
}

const MainNav = ({ items }: MainNavProps) => {
  const onNavChange = useCallback(() => {
    setTimeout(() => {
      const triggers = document.querySelectorAll('.submenu-trigger[data-state="open"]');
      if (triggers.length === 0) return;

      const firstTrigger = triggers[0] as HTMLElement;
      const viewports = document.getElementsByClassName('submenu-viewport');

      if (viewports.length > 0) {
        const viewport = viewports[0] as HTMLElement;

        // doesn't work , viewport.offsetWidth is 0 in some cases
        // const offsetLeft = firstTrigger.offsetLeft - (viewport.offsetWidth - firstTrigger.offsetWidth)/2;

        viewport.style.left = `${firstTrigger.offsetLeft - (130 - firstTrigger.offsetWidth) / 2}px`;
      }
    });
  }, []);
  return (
    <div className="hidden items-center xl:flex">
      <Link href="/" className="font-header text-3xl font-semibold">
        Boutique
      </Link>
      <NavigationMenu onValueChange={onNavChange}>
        <NavigationMenuList className="ml-5">
          {items.map(
            (item, index) =>
              index !== 0 && (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="submenu-trigger bg-transparent">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-1">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          {subItem.href ? (
                            <Link href={subItem.href as Route} className="w-fit">
                              <Button variant="link">{subItem.title}</Button>
                            </Link>
                          ) : (
                            <div className="text-foreground/70 transition-colors">{item.title}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ),
          )}
        </NavigationMenuList>
        <NavigationMenuViewport className="submenu-viewport min-w-[130px] items-center bg-background/90 backdrop-blur-lg" />
      </NavigationMenu>
    </div>
  );
};

export default MainNav;
