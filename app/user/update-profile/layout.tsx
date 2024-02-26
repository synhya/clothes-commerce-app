import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/page/sidebar-nav';

const sidebarNavItems = [
  { href: '/user/update-profile', title: '프로필 수정' },
  { href: '/user/update-profile/address', title: '배송주소 관리' },
];

const ProfilesLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-[500px] m-10'>
      <div className='mb-10'>
        <h1 className="text-2xl font-semibold">내 정보</h1>
        <Separator />
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default ProfilesLayout;
