import React from 'react';
import CreateProfileForm from '@/components/page/user/create-profile-form';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
import ToasterOnMount from '@/components/page/toaster-on-mount';

// new user comes here others should be blocked
const Page = async ({
  searchParams,
}: {
  searchParams: {
    email?: string;
  }
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="h-full flex flex-col sm:flex-row px-10 py-5 gap-x-4 lg:justify-center">
      <h1 className="text-xl whitespace-nowrap">개인정보 입력</h1>
      <div className="mt-4 sm:mt-14">
        {user ? <CreateProfileForm className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20 justify-items-start *:min-w-[240px]" email={user.email ?? ''}/> : <p>How did you breakthrough middleware..</p>}
      </div>
      {searchParams.email && (
        <ToasterOnMount title="이메일 전송완료" description={`${searchParams.email}로 이메일을 전송했습니다. 이메일을 확인해주세요.`}/>
      )}
    </div>
  );
};

export default Page;
