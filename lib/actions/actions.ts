'use server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BASE_URL, NEW_USER_PATH, SIGNUP_PATH } from '@/lib/paths';
import { ProfileFormSchema } from '@/components/page/user/profile-form';
import { SignupFormSchema } from '@/components/page/user/register-email-form';
import { v5 as uuid } from 'uuid';
import { ProductFormSchema } from '@/components/page/admin/product-form';
import { createAdminClient } from '@/lib/supabase/admin';
import { DBEnums } from '@/lib/types/database';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchProductById, fetchProductByName } from '@/lib/fetches';
import Stripe from 'stripe';

const bucket = 'products';
const namespace = '87c9cdf7-101d-4c05-a89d-c7aaff3a3fcf';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function updateProduct (formData: FormData) {
  const supabase = createAdminClient();
  const imageFile = formData.get('imageFile') as File;

  const uniqueName = formData.get('name') as string;
  const imageUrl = `${uuid(uniqueName, namespace)}.png`;

  const { data: prevProduct } = await fetchProductById(formData.get('id') as string);
  if (prevProduct.name !== uniqueName) {
    // 이름이 바뀌었으므로 기존 이미지 삭제
    const { error } = await supabase.storage.from(bucket).remove([prevProduct.image_url]);

    if (error) {
      return '이름 변경으로 인한 기존이미지 삭제 실패: ' + error.message;
    }
  }

  if (imageFile) {
    const imageRes = await supabase
      .storage
      .from(bucket)
      .upload(imageUrl, imageFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (imageRes.error) {
      return '이미지 업로드 실패: ' + imageRes.error.message;
    }
  }

  // update category table
  let newProduct = {
    name: uniqueName,
    price: Number(formData.get('price')),
    description: formData.get('description') as string,
    categories: JSON.parse(formData.get('categories') as string),
    tags: JSON.parse(formData.get('tags') as string),
    available_sizes: JSON.parse(formData.get('available_sizes') as string),
    available_colors: JSON.parse(formData.get('available_colors') as string),
    sale_state: formData.get('sale_state') as DBEnums['sale_state'],
  } satisfies Omit<ProductFormSchema, 'imageFiles'>;

  const updated_at = new Date().toISOString();

  const { error } = await supabase.from('products')
    .update({ ...newProduct, updated_at: updated_at})
    .eq('id', formData.get('id'));

  if (imageFile) {
    const { error } = await supabase.from('products').update({ image_url: imageUrl }).eq('id', formData.get('id'));
    if (error) {
      return '요청 실패: ' + error.message;
    }
  }

  if (error) {
    return '요청 실패: ' + error.message;
  }

  revalidatePath('/', 'layout'); // revalidate all data?
  redirect(`/admin/manage-products/${encodeURIComponent(newProduct.name)}`); //
}

export async function deleteProduct (productId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.from('products').select('image_url').eq('id', productId).limit(1).single();

  if (error)
    return '이미지 url 접근 실패: ' + error.message;
  else {
    const { error } = await supabase.storage.from(bucket).remove([data.image_url]);

    if (error)
      return '이미지 삭제 실패: ' + error.message;
    else {
      const { error } = await supabase.from('products').delete().eq('id', productId);

      if (error)
        return '테이블 데이터 삭제 실패: ' + error.message;
    }
  }


  revalidatePath('/', 'layout');
  redirect(`/admin/search-products`);
}

export async function createProduct (formData: FormData) {
  const supabase = createAdminClient();
  const imageFile = formData.get('imageFile') as File;

  if (!imageFile) {
    return '이미지가 없습니다.';
  }

  const uniqueName = formData.get('name') as string;

  // first check if unique name exists
  const { data: dupName, error:dupNameError } = await fetchProductByName(uniqueName);

  if (dupName.name) {
    return '이미 존재하는 상품명입니다.';
  }

  const imageUrl = `${uuid(uniqueName, namespace)}.png`;
  const imageRes = await supabase
    .storage
    .from(bucket)
    .upload(imageUrl, imageFile, {
      cacheControl: '3600',
      upsert: true,
    });

  if (imageRes.error) {
    return '이미지 업로드 실패: ' + imageRes.error.message;
  }

  // update category table
  const newProduct = {
    name: uniqueName,
    price: Number(formData.get('price')),
    description: formData.get('description') as string,
    categories: JSON.parse(formData.get('categories') as string),
    tags: JSON.parse(formData.get('tags') as string),
    available_sizes: JSON.parse(formData.get('available_sizes') as string),
    available_colors: JSON.parse(formData.get('available_colors') as string),
    sale_state: formData.get('sale_state') as DBEnums['sale_state'],
    image_url: imageUrl,
  } satisfies Omit<ProductFormSchema, 'imageFiles'> | {
    image_url: string
  };

  const { error } = await supabase.from('products').insert({ ...newProduct });

  if (error) {
    return '요청 실패: ' + error.message;
  }

  revalidatePath('/', 'layout'); // revalidate all data
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
