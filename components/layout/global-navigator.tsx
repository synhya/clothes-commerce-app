'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { metaCategories, productCategories } from '@/lib/types/client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { HamburgerMenuIcon, PersonIcon, RowsIcon } from '@radix-ui/react-icons';
import useSideBar from '@/lib/hooks/useSidebar';
import { LOGIN_PATH, NEW_USER_PATH, SIGNUP_PATH } from '@/lib/paths';
import UserMenuDropdown from '@/components/layout/user-menu-dropdown';
import { User } from 'next-auth';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import { useThrottledCallback } from 'use-debounce';

const GlobalNavigator = ({ isLoggedIn, isAdmin }: {
  isLoggedIn: boolean;
  isAdmin: boolean;
}) => {
  const router = useRouter();
  const [loggedInState, setLoggedInState] = useState(isLoggedIn);
  const [accentBg, setAccentBg] = useState(false);

  const handleScroll = useThrottledCallback(() => {
    if (window.scrollY > 0) {
      setAccentBg(true);
    } else {
      setAccentBg(false);
    }
  }, 300);

  useEffect(() => {
    setLoggedInState(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSignOut = async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      await supabase.auth.signOut();
      if (window.location.pathname.startsWith(NEW_USER_PATH)) {
        router.push(LOGIN_PATH);
        router.refresh();
        return;
      }
    }

    router.refresh();
  };
  const { open, setOpen } = useSideBar();

  // framer motion animation for scrolling

  const onNavChange = useCallback(() => {
    setTimeout(() => {
      const triggers = document.querySelectorAll('.submenu-trigger[data-state="open"]');
      if (triggers.length === 0) return;

      const firstTrigger = triggers[0] as HTMLElement;
      const viewports = document.getElementsByClassName('submenu-viewport');

      if (viewports.length > 0) {
        const viewport = viewports[0] as HTMLElement;

        // doesn't work , viewport.offsetWidth is 0 in some cases
        // const offsetLeft = firstTrigger.offsetLeft - (viewport.offsetWidth - firstTrigger.offsetWidth)/2;

        viewport.style.left = `${firstTrigger.offsetLeft - (130 - firstTrigger.offsetWidth) / 2}px`;
      }
    });
  }, []);
  return (
    <div className={cn(
      'flex items-center bg-background/60 backdrop-blur-sm py-1 transition-colors duration-500',
      {
        'bg-accent/60': accentBg,
      })}>
      <div
        className='ml-4 text-xl font-semibold text-secondary-foreground underline-offset-4 transition-all duration-300 hover:underline hover:underline-offset-1'>
        <Link href='/' passHref>
          Boutique
        </Link>
      </div>
      <NavigationMenu onValueChange={onNavChange}>
        <Button
          variant='ghost'
          className={cn('ml-1.5 scale-100 transition-transform delay-200 nav-md:hidden', {
            'scale-0 delay-0': open,
          })}
          size='icon'
          onClick={() => setOpen(true)}
        >
          <HamburgerMenuIcon className='size-6' />
        </Button>
        <NavigationMenuList className='ml-5 hidden nav-md:flex'>
          {metaCategories.map((upperCategory, index) => (
            <NavigationMenuItem key={upperCategory} className='hidden nav-md:flex'>
              {/*<Link href={`/category/${category}`}>*/}
              <NavigationMenuTrigger className='submenu-trigger bg-transparent'>
                {upperCategory}
              </NavigationMenuTrigger>
              {/*</Link>*/}
              <NavigationMenuContent>
                <ul className='grid gap-3 p-1'>
                  {productCategories[upperCategory].map((productCategory) => (
                    <li key={productCategory}>
                      <Button variant='link'>
                        <Link
                          href={`/category/${encodeURIComponent(productCategory)}?from=${upperCategory}`}
                          passHref
                          className='w-fit'
                        >
                          {productCategory}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <NavigationMenuViewport
          className='submenu-viewport min-w-[130px] items-center bg-background/60 backdrop-blur-md' />
      </NavigationMenu>
      <div className='mr-1 flex flex-grow items-center justify-end gap-0 sm:gap-2'>
        <UserMenuDropdown isAdmin={isAdmin} />
        {loggedInState ? (
          <>
            <Button variant='link' className='px-1 max-[320px]:hidden' onClick={() => handleSignOut()}>
              로그아웃
            </Button>
            <Button variant='ghost' className='min-[320px]:hidden' size='icon' onClick={() => handleSignOut()}>
              <LogOutIcon className='w-6 h-6' />
            </Button>
          </>
        ) : (
          <>
            <Link href={LOGIN_PATH}>
              <Button variant='link' className='px-1 max-[320px]:hidden'>
                로그인
              </Button>
              <Button variant='ghost' className='min-[320px]:hidden' size='icon'>
                <LogInIcon className='w-6 h-6' />
              </Button>
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default GlobalNavigator;
