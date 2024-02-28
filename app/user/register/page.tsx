import React from 'react';
import RegisterEmailForm from '@/components/forms/register-email-form';

// form signUp
const Page = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="my-10 flex w-full max-w-[300px] flex-col items-center space-y-4 px-1 sm:max-w-[400px] sm:p-8 md:rounded-md md:border
      md:shadow-[0_0_5px_5px] md:shadow-secondary"
      >
        <h1 className="text-xl">회원가입</h1>
        <RegisterEmailForm className="w-full" />
      </div>
    </div>
  );
};

export default Page;
