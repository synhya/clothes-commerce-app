'use client';
import React from 'react';
import { Icons } from '@/components/ui/icons';
import { usePathname } from 'next/navigation';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const SiteFooter = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/user/login') || pathname.startsWith('/admin')) return;

  return (
    <footer className="mt-auto bg-background p-8 ">
      <div className="flex flex-col flex-nowrap justify-around gap-y-3 sm:flex-row">
        <div className=" sm:w-1/4">
          <h3 className="mb-4 line-clamp-1 text-lg font-semibold">회사 정보</h3>
          <p className="line-clamp-2">
            우리 회사는 고객에게 최상의 서비스를 제공하기 위해 노력하고 있습니다.
          </p>
          <p className="mt-2 line-clamp-1">주소: 서울시 강남구 123번길 45, 6층</p>
          <p className="line-clamp-1">전화번호: 02-1234-5678</p>
          <p className="line-clamp-1">Email: info@example.com</p>
        </div>

        <div className=" sm:w-1/4">
          <h3 className="mb-4 text-lg font-semibold">서비스</h3>
          <ul className="*:line-clamp-1">
            <li>
              <a href="#">제품 소개</a>
            </li>
            <li>
              <a href="#">서비스 플랜</a>
            </li>
            <li>
              <a href="#">고객 지원</a>
            </li>
            <li>
              <a href="#">자주 묻는 질문</a>
            </li>
          </ul>
        </div>

        <div className=" sm:w-1/4">
          <h3 className="mb-4 line-clamp-1 text-lg font-semibold">팔로우하기</h3>
          <p className="line-clamp-2">최신 소식과 업데이트를 받아보세요.</p>
          <Link href="https://github.com/synhya/clothes-commerce-app">
            <GitHubLogoIcon className="size-8 cursor-pointer" />
          </Link>
        </div>
      </div>

      <div className="mt-8 line-clamp-1 text-center">
        <p>&copy; 2024 Our Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
