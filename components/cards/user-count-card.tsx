import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const UserCountCard = async () => {
  const supabase = createAdminClient();

  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();
  const currentUsers = users.length;
  const usersLastWeek = users.filter((user) => new Date(user.created_at) > lastWeek).length;
  const userIncreaseRate = Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(
    ((currentUsers - usersLastWeek) / usersLastWeek) * 100,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">가입자 수</CardTitle>
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentUsers}</div>
        <p className="text-xs text-muted-foreground">저번주부터 +{userIncreaseRate}%</p>
      </CardContent>
    </Card>
  );
};

export default UserCountCard;
