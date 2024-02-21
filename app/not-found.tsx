'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
// @ts-ignore
import { Button } from '@/components/ui/button';

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">결과 없음</h2>
      <p>해당 이름의 물품이 없습니다.</p>
      <Button variant="destructive" size="lg" onClick={() => router.back()}>
        돌아가기
      </Button>
    </div>
  );
}

export default NotFound;
