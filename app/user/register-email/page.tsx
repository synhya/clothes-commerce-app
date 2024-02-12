import React from 'react';
import RegisterEmailForm from '@/components/page/user/register-email-form';

// form signUp
const Page = () => {

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col w-full max-w-[300px] sm:max-w-[400px] items-center space-y-4 md:border px-1 sm:p-8 md:rounded-md md:shadow-secondary
      md:shadow-[0_0_5px_5px]">
        <h1 className="text-xl">회원가입</h1>
        <RegisterEmailForm className='w-full'/>
      </div>
    </div>
  );
};

export default Page;
