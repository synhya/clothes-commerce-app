import React from 'react';
import Link from 'next/link';
import { BreadCrumb } from '@/lib/types/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const Breadcrumb = ({ paths }: { paths: BreadCrumb[] }) => {
  return (
    <nav>
      <ol className='flex gap-2'>
        {paths.map((path, index) => (
          <li key={index} className={cn({
            'font-semibold': index === paths.length - 1,
          })}>
            {index === paths.length - 1 ? (
              <p>{path.label}</p>
            ) : (
              <div className='flex items-center gap-2'>
                <Link href={path.href} className='no-underline hover:underline hover:underline-offset-2'>
                  {path.label}
                </Link>
                <ArrowRightIcon className={cn('w-4 h-4', {
                  'hidden': index === paths.length - 1,
                })} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;