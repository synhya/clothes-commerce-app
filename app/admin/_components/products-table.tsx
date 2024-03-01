import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { PaginationDemo } from '@/app/admin/_components/pagination-demo';

interface ProductsTableShellProps {
  promise: Promise<{
    data: Product[];
    pageCount: number;
  }>;
}

// const ProductsTableShell = ({ tableData }: { tableData: Product[] }) => {
const ProductsTable = ({ tableData, rowCount }: { tableData: Product[], rowCount: number }) => {
  return (
    <>
      <div className="mx-auto max-w-5xl rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox id="select-all" />
              </TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>금액</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead className="max-md:hidden">판매상태</TableHead>
              <TableHead className="max-lg:hidden">등록시간</TableHead>
              <TableHead className="max-lg:hidden">수정시간</TableHead>
              <TableHead className="max-lg:hidden"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  {product.name}
                  <Button size="icon" variant="ghost" className="size-5 lg:hidden">
                    <Link href={`/admin/manage-products/${product.name}`}>
                      <ExternalLinkIcon />
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>{product.price}원</TableCell>
                <TableCell>
                  <div className="flex h-full flex-wrap gap-0.5">
                    {product.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-md:hidden">
                  <Badge variant={product.sale_state === '판매중' ? 'default' : 'secondary'}>
                    {product.sale_state}
                  </Badge>
                </TableCell>
                <TableCell className="max-lg:hidden">
                  {format(product.created_at!, 'Pp', { locale: ko })}
                </TableCell>
                <TableCell className="max-lg:hidden">
                  {format(product.updated_at!, 'Pp', { locale: ko })}
                </TableCell>
                <TableCell className="max-lg:hidden">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/admin/manage-products/${product.name}`}>수정</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mx-2 mb-2 mt-4 md:gap-0 gap-4 flex items-center justify-end md:justify-between flex-col md:flex-row">
          <div className="md:flex-grow mr-auto">총 {rowCount}건</div>
          <PaginationDemo rowCount={rowCount} className="w-auto" />
        </div>
      </div>
    </>
  );
};

export default ProductsTable;
