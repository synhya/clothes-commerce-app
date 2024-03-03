'use server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchProductById, fetchProductByName } from '@/lib/fetchers/product';
import { v5 as uuid } from 'uuid';
import { DBEnums } from '@/lib/types';
import { Inputs } from '@/components/forms/product-form';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const bucket = 'products';
const namespace = '87c9cdf7-101d-4c05-a89d-c7aaff3a3fcf';

export async function createProduct(formData: FormData) {
  const supabase = createAdminClient();
  const imageFile = formData.get('imageFile') as File;

  if (!imageFile) {
    return '이미지가 없습니다.';
  }

  const uniqueName = formData.get('name') as string;

  // first check if unique name exists
  const { data: dupName, error: dupNameError } = await fetchProductByName(uniqueName);

  if (!dupNameError && dupName.name) {
    return '이미 존재하는 상품명입니다.';
  }

  const imageUrl = `${uuid(uniqueName, namespace)}.png`;
  const imageRes = await supabase.storage.from(bucket).upload(imageUrl, imageFile, {
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
  } satisfies
    | Omit<Inputs, 'imageFiles'>
    | {
    image_url: string;
  };

  const { error } = await supabase.from('products').insert({ ...newProduct });

  if (error) {
    return '요청 실패: ' + error.message;
  }

  revalidatePath('/', 'layout'); // revalidate all data
}


export async function updateProduct(formData: FormData) {
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
    const imageRes = await supabase.storage.from(bucket).upload(imageUrl, imageFile, {
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
  } satisfies Omit<Inputs, 'imageFiles'>;

  const updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('products')
    .update({ ...newProduct, updated_at: updated_at })
    .eq('id', formData.get('id'));

  if (imageFile) {
    const { error } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', formData.get('id'));
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

export async function deleteProduct(productId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', productId)
    .limit(1)
    .single();

  if (error) return '이미지 url 접근 실패: ' + error.message;
  else {
    const { error } = await supabase.storage.from(bucket).remove([data.image_url]);

    if (error) return '이미지 삭제 실패: ' + error.message;
    else {
      const { error } = await supabase.from('products').delete().eq('id', productId);

      if (error) return '테이블 데이터 삭제 실패: ' + error.message;
    }
  }

  revalidatePath('/', 'layout');
  redirect(`/admin/search-products`);
}

export async function filterProducts(query: string) {
  if(query.length === 0) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('products')
    .select('id, name, categories')
    //     .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw '요청 실패: ' + error.message;
  }

  return data;
}
