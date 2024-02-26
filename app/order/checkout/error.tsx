'use client';
import React from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const Page = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  return (
    <div className="min-h-[400px] h-full flex flex-col justify-center items-center gap-4">
      <ExclamationTriangleIcon className='w-10 h-10 text-red-500'/>
      <p className="text-2xl font-semibold text-center">{error.message}</p>
    </div>
  );
};

export default Page;
