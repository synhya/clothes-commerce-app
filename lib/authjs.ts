import Google from '@auth/core/providers/google';
import Kakao from '@auth/core/providers/kakao';
import NextAuth, { NextAuthConfig, Session, User } from 'next-auth';

import { NextResponse } from 'next/server';
import Credentials from '@auth/core/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { Adapter } from '@auth/core/adapters';
import { env } from '@/lib/env';
import { Route } from 'next';
import { SignJWT } from 'jose';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function sign(
  payload: any,
  exp: string | number | Date,
  secret: string,
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);

  return new SignJWT({ payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export const authConfig: NextAuthConfig = {
  // debug: true,
  pages: {
    signIn: '/sign-in' satisfies Route,
    // verifyRequest: '/login?verify=1', // (used for check email message)
    error: '/sign-in' satisfies Route, // NotFound code passed in query string as ?error=
    newUser: '/sign-up' satisfies Route, // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    Google,
    Kakao,
    Credentials({
      credentials: {
        username: { title: 'Username' },
        password: { title: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return {
            id: '1',
            name: 'admin',
            email: 'admin@admin.com',
            image: '/pay.png',
            role: 'admin',
          };
        }
        return null;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: env.SUPABASE_SERVICE_ROLE_KEY!, // SUPABASE_SERVICE_ROLE_KEY
  }) as Adapter,
  callbacks: {
    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    // jwt({ token, user, trigger, session }) {
    //   if (user) {
    //     token.role = user.role;
    //   }
    //   if (trigger === 'update' && session) {
    //     console.log('update token', token);
    //     console.log('update user', session);
    //     // keep [slug] and email from the session
    //     token.name = session.name;
    //     token.picture = session.picture;
    //   }
    //   return token;
    // },
    async session({
      session,
      user,
      trigger,
      newUser,
    }: {
      session: Session;
      user?: User;
      trigger?: 'update' | undefined;
      newUser?: boolean;
    }) {
      const signingSecret = env.SUPABASE_JWT_SECRET!;
      if (signingSecret && newUser) {
        const exp = Math.floor(new Date(session.expires).getTime() / 1000);

        const payload = {
          aud: 'authendticated',
          sub: user?.id,
          email: user?.email,
          exp: exp,
          role: 'authenticated',
        };

        session.supabaseAccessToken = await sign(payload, exp, signingSecret);
      }

      // if (session.user) {
      //   session.user.role = user?.role ?? 'user'; 권한은 엑세스 토큰에 넣어야함
      // }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      if (pathname.startsWith('/user/login') && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (pathname.startsWith('/dashboard')) {
        // rewrite는 주소창이 바뀌지 않고 페이지만 바뀜
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      }

      // auth parts 버튼 없어도 페이지 이동 가능하니 미들웨어로 처리
      if (
        (pathname.startsWith('/myshop') || pathname.startsWith('/user/update-profile')) &&
        !auth?.user
      ) {
        return NextResponse.redirect(new URL('/user/login', request.url));
      }
      // if (pathname.startsWith('/admin')) {
      //   return auth?.user?.role === 'admin';
      // }
      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
