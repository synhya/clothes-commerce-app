'use client';
import React, { useCallback, useState } from 'react';
import { loginAction } from '@/lib/actions';
import Image from 'next/image';
import { GoogleIcon } from '@/components/ui/company-icons';
import LoginWrongAlert from '@/components/page/login/login-wrong-alert';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type LoginFormValue = {
  username: string;
  password: string;
  remember: boolean;
};

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const handleFinish = useCallback(async (value: LoginFormValue) => {
    setIsLoading(true);

    loginAction('credentials', value.username, value.password).catch((err) => {
      setIsLoading(false);
      setShowLoginAlert(true);
      console.error(err);
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col max-w-[400px] items-center">
        {showLoginAlert && (
          <LoginWrongAlert />
        )}
        <form onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-4">
          <input {...register('firstName')} />
          <input {...register('lastName', { required: true })} />
          {errors.lastName && <p>Last name is required.</p>}
          <input {...register('age', { pattern: /\d+/ })} />
          {errors.age && <p>enter number for age</p>}
          <input type="submit" />
        </form>
        <Button className="w-full" size="large" type="default" icon={<FormOutlined />}>
          회원가입
        </Button>
        <Button className="relative w-full mt-4" size="large" onClick={() => loginAction('kakao')}>
          <Image
            className="absolute"
            src="/kakao_login.svg"
            alt="kakao"
            width={25}
            height={25}
          />
          카카오 로그인
          </Button>
          <Button className="relative w-full mt-4" size="large" onClick={() => loginAction('google')}>
            <Image
              className="absolute left-0 -top-0.5"
              src="/google_login.svg"
              alt="google"
              width={45}
              height={45}
            />
            구글 로그인
          </Button>
      </div>
    </div>
  );
};

export default LoginForm;
