import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// for webhooks
const GET = async (req: NextRequest) => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient(cookieStore);

  const customer = await stripe.customers.create({
    email: (req.body as any).record.email,
  });

  await supabase
    .from('profiles')
    .update({ stripe_customer: customer.id })
    .eq('id', (req.body as any).record.id);

  return NextResponse.json({
    customerId: customer.id,
  });
};
