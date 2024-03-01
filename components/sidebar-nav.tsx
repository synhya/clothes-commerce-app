'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { additionalLinks } from '@/config/nav';
import React from 'react';

export function SidebarNav () {
  const pathname = usePathname();

  return (
    <nav className={'flex  space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'}>
      {additionalLinks.length > 0
        && additionalLinks.map((item) => {
            return (
              <React.Fragment key={item.title}>
                {item.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      pathname === l.href
                        ? 'bg-muted hover:bg-muted'
                        : 'hover:bg-transparent hover:underline',
                      'justify-start',
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </React.Fragment>
            );
          },
        )}
    </nav>
  );
}
