import * as React from 'react';
import MainNav from '@/components/layout/main-nav';
import MobileNav from '@/components/layout/mobile-nav';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import UserMenuDropdown from '@/components/layout/user-menu-dropdown';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import ProductsCommandMenu from '@/components/products-command-menu';
import { siteConfig } from '@/config/site';
import { EnterIcon } from '@radix-ui/react-icons';

export default async function SiteHeader() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center backdrop-blur-md bg-background/60">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ProductsCommandMenu />
          {user ? (
            <UserMenuDropdown isAdmin={isAdmin} avatarUrl={user.user_metadata.avatar_url} />
          ) : (
            <Link href="/sign-in">
              <Button className="max-xxs:hidden" size="sm">
                로그인
              </Button>
              <Button variant="ghost" className="xxs:hidden" size="icon">
                <EnterIcon className="h-6 w-6" />
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
