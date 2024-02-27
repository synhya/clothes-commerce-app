import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { startOfWeek, startOfYesterday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SalesCountCard = async () => {
  const supabase = createAdminClient();

  const totalSold = await supabase
    .from('invoice_products')
    .select(
      `
    invoice_id,
    quantity,
    invoices!inner(state)
    `,
    )
    .neq('invoices.state', '결제대기')
    .then((products) => products.data.reduce((acc, product) => acc + product.quantity, 0));

  const totalSoldYesterday = await supabase
    .from('invoice_products')
    .select(
      `
    invoice_id,
    quantity,
    invoices!inner(created_at, state)
    `,
    )
    .lt('invoices.created_at', startOfYesterday().toISOString())
    .neq('invoices.state', '결제대기')
    .then((products) => products.data.reduce((acc, product) => acc + product.quantity, 0));

  const increaseRate =
    ((totalSold - totalSoldYesterday) / (totalSoldYesterday == 0 ? 1 : totalSoldYesterday)) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">판매량</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{totalSold}</div>
        <p className="text-xs text-muted-foreground">저번 주부터 +{increaseRate}%</p>
      </CardContent>
    </Card>
  );
};

export default SalesCountCard;
