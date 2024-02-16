'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">결과 없음</h2>
      <p>해당 이름의 물품이 없습니다.</p>
      <Button variant="destructive" size="lg" asChild>
        <Link href="/admin/search-products">돌아가기</Link>
      </Button>
    </div>
  );
}

export default NotFound;
