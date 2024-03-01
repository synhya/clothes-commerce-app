import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions, createServerClient } from '@supabase/ssr';
import { Route } from 'next';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = updateCookies(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signedIn = user !== null;
  let signedUp = false;
  if (signedIn) {
    //.eq('id', user?.id) is not necessary because of rls in supabase
    const { data } = await supabase.from('profiles').select().eq('id', user.id).limit(1).single();
    signedUp = data !== null;
  }
  const isValidUser = signedIn && signedUp;

  // const personalRoutes = ['/user/update-profile']

  if(!isValidUser && request.nextUrl.pathname.startsWith('/user/update-profile')) {
    return NextResponse.redirect(new URL('/sign-in' satisfies Route, request.url));
  }

  // add profile page
  if (isValidUser && request.nextUrl.pathname.startsWith('/sign-up/profile')) {
    return NextResponse.redirect(new URL('/' satisfies Route, request.url));
  }

  // login page
  if (signedIn && request.nextUrl.pathname.startsWith('/sign-in' satisfies Route)) {
    if (isValidUser) return NextResponse.redirect(new URL('/', request.url));
    else
      return NextResponse.redirect(new URL('/sign-up/profile/name' satisfies Route, request.url));
  }

  // admin page
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/?alert=권한이없습니다.', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

function updateCookies(request: NextRequest, response: NextResponse) {
  // cookie, header forwarding
  return createServerClient(
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
}
