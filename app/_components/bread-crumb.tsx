import React from 'react';
import Link from 'next/link';
import { BreadCrumb } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const BreadCrumb = ({ paths }: { paths: BreadCrumb[] }) => {
  return (
    <nav>
      <ol className="flex gap-2">
        {paths.map((path, index) => (
          <li
            key={index}
            className={cn({
              'font-semibold': index === paths.length - 1,
            })}
          >
            {index === paths.length - 1 ? (
              <p>{path.title}</p>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={path.href}
                  className="no-underline hover:underline hover:underline-offset-2"
                >
                  {path.title}
                </Link>
                <ArrowRightIcon
                  className={cn('h-4 w-4', {
                    hidden: index === paths.length - 1,
                  })}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
