'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { useDebouncedCallback } from 'use-debounce';
import { Route } from 'next';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

const UserMenuDropdown = ({ isAdmin, avatarUrl }: { isAdmin: boolean, avatarUrl:string }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminState, setAdminState] = useState(isAdmin);
  const router = useRouter();

  const debouncedHoverEvent = useDebouncedCallback((bool) => {
    setShowDropdown(bool);
  }, 200);

  useEffect(() => {
    setAdminState(isAdmin);
  }, [isAdmin]);

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex flex-col">
      <Button
        variant="ghost"
        onMouseOver={() => {
          debouncedHoverEvent(true);
        }}
        onMouseOut={() => {
          debouncedHoverEvent(false);
        }}
        className="rounded-full size-8"
      >
        <Avatar>
          <AvatarImage src={
            avatarUrl ? avatarUrl : "https://github.com/synhya.png"
          } alt="@shadcn" />
          <AvatarFallback>
            <PersonIcon className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
      </Button>
      <div
        data-state={showDropdown ? 'open' : 'close'}
        className="relative scale-0 transition-all duration-200 data-[state=open]:scale-100"
        onMouseOver={() => {
          debouncedHoverEvent(true);
        }}
        onMouseOut={() => {
          debouncedHoverEvent(false);
        }}
      >
        <ul
          typeof="menu"
          className="absolute top-2 z-10 grid -translate-x-1/3 gap-3 rounded-md border border-accent bg-background/90 p-1 backdrop-blur-md"
        >
          {[
            {
              label: '내 정보',
              href: '/user/update-profile',
            },
            {
              label: '주문 내역',
              href: '/order/list',
            },
            {
              label: '장바구니',
              href: '/order/basket',
            },
          ].map((menus, index) => (
            <li key={index} className="w-full">
              <Link href={menus.href as Route}>
                <Button variant="link" className="w-full">
                  {menus.label}
                </Button>
              </Link>
            </li>
          ))}
          <li className="w-full">
            <Button variant="link" className="w-full" onClick={()=>handleSignOut()}>
              로그아웃
            </Button>
          </li>
          {adminState && (
            <li className="w-full">
              <Link href="/admin">
                <Button variant="link" className="w-full">
                  관리자
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserMenuDropdown;
