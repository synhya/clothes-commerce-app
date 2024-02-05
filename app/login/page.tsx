import LoginForm from '@/components/page/login/login-form';
import React from 'react';
import SideBg from '@/components/page/login/side-bg';
import { auth } from '@/auth';

const LoginPage = async () => {
  const session = await auth();
  const a = session?.user;

  return (
    <div className="flex bg-white items-center min-h-screen w-full">
      <div className="relative h-screen w-0 lg:w-1/2 bg-gradient-to-br from-pink-500 to-yellow-300 transition-all">
      </div>
      <div className="w-full lg:w-1/2 transition-all">
        <div className="relative flex justify-center">
          <section className="flex flex-col items-center justify-center px-5 text-gray-800 w-full sm:w-4/6 md:w-3/6 lg:w-4/6 xl:w-3/6 transition-all">
            <div className='text-center'>
              <h1 className="text-4xl font-bold mb-4">로그인</h1>
              <p className="text-gray-600 mb-4">로그인하여 계속 진행해주세요.</p>
            </div>
            <div className="w-full px-0 sm:px-6 transition-all">
              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
