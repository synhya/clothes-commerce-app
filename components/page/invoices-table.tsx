import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Invoice } from '@/lib/types/database';

const InvoicesTable = ({ invoices }: { invoices: Invoice[] }) => {
  return (
    <Table>
      <TableCaption>최근 3개월 이내의 내역만 표시됩니다</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] md:w-[200px]">주문일자</TableHead>
          <TableHead>배송방법</TableHead>
          <TableHead>배송주소</TableHead>
          <TableHead className="text-right">총 주문금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium tabular-nums">
              {format(invoice.created_at, 'PPPP', { locale: ko })}
            </TableCell>
            <TableCell>{invoice.shipment_method}</TableCell>
            <TableCell>{invoice.customer_info.main_address}</TableCell>
            <TableCell className="text-right tabular-nums">{invoice.total_price}원</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoicesTable;
