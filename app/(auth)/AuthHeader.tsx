'use client';
import * as React from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
import { authPageConfig } from '@/config/site';
import { Progress } from '@/components/ui/progress';

export default function AuthHeader () {
  const segments = useSelectedLayoutSegments();
  const headerItem = authPageConfig.header.find((header) =>
    header.href.includes(segments[segments.length - 1]));

  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight md:tracking-normal">
        {headerItem?.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {headerItem?.description}
      </p>
      {headerItem.progress && (
        <Progress value={headerItem.progress * 100} />
      )}
    </div>
  );
};
