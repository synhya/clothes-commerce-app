'use server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BASE_URL, NEW_USER_PATH, SIGNUP_PATH } from '@/lib/paths';
import { ProfileFormSchema } from '@/components/page/user/profile-form';
import { SignupFormSchema } from '@/components/page/user/register-email-form';
import { v5 as uuid } from 'uuid';
import { addProductFormSchema, ProductFormSchema } from '@/components/page/admin/add-product-form';
import { createAdminClient } from '@/lib/supabase/admin';
import { Enums } from '@/lib/types/database';


const bucket = 'products';
const namespace = '87c9cdf7-101d-4c05-a89d-c7aaff3a3fcf';

export async function createProduct (formData: FormData) {
  // const cookieStore = cookies();
  // const supabase = createClient(cookieStore); // role: manager. not working for now

  // 이렇게 하면 JSON.parse가 필요없긴한데 더 느릴듯
  const validatedFields = addProductFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return '입력값이 잘못되었습니다.';
  }

  const supabase = createAdminClient();

  const imageFile = formData.get('imageFile') as File;

  if (!imageFile) {
    return '이미지가 없습니다.';
  }

  const uniqueName = formData.get('name') as string;
  const imageUrl = `${uuid(uniqueName, namespace)}.png`;
  const imageRes = await supabase
    .storage
    .from(bucket)
    .upload(imageUrl, imageFile, {
      cacheControl: '3600',
      upsert: true,
    })

  if (imageRes.error) {
    return '이미지 업로드 실패: ' + imageRes.error.message;
  }

  // update product table
  const newProduct = {
    name: uniqueName,
    price: Number(formData.get('price')),
    description: formData.get('description') as string,
    categories: JSON.parse(formData.get('categories') as string),
    tags: JSON.parse(formData.get('tags') as string),
    available_sizes: JSON.parse(formData.get('available_sizes') as string),
    available_colors: JSON.parse(formData.get('available_colors') as string),
    sale_state: formData.get('sale_state') as Enums['sale_state'],
    image_url: imageUrl,
  } satisfies Omit<ProductFormSchema, 'imageFiles'> | { image_url: string };

  const { error } = await supabase.from('products').insert({...newProduct});

  if (error) {
    return '상품 생성 실패: ' + error.message;
  }

  revalidatePath('/', 'layout') // revalidate all data
}

export async function testAction (formData: File) {
  console.log(formData.name, formData.size, formData.type);
}

export async function updateProduct (formData: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);


}


export async function deleteProduct (formData: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);


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
    return '로그인이 필요합니다.';
  }

  const { error } = await supabase.from('profiles').insert({
    ...formData,
    id: user.id,
    birthdate: formData.birthdate.toUTCString(),
  });

  if (error) {
    return '프로필 생성 실패: ' + error.message;
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
