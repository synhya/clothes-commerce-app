'use server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { SignupFormSchema } from '@/components/forms/register-email-form';
import { UpdateFormSchema } from '@/components/forms/update-profile-form';
import { AddressInfo } from '@/components/forms/update-address-form';
import { Route } from 'next';
import { z } from 'zod';
import { profileSchema } from '@/lib/validations/profile';

export async function createProfile(
  rawInput: z.infer<typeof profileSchema>,
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return '로그인이 필요합니다.';
  }

  const { main_address, extra_address, birthdate, ...profileData } = rawInput;

  const { error: profileError } = await supabase.from('profiles').insert({
    ...profileData,
    id: user.id,
    birthdate: birthdate.toUTCString(),
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

  redirect(`/?newUser=${encodeURIComponent(rawInput.name)}`); //
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

  const redirectUrl = new URL('/user/create-profile' satisfies Route, headers().get('referer'))
    .href;

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    ...formData,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    return error;
  }

  console.log(user);

  revalidatePath('/user/create-profile' satisfies Route);
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
