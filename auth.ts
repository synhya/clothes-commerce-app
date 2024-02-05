import Google, { GoogleProfile } from '@auth/core/providers/google';
import Kakao from '@auth/core/providers/kakao';
import NextAuth, { NextAuthConfig, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import Credentials, { CredentialInput } from '@auth/core/providers/credentials';

export const authConfig: NextAuthConfig = {
  // debug: true,
  pages: {
    signIn: '/login',
    // signOut: '/logout',
    // verifyRequest: '/login?verify=1', // (used for check email message)
    error: '/login', // Error code passed in query string as ?error=
    newUser: '/set-profile', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    Google({
      profile(profile: GoogleProfile) {
        // get profile from provider and return user data which will be sent to jwt callback
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        };
      },
    }),
    Kakao,
    Credentials({
      credentials: {
        username: { label: 'Username'},
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials', credentials)
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return {
            id: '1',
            name: 'admin',
            email: 'admin@admin.com',
            image: 'test.png',
            role: 'admin',
          };
        }
        return null;
    }}),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    jwt({ token, user, trigger }) {
      if (user) token.role = user.role;
      return token;
    },
    session({
      session,
      token,
      trigger,
    }: {
      session: Session;
      token?: JWT;
      trigger?: 'update' | undefined;
    }) {
      if (session.user) {
        session.user.role = token?.role ?? 'user';
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      if (pathname.startsWith('/login') && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (pathname.startsWith('/dashboard')) {
        // rewrite는 주소창이 바뀌지 않고 페이지만 바뀜
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      }

      // auth parts 버튼 없어도 페이지 이동 가능하니 미들웨어로 처리
      if (pathname.startsWith('/user')) {
        return ['user', 'admin'].includes(auth?.user?.role as string);
      }
      if (pathname.startsWith('/admin')) {
        return auth?.user?.role === 'admin';
      }
      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
