import * as React from 'react';
import AddProfileFormProvider from '@/app/(auth)/sign-up/profile/AddProfileFormProvider';

interface LayoutProps extends React.PropsWithChildren {}
export default async function AddProfileLayout ({children}: LayoutProps) {
  return (
    <AddProfileFormProvider>
      {children}
    </AddProfileFormProvider>
  );
};
