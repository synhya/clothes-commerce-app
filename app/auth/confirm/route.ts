import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { EmailOtpType } from '@supabase/gotrue-js';
import { createRouteHandlerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();

  const searchParams = request.nextUrl.searchParams;
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (token_hash && type) {
    const supabase = createRouteHandlerClient(cookieStore);

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
    if (!error) {
      redirectTo.searchParams.delete('next');
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = '/error';
  return NextResponse.redirect(redirectTo);
}
