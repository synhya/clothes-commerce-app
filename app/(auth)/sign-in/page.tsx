import * as React from 'react';
import LoginForm from '@/components/forms/login-form';
import { Metadata } from 'next';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign In",
  description: "Sign in to your account",
}

export default function Page () {
  return (
    <LoginForm />
  );
};
