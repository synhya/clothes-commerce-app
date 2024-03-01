'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { useDebouncedCallback } from 'use-debounce';
import { Route } from 'next';

const UserMenuDropdown = ({ isAdmin }: { isAdmin: boolean }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminState, setAdminState] = useState(isAdmin);

  const debouncedHoverEvent = useDebouncedCallback((bool) => {
    setShowDropdown(bool);
  }, 200);

  useEffect(() => {
    setAdminState(isAdmin);
  }, [isAdmin]);

  return (
    <div className="flex flex-col">
      <Button
        variant="ghost"
        className="px-1.5"
        onMouseOver={() => {
          debouncedHoverEvent(true);
        }}
        onMouseOut={() => {
          debouncedHoverEvent(false);
        }}
      >
        <PersonIcon className="size-6" />
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
