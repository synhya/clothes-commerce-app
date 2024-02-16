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
import { Product } from '@/lib/types/database';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const ProductTable = ({ tableData }: { tableData: Product[] }) => {
  return (
    <>
      <div className="rounded-md border max-w-5xl mx-auto">
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
        <div className="mx-2 mb-2 mt-4 flex items-center justify-between">
          <div>총 {tableData?.length ?? 0}건</div>
          <div className="flex space-x-1">
            <Button variant="ghost">{`<`}</Button>
            <Button variant="ghost">1</Button>
            <Button variant="ghost">2</Button>
            <Button variant="ghost">{`>`}</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
