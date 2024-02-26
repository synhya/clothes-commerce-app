'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from 'react-query';

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...props}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default Providers;
