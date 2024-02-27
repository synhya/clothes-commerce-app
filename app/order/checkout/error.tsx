'use client';
import React from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const Page = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4">
      <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
      <p className="text-center text-2xl font-semibold">{error.message}</p>
    </div>
  );
};

export default Page;
