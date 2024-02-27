'use server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { DBEnums, productSizeEnums } from '@/lib/types/database';
import { z } from 'zod';

const FormSchema = z.object({
  selectedColor: z.string({
    invalid_type_error: '사이즈를 선택 해주세요.',
  }),
  selectedSize: z.enum(productSizeEnums, {
    invalid_type_error: '색상을 선택 해주세요.',
  }),
  quantity: z.coerce.number({
    invalid_type_error: '수량을 입력 해주세요.',
  }),
});

const CreateBasketItem = FormSchema;

export type State = {
  errors?: {
    selectedColor?: string[];
    selectedSize?: string[];
  };
  message?: string | null;
};

export async function createBasketItem(productId: string, prevState: State, formData: FormData) {
  const supabase = createClient(cookies());
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return {
      message: '로그인이 필요합니다! ',
    };
  }

  // validate
  const validatedFields = CreateBasketItem.safeParse({
    selectedColor: formData.get('selectedColor'),
    selectedSize: formData.get('selectedSize'),
    quantity: formData.get('quantity'),
  });

  // if validation fails, return errors early
  if (validatedFields.success === false) {
    console.log(validatedFields.error.flatten().fieldErrors);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Basket Item.',
    };
  }

  const { selectedColor, selectedSize, quantity } = validatedFields.data;
  const redirectToCheckout = formData.get('action') === 'checkout';

  const { error } = await supabase.from('basket').insert({
    profile_id: user.id,
    product_id: productId,
    quantity: quantity,
    selected_color: selectedColor,
    selected_size: selectedSize,
  });

  if (error && !redirectToCheckout) {
    return {
      message: 'Failed to add item to basket. ' + error.message,
    };
  }

  revalidatePath('/order/basket');

  if (redirectToCheckout) {
    const { data: basketItem, error } = await supabase
      .from('basket')
      .select('id')
      .eq('profile_id', user.id)
      .eq('product_id', productId)
      .eq('selected_color', selectedColor)
      .eq('selected_size', selectedSize)
      .eq('quantity', quantity)
      .single();

    if (error) {
      return {
        message: 'Failed to find added basket item. ' + error.message,
      };
    }

    redirect(`/order/checkout?basketId=${basketItem.id}`);
  }

  return {
    message: '장바구니에 추가되었습니다!',
  };
}

export async function deleteBasketItem(basketId: string) {
  const supabase = createClient(cookies());
  const { error } = await supabase.from('basket').delete().eq('id', basketId);

  if (error) {
    return {
      message: 'Failed to delete basket item. ' + error.message,
    };
  }

  revalidatePath('/order/basket');

  return {
    message: '장바구니에서 삭제되었습니다!',
  };
}

export async function updateBasketItem(selectedItems: string) {
  const supabase = createClient(cookies());
  const items: string[] = JSON.parse(selectedItems);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const { error: resetError } = await supabase
    .from('basket')
    .update({ is_selected: false })
    .eq('profile_id', user.id);

  if (resetError) {
    return {
      message: 'Failed to reset basket items. ' + resetError.message,
    };
  }

  const { error } = await supabase.from('basket').update({ is_selected: true }).in('id', items);

  if (error) {
    return {
      message: 'Failed to update basket item. ' + error.message,
    };
  }

  revalidatePath('/order');
  redirect('/order/checkout');
}
