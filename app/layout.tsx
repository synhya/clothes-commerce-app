import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalNavigator from '@/components/layout/global-navigator';
import Providers from '@/components/page/providers';
import GlobalFooter from '@/components/layout/global-footer';
import GlobalSidebar from '@/components/layout/global-sidebar';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { TailwindIndicator } from '@/components/page/tailwind-indicator';
import { Toaster } from '@/components/ui/sonner';
import NavigationEvents from '@/components/page/navigation-events';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: "Shadcn Phone Input",
//   description: `A phone input component implementation of Shadcn's input component`,
//   keywords: [
//     "shadcn",
//     "phone input",
//     "shadcn/ui",
//     "shadcn phone input",
//     "phone input component",
//     "shadcn phone input component",
//     "input",
//     "radix ui",
//     "react phone input",
//   ],
//   authors: [
//     {
//       name: "Omer Alpi",
//       url: "https://jaleelbennett.com",
//     },
//   ],
//   creator: "Omer Alpi",
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: siteConfig.url,
//     title: siteConfig.name,
//     description: siteConfig.description,
//     siteName: siteConfig.name,
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: siteConfig.name,
//     description: siteConfig.description,
//     creator: "@omeralpi",
//   },
// };
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
    <html lang="en">
      <body className={inter.className}>
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
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>
          <Toaster />
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
