'use client';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';

type DefaultLayoutProps = {
  children: React.ReactNode;
  routes: {
    label: string;
    pathname: string;
    matchOptions?: {
      inclusive?: boolean;
    };
  }[];
};

const DefaultLayout = ({ children, routes }: DefaultLayoutProps) => {
  const pathname = usePathname();

  const { label } = routes.find((route) =>
    route.matchOptions?.inclusive ? pathname.includes(route.pathname) : pathname === route.pathname,
  ) ?? { label: '맞는 라벨없음' };

  return (
    <div className="mx-0 my-10 min-h-[500px] sm:mx-2 md:mx-10">
      <div className="mx-8 mb-10 md:mx-0">
        <h1 className="text-2xl font-semibold">{label}</h1>
        <Separator />
      </div>
      {children}
    </div>
  );
};
export default DefaultLayout;
