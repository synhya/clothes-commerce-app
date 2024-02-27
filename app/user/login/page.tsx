import LoginForm from '@/components/page/user/login-form';
import React from 'react';
import loginSideImg from '@/public/login-side-img.png';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import ToasterOnMount from '@/components/page/shared/toaster-on-mount';

const LoginPage = () => {
  return (
    // div 태그는 기본적으로 width: auto; height: auto; display: block; 이다.
    // auto 는 부모 요소의 크기에 맞춰서 크기가 조절된다.
    // mx-auto 는 margin-left: auto; margin-right: auto; 를 의미한다.
    // 블록요소를 중앙에 정렬하기 위해서는 width: auto; margin-left: auto; margin-right: auto; 를 사용한다.
    // w-full 은 width: 100%; 를 의미한다.
    // 블록요소에서 width: 100%; 는 width: auto; 와 같은 의미이다. (인라인에선 w-fit처럼 동작한다.)
    <div className="flex h-full items-center justify-center lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 flex items-center">
          <Image src={loginSideImg} alt="로그인" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative mt-auto">
          <blockquote className="text-2xl font-semibold"></blockquote>
        </div>
      </div>
      <div className="container max-w-[400px] space-y-6 lg:p-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight md:tracking-normal">로그인</h1>
          <p className="text-sm text-muted-foreground">로그인하여 서비스를 이용하세요.</p>
        </div>
        {/*<LoginForm />*/}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
