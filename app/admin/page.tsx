import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import RevenueCard from '@/components/cards/revenue-card';
import DashboardCardSkeleton from '@/app/admin/_components/dashboard-card-skeleton';
import UserCountCard from '@/components/cards/user-count-card';
import SalesCountCard from '@/components/cards/sales-count-card';

const Page = async () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<DashboardCardSkeleton />}>
        <RevenueCard />
      </Suspense>
      <Suspense fallback={<DashboardCardSkeleton />}>
        <UserCountCard />
      </Suspense>
      <Suspense fallback={<DashboardCardSkeleton />}>
        <SalesCountCard />
      </Suspense>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">온라인</CardTitle>
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
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+1</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
