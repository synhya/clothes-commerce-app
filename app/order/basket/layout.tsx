import React from 'react';
import DefaultLayout from '@/components/layout/default-layout';
export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <DefaultLayout label='장바구니'>
      {children}
    </DefaultLayout>
  );
};
