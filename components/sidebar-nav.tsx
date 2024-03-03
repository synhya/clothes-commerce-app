'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import React from 'react';
import { Route } from 'next';
import { profileMenu, siteConfig, userMenu } from '@/config/site';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className={'flex  space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'}>
      {profileMenu.map((item) => (
        <Link
          key={item.title}
          href={item.href as Route}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
