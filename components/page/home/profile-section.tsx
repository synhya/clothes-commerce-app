'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Profile } from '@/lib/types/database';
import Image from 'next/image';

interface HomeProfileProps extends React.ComponentPropsWithRef<'div'> {
  profile: Profile | null;
  isAdmin: boolean;
}

const ProfileSection = ({ profile, isAdmin, className, ...props }: HomeProfileProps) => {
  return (
    <div className={cn('flex flex-col justify-between', className)}>
      <div>
        <h1>Profile</h1>
        <p>{profile?.name ?? '고객'}님 환영합니다</p>

        {isAdmin && <Link href='/admin'>Go to Admin</Link>}
      </div>
      {/* banner part */}
      <div className="relative space-y-2">
        <div>
          <p className="text-sm text-foreground">신상 코너</p>
          <Link href="/category/new">
            <div className="relative h-20 rounded-md border border-accent/70">
              <Image
                src="/banners/banner-1.png"
                alt="banner1"
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 20vw"
                className="rounded-md object-cover"
              />
            </div>
          </Link>
        </div>
        <div>
          <p className="text-sm text-foreground">브랜드 코너</p>
          <Link href="/category/made">
            <div className="relative h-20 rounded-md border border-accent/70">
              <Image
                src="/banners/banner-2.png"
                alt="banner2"
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 20vw"
                className="rounded-md object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
