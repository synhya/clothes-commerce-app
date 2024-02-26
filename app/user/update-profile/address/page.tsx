import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import UpdateAddressForm from '@/components/page/user/update-address-form';

const Page = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const { data: addressList } = await supabase.from('profile_address')
    .select('main_address, extra_address, is_main').eq('profile_id', user.id)
    .order('is_main', { ascending: false });

  return (
    <section className='h-fit'>
      <UpdateAddressForm addressList={addressList}/>
    </section>
  );
};

export default Page;
