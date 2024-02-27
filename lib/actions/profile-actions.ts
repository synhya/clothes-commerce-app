'use server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BASE_URL, NEW_USER_PATH, SIGNUP_PATH } from '@/lib/paths';
import { ProfileFormSchema } from '@/components/page/user/create-profile-form';
import { SignupFormSchema } from '@/components/page/user/register-email-form';
import { v5 as uuid } from 'uuid';
import { ProductFormSchema } from '@/components/page/admin/product-form';
import { createAdminClient } from '@/lib/supabase/admin';
import { DBEnums } from '@/lib/types/database';
import { fetchProductById, fetchProductByName } from '@/lib/fetches';
import Stripe from 'stripe';
import { UpdateFormSchema } from '@/components/page/user/update-profile-form';
import { AddressInfo } from '@/components/page/user/update-address-form';
import { env } from '@/lib/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createProfile(formData: ProfileFormSchema) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return '로그인이 필요합니다.';
  }

  const { main_address, extra_address, birthdate, ...profileData } = formData;

  // webhook only works when deployed
  const customer = await stripe.customers.create({
    email: profileData.email,
  });

  const { error: profileError } = await supabase.from('profiles').insert({
    ...profileData,
    id: user.id,
    birthdate: birthdate.toUTCString(),
    stripe_customer: customer.id,
  });

  if (profileError) {
    return '프로필 생성 실패: ' + profileError.message;
  }

  const { error: addressError } = await supabase.from('profile_address').insert({
    profile_id: user.id,
    main_address,
    extra_address,
    is_main: true,
  });

  if (addressError) {
    return '주소 생성 실패: ' + addressError.message;
  }

  redirect(`/?newUser=${encodeURIComponent(formData.name)}`); //
}

export async function updateProfile(formData: UpdateFormSchema) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      ...formData,
    })
    .eq('id', user.id);

  if (profileError) {
    return { error: '프로필 업데이트 실패: ' + profileError.message };
  }

  revalidatePath('/');
  return { message: '프로필 업데이트 성공' };
}

export async function updateAddress(json: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const addressList: AddressInfo[] = JSON.parse(json);

  const newArrayList = addressList.map((address) => ({
    ...address,
    profile_id: user.id,
  }));

  const { error: deleteError } = await supabase
    .from('profile_address')
    .delete()
    .eq('profile_id', user.id);

  const { error: insertError } = await supabase.from('profile_address').insert([...newArrayList]);

  if (deleteError || insertError) {
    return {
      message: '주소 업데이트 실패: ' + (deleteError || insertError).message,
    };
  }

  revalidatePath('/');
  return { message: '주소 업데이트 성공' };
}

// move to browser context
export async function signUp(formData: SignupFormSchema) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    ...formData,
    options: {
      emailRedirectTo: BASE_URL + SIGNUP_PATH,
    },
  });

  if (error) {
    return error;
  }

  revalidatePath(NEW_USER_PATH, 'layout');
  redirect(NEW_USER_PATH + '?email=' + formData.email);
}

// export const nextAuthLogin = async (
//   provider: BuiltInProviderType,
//   username?: string,
//   password?: string,
// ) => {
//   if (provider === 'credentials') {
//     await wait(1000);
//     await signIn(provider, { username: username, password: password, redirectTo: '/' });
//     return '아이디 또는 비밀번호가 틀렸습니다.';
//   } else {
//     await signIn(provider, { redirectTo: '/' });
//   }
// };
// export const nextAuthLogout = async () => {
//   await signOut();
// };
//
// const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay)); //이와 같이 선언 후
