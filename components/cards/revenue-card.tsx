import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAdminClient } from '@/lib/supabase/admin';
import { startOfYesterday } from 'date-fns';

const RevenueCard = async () => {
  const supabase = createAdminClient();

  const totalRevenue = await supabase
    .from('invoices')
    .select('total_price')
    .neq('state', '결제대기')
    .then((invoices) => {
      return invoices.data.reduce((acc, invoice) => acc + invoice.total_price, 0);
    });
  const totalRevenueYesterday = await supabase
    .from('invoices')
    .select('total_price')
    .neq('state', '결제대기')
    .lt('created_at', startOfYesterday().toISOString())
    .then((invoices) => {
      return invoices.data.reduce((acc, invoice) => acc + invoice.total_price, 0);
    });
  const revenueIncreaseRate = Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(
    ((totalRevenue - totalRevenueYesterday) /
      (totalRevenueYesterday == 0 ? 100 : totalRevenueYesterday)) *
      100,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">총 수입</CardTitle>
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
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalRevenue}원</div>
        <p className="text-xs text-muted-foreground">어제부터 +{revenueIncreaseRate}%</p>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
