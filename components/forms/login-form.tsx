'use client';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { Provider } from '@supabase/gotrue-js';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { Route } from 'next';
import { signInSchema } from '@/lib/validations/user';

type Inputs = Required<z.infer<typeof signInSchema>>;

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoginForm = ({ className, ...props }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<Inputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'admin1234@gmail.com',
      password: 'admin1234',
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setIsLoading(false);
      setShowLoginAlert(true);
      switch (error.message) {
        case 'Email not confirmed':
          toast('이메일 인증이 필요합니다.');
          break;
        case 'Invalid login credentials':
          toast('아이디 또는 비밀번호가 잘못되었습니다.');
          break;
      }
    } else {
      // 프로필이없으면 생성 아니면 메인페이지로
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select()
          .eq('id', session.user.id)
          .limit(1)
          .single();
        if (!!data) {
          router.push('/sign-up' satisfies Route);
        }
      }

      router.push('/');
      router.refresh();
    }
  };

  const handleSignInWithOAuth = async (provider: Provider) => {
    const supabase = createClient();
    const { data } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log(data);
    router.refresh();
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid gap-3">
            <div className="grid space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="이메일"
                        type="text"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage className="h-3.5"> </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        placeholder="비밀번호"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      variant="link"
                      type="button"
                      className="absolute right-2 top-1.5 translate-y-1/2 p-1"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </Button>
                    <FormDescription />
                    <FormMessage className="h-3.5">
                      {showLoginAlert ? '아이디 또는 비밀번호가 잘못되었습니다.' : ' '}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              로그인
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
        <Button
          type="button"
          className="mx-1"
          variant="link"
          onClick={() =>
            toast('미구현 상태입니다.')
          }
        >
          아이디 찾기
        </Button>
        <Separator className="bg-border" orientation="vertical" />
        <Button
          type="button"
          className="mx-1"
          variant="link"
          onClick={() =>
            toast('미구현 상태입니다.')
          }
        >
          비밀번호 찾기
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="bg-yellow-400 text-black hover:bg-amber-400"
        disabled={isLoading}
        onClick={() => handleSignInWithOAuth('kakao')}
      >
        {isLoading ? (
          <Icons.spinner className="ml-0.5 mr-2.5 h-4 w-4 animate-spin" />
        ) : (
          <Icons.kakao className="mr-2 h-5 w-5" />
        )}
        카카오로 로그인
      </Button>
      <Button
        variant="outline"
        className="bg-white text-black"
        disabled={isLoading}
        onClick={() => handleSignInWithOAuth('google')}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        구글로 로그인
      </Button>
      <p className="px-8 text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요? <Link href={'/sign-up'}>회원가입</Link>
      </p>
    </div>
  );
};

export default LoginForm;
