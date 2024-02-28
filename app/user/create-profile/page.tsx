import React from 'react';
import CreateProfileForm from '@/components/forms/create-profile-form';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { toast } from 'sonner';

// new user comes here others should be blocked
const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-full flex-col gap-x-4 px-10 py-5 sm:flex-row lg:justify-center">
      <h1 className="whitespace-nowrap text-xl">개인정보 입력</h1>
      <div className="mt-4 sm:mt-14">
        {user ? (
          <CreateProfileForm
            className="grid grid-cols-1 justify-items-start gap-y-4 *:min-w-[240px] md:grid-cols-2 md:gap-x-20"
            email={user.email ?? ''}
          />
        ) : (
          <p>How did you breakthrough middleware..</p>
        )}
      </div>
    </div>
  );
};

export default Page;
