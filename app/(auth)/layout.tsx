import * as React from 'react';
import Image from 'next/image';
import loginSideImg from '@/public/login-side-img.png';
import AuthHeader from '@/app/(auth)/AuthHeader';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { siteConfig } from '@/config/site';

interface LayoutProps extends React.PropsWithChildren {};
export default function AuthLayout ({children}: LayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={loginSideImg}
          alt="로그인 사이드 이미지"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
      </AspectRatio>
      <div className="mt-10 w-full md:mt-8 lg:mt-0 absolute md:static col-span-1 flex flex-col left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 items-center space-y-6 lg:p-8 md:col-span-2 lg:col-span-1">
        <AuthHeader />
        {children}
      </div>
    </div>
  );
};
