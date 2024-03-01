import type { Metadata } from 'next';
import './globals.css';
import GlobalNavigator from '@/components/layout/global-navigator';
import Providers from '@/components/providers';
import GlobalFooter from '@/components/layout/global-footer';
import GlobalSidebar from '@/components/layout/global-sidebar';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Toaster } from '@/components/ui/sonner';
import { fontHeader, fontSans } from '@/lib/fonts';
import { absoluteUrl, cn } from '@/lib/utils';
import { env } from '@/lib/env';
import { siteConfig } from '@/config/site';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <html lang="en" className={`${fontHeader.variable} ${fontSans.variable}`}>
      <body className={'min-h-screen bg-background font-sans antialiased'}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <div className="sticky top-0 z-10">
              <GlobalNavigator isLoggedIn={!!user} isAdmin={isAdmin} />
            </div>
            <div className="flex flex-grow">
              <GlobalSidebar />
              <main className="flex-grow">{children}</main>
            </div>
            <GlobalFooter />
          </div>
          {/*<Suspense fallback={null}>*/}
          {/*  <NavigationEvents />*/}
          {/*</Suspense>*/}
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
