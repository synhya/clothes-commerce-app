import { SidebarNavItem } from '@/lib/types';

type AdditionalLinks = {
  title: string;
  links: SidebarNavItem[];
};

// export const defaultLinks: SidebarLink[] = [
//   { href: '/dashboard', title: 'Home', icon: HomeIcon },
//   { href: '/account', title: 'Account', icon: Cog },
//   { href: '/settings', title: 'Settings', icon: Cog }
// ]
//
export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'user',
    links: [
      { href: '/user/update-profile', title: '프로필 수정' },
      { href: '/user/update-profile/address', title: '배송주소 관리' },
    ],
  },
];
