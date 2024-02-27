import { NextRequest, NextResponse } from 'next/server';
import { LOGIN_PATH, ACCOUNT_PATH, NEW_USER_PATH, UPDATE_USER_PATH } from '@/lib/paths';
import { CookieOptions, createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // cookie, header forwarding
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  // Always use supabase.auth.getUser() to protect pages and user data.
  // Never trust supabase.auth.getSession() inside server code such as middleware.
  // isn't guaranteed to revalidate the Auth token.
  const {
    data: { user },
  } = await supabase.auth.getUser(); // refresh session

  const signedIn = user !== null;
  let signedUp = false;
  if (signedIn) {
    //.eq('id', user?.id) is not necessary because of rls in supabase
    const { data } = await supabase.from('profiles').select().limit(1).single();
    signedUp = data !== null;
  }
  const isValidUser = signedIn && signedUp;

  // new user page
  if (request.nextUrl.pathname.startsWith(NEW_USER_PATH)) {
    if (!signedIn) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    if (signedUp) return NextResponse.redirect(new URL('/', request.url));
  }

  // // personal page
  // const personalPage = request.nextUrl.pathname.startsWith(ACCOUNT_PATH) ||
  //   request.nextUrl.pathname.startsWith(UPDATE_USER_PATH);
  //
  // if (!isValidUser && personalPage) {
  //   if(!signedIn) return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  //   if(!signedUp) return NextResponse.redirect(new URL(NEW_USER_PATH, request.url));
  // }

  // login page
  if (signedIn && request.nextUrl.pathname.startsWith(LOGIN_PATH)) {
    if (isValidUser) return NextResponse.redirect(new URL('/', request.url));
    else return NextResponse.redirect(new URL(NEW_USER_PATH, request.url));
  }

  // admin page
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/?alert=권한이없습니다.', request.url));
  }

  // 리디렉션해야하는 경우 쿠키 업데이트를 하지는 않지만 괜찮을듯
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
