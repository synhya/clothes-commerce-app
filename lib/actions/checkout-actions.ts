'use server';
import { InvoiceFormValues } from '@/components/page/order/invoice-form-section';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { LineItem } from '@/lib/types/database';

export type CheckoutActionProps =
  InvoiceFormValues & {lineItems: string, total_price: string};

export async function checkoutAction(formData:CheckoutActionProps) {
  const lineItems: LineItem[] = JSON.parse(formData.lineItems);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: {user} } = await supabase.auth.getUser();

  const { data: invoice , error:invoiceError } = await supabase.from('invoices').insert({
    profile_id: user?.id,
    customer_info: {
      name: formData.name,
      phone: formData.phone,
      main_address: formData.main_address,
      extra_address: formData.extra_address,
    },
    shipment_method: formData.shipment_method,
    total_price: Number(formData.total_price),
  }).select('id').single();

  if (invoiceError) {
    return { error: '주문 생성 실패: ' + invoiceError.message };
  }

  const { error: lineItemError } = await supabase.from('invoice_products')
    .insert(lineItems.map((item) => ({
      ...item,
      invoice_id: invoice.id
  })));

  if (lineItemError) {
    return { error: '주문 상품 생성 실패: ' + lineItemError.message };
  }

  return { data: invoice };
}
