import React from 'react';
import DefaultLayout from '@/components/layout/default-layout';

const routes = [
  { label: '장바구니', pathname: '/order/basket' },
  { label: '주문내역', pathname: '/order/list' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout routes={routes}>{children}</DefaultLayout>;
}
