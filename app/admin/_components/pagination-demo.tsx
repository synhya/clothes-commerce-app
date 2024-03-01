'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react';
import { Route } from 'next';
import { searchParamsSchema } from '@/lib/validations/params';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationDemoProps extends React.ComponentProps<'div'>{
  rowCount: number;
}

export function PaginationDemo({ rowCount, className }: PaginationDemoProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get('page') ?? 1);
  const perPage = 10; //Number(searchParams.get('per_page'));

  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: pageParam - 1,
    pageSize: perPage,
  });
  const pageCount = Math.ceil(rowCount / pageSize);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      return newParams.toString();
    },
    [searchParams],
  );

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}` as Route,
      {
        scroll: false,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            isActive={pageIndex > 0}
            onClick={() => pageParam > 1 && setPagination({ pageIndex: pageIndex - 1, pageSize })}
          />
        </PaginationItem>
        {pageIndex > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {
          // 3 pages around the current page
          Array.from({ length: 3 }, (_, i) => {
            const offset = pageIndex <= 0 ? 0 : pageIndex >= pageCount - 1 ? -2 : -1;
            const page = pageIndex + i + offset;
            if (page < 0 || page > pageCount - 1) {
              return null;
            }
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={pageIndex === page}
                  onClick={() => setPagination({ pageIndex: page, pageSize: pageSize })}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })
        }
        {pageIndex < pageCount - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            isActive={pageIndex < pageCount - 1}
            onClick={() =>
              pageParam < pageCount && setPagination({ pageIndex: pageIndex + 1, pageSize })
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
