'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { useDebouncedCallback } from 'use-debounce';

const UserMenuDropdown = ({isAdmin} : {isAdmin: boolean}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminState, setAdminState] = useState(isAdmin);

  const debouncedHoverEvent = useDebouncedCallback((bool) => {
    setShowDropdown(bool);
  }, 300);

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
        className="relative scale-0 data-[state=open]:scale-100 transition-all duration-300"
        onMouseOver={() => {
          debouncedHoverEvent(true);
        }}
        onMouseOut={() => {
          debouncedHoverEvent(false);
        }}
      >
        <ul
          typeof="menu"
          className="absolute -translate-x-1/3 top-2 z-10 grid gap-3 rounded-md border border-accent p-1 bg-background/60 backdrop-blur-md">
          {['개인정보', '장바구니', '주문내역'].map((productCategory, index) => (
            <li key={index} className="w-full">
              <Button variant="link" className="w-full">
                <Link href={`/product-list?category=${productCategory}`} passHref className="w-fit">
                  {productCategory}
                </Link>
              </Button>
            </li>
          ))}
          {adminState && (
            <li className="w-full">
              <Button variant="link" className="w-full">
                <Link href="/admin" passHref className="w-fit">
                  관리자
                </Link>
              </Button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserMenuDropdown;
