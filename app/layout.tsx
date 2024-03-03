import type { Metadata } from 'next';
import './globals.css';
import MainNav from '@/components/layout/main-nav';
import Providers from '@/components/providers';
import SiteFooter from '@/components/layout/site-footer';
import MobileNav from '@/components/layout/mobile-nav';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Toaster } from '@/components/ui/sonner';
import { fontHeader, fontSans } from '@/lib/fonts';
import { absoluteUrl, cn } from '@/lib/utils';
import { env } from '@/lib/env';
import { siteConfig } from '@/config/site';
import SiteHeader from '@/components/layout/site-header';

export const metadata: Metadata = {
  // metadataBase has default values
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['nextjs', 'react', 'e-commerce', 'clothing', 'fashion'],
  authors: [
    {
      name: 'synhya',
      url: 'https://www.github.com/synhya',
    },
  ],
  creator: 'synhya',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: absoluteUrl("/site.webmanifest"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontHeader.variable} ${fontSans.variable}`}>
      <body className={'min-h-screen bg-background font-sans antialiased'}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
