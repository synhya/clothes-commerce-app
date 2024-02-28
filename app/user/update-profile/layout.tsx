import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/page/sidebar-nav';
import { Route } from 'next';

const ProfilesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="m-10 min-h-[500px]">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">내 정보</h1>
        <Separator />
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default ProfilesLayout;
