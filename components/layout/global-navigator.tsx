'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { ProductCategories } from '@/lib/types/products';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/layout/mode-toggle';

const GlobalNavigator = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith('/login')) return;

  return (
    <div className="w-full relative flex justify-center bg-sky-500">
      <div className="flex bg-yellow-600 gap-2">
        {ProductCategories.map((category) => (
          <Link key={category} href={`/category/${category}`}>
            {category}
          </Link>
        ))}
      </div>
      <div className="absolute right-4 flex h-12 gap-4 items-center justify-end pr-3">
        {session && session.user?.role === 'admin' && <text>관리자</text>}
        {!session && (
          <Button variant="link">
            <Link href="/login">로그인</Link>
          </Button>
        )}
        {session && (
          <Button
            variant="link"
            onClick={async () => {
              const res = await logoutAction();
              console.log(res);
            }}
          >
            로그아웃
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default GlobalNavigator;
