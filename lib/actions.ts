'use server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BASE_URL, LOGIN_PATH, NEW_USER_PATH, SIGNUP_PATH } from '@/lib/paths';
import { ProfileFormSchema } from '@/components/page/user/profile-form';
import { SignupFormSchema } from '@/components/page/user/register-email-form';
import { ProductFormSchema } from '@/components/page/admin/add-product-form';
import { v4 as uuid } from 'uuid';


const bucket = 'products';

export async function createProduct (formData: ProductFormSchema) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore); // role: manager.

  const { imageFile, ...dataWithoutImage } = formData;

  // upload image to storage
  const imageUrl = `${uuid()}.png`;
  const imageRes = await supabase
    .storage
    .from(bucket)
    .upload(imageUrl, imageFile, {
      cacheControl: '3600',
      upsert: true,
    })

  if (imageRes.error) {
    return new Error('이미지 업로드 실패: ' + imageRes.error.message);
  }

  // update product table

  const { error } = await supabase.from('products').insert({
    ...dataWithoutImage,
    image_url: imageUrl,
  });

  if (error) {
    return new Error('상품 생성 실패: ' + error.message);
  }

  revalidatePath('/admin');
  return null;
}

export async function updateProduct (formData: any) {
  const supabase = createAdminClient();
}


export async function deleteProduct (formData: any) {
  const supabase = createAdminClient();


}

// // NextRequestApi type is for the Next.js API routes not route handlers
// export const GET = async (req: NextRequest) => {
//   const supabase = createClient(cookies());
//   const { data } = await supabase.from('notes').select('*');
//   return NextResponse.json(data);
//
// }
//
// // POST request or header or cookie makes the route dynamic automatically
// export const POST = async (req: NextRequest) => {
//   const supabase = createClient(cookies());
//   const { title } = await req.json();
//   const { data } = await supabase.from('notes').insert({ title });
//   return NextResponse.json(data);
// }
//
// export const PUT = async (req: NextRequest) => {
//   const supabase = createClient(cookies());
//   const { id, title } = await req.json();
//   const { data } = await supabase.from('notes').update({ title: title }).match({ id });
//   return NextResponse.json(data);
// }

export async function createProfile (formData: ProfileFormSchema) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Error('로그인이 필요합니다.');
  }

  // rls: only read operation is allowed
  const admin = createAdminClient();

  const { error } = await admin.from('profiles').insert({
    ...formData,
    id: user.id,
    birthdate: formData.birthdate.toUTCString(),
  });

  if (error) {
    return new Error('프로필 생성 실패: ' + error.message);
  }

  redirect(`/?newUser=${encodeURIComponent(formData.name)}`); //
}

// move to browser context
export async function signUp (formData: SignupFormSchema) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error } = await supabase.auth.signUp({
    ...formData,
    options: {
      emailRedirectTo: BASE_URL + SIGNUP_PATH,
    },
  });

  // const admin = createAdminClient();
  // if(user) {
  //   const { data } = await admin.auth.admin.getUserById(user.id);
  //
  //   if(data) {
  //     throw "이미 가입된 이메일입니다.";
  //   }
  // }

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
