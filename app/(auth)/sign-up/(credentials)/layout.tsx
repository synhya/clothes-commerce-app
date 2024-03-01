import * as React from 'react';
import SignupFormProvider from '@/app/(auth)/sign-up/(credentials)/SignupFormProvider';

interface LayoutProps extends React.PropsWithChildren {}
export default async function SignupLayout ({children}: LayoutProps) {
  return (
    <SignupFormProvider>
      {children}
    </SignupFormProvider>
  );
};
