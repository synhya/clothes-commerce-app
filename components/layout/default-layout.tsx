import React from 'react';
import { Separator } from '@/components/ui/separator';

const DefaultLayout = ({children, label}: {children: React.ReactNode, label: string}) => {
  return (
    <div className='min-h-[500px] mx-0 sm:mx-2 my-10 md:mx-10'>
      <div className='mb-10 mx-8 md:mx-0'>
        <h1 className="text-2xl font-semibold">{label}</h1>
        <Separator />
      </div>
      {children}
    </div>
  );
};
export default DefaultLayout;
