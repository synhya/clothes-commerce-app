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

const ProductTable = ({ tableData }: { tableData: Product[] }) => {
  return (
    <>
      <div className="mb-4">
        <Button variant="secondary">엑셀 다운로드</Button>
      </div>
      <div className="mr-2 rounded-md border">
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
              <TableHead className="max-lg:hidden">상품등록시간</TableHead>
              <TableHead className="max-lg:hidden">수정일시</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}원</TableCell>
                <TableCell className="flex flex-wrap gap-0.5">
                  {product.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell className="max-md:hidden">
                  <Badge variant={product.sale_state === '판매중' ? 'default' : 'secondary'}>
                    {product.sale_state}
                  </Badge>
                </TableCell>
                <TableCell className="max-lg:hidden">{format(product.created_at!, "PPP", { locale: ko })}</TableCell>
                <TableCell className="max-lg:hidden">{format(product.created_at!, "PPP", { locale: ko })}</TableCell>
              </TableRow>
            ))}
            {/*<TableRow>*/}
            {/*  <TableCell>*/}
            {/*    <Checkbox id="product-1" />*/}
            {/*  </TableCell>*/}
            {/*  <TableCell className="font-medium">A0001</TableCell>*/}
            {/*  <TableCell>apple iPhone 14 Pro</TableCell>*/}
            {/*  <TableCell>1,550,000원</TableCell>*/}
            {/*  <TableCell>*/}
            {/*    <Badge variant="secondary">SALE</Badge>*/}
            {/*  </TableCell>*/}
            {/*  <TableCell>2023/02/02 10:00</TableCell>*/}
            {/*  <TableCell>2023/02/02 10:00</TableCell>*/}
            {/*</TableRow>*/}
          </TableBody>
        </Table>
        <div className="mt-4 mx-2 mb-2 flex items-center justify-between">
          <div>총 {tableData.length}건</div>
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
