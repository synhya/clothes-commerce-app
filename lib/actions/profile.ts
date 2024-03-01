'use server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { UpdateFormSchema } from '@/components/forms/update-profile-form';
import { AddressInfo } from '@/components/forms/update-address-form';
import { z } from 'zod';
import { addProfileSchema, signUpSchema } from '@/lib/validations/user';

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
    throw Error('프로필 업데이트 실패: ' + profileError.message);
  }

  revalidatePath('/');
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
    throw Error('주소 업데이트 실패: ' + (deleteError?.message || insertError?.message));
  }

  revalidatePath('/');
}

export async function addProfile(rawInput: z.infer<typeof addProfileSchema>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw Error('로그인이 필요합니다.');
  }

  const { main_address, extra_address, birthdate, ...profileData } =
    addProfileSchema.parse(rawInput);

  const { error: profileError } = await supabase.from('profiles').insert({
    ...profileData,
    id: user.id,
    email: user.email,
    birthdate: birthdate.toUTCString(),
  });

  if (profileError) {
    throw Error('프로필 생성 실패: ' + profileError.message);
  }

  const { error: addressError } = await supabase.from('profile_address').insert({
    profile_id: user.id,
    main_address,
    extra_address,
    is_main: true,
  });

  if (addressError) {
    throw Error('주소 생성 실패: ' + addressError.message);
  }

  revalidatePath('/');
}

export async function signUp(rawInput: z.infer<typeof signUpSchema>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const input = signUpSchema.parse(rawInput);

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw Error('회원가입 실패: ' + error.message);
  }

  revalidatePath('/');
}
