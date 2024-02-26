import React from 'react';
import DefaultLayout from '@/components/layout/default-layout';
export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <DefaultLayout label='주문내역'>
      {children}
    </DefaultLayout>
  );
};
