import {
  AuthHeaderItem,
  MainNavItem,
  NavItemWithChildren,
} from '@/lib/types';
import { productCategories, subCategories } from '@/config/product';

export const profileMenu = [
  {
    title: '프로필 수정',
    href: '/user/update-profile',
    description: '프로필 수정 페이지',
    items: [] as any[],
  },
  {
    title: '배송주소 관리',
    href: '/user/update-profile/address',
    description: '배송주소 관리 페이지',
    items: [] as any[],
  },
] satisfies NavItemWithChildren[];

export const userMenu = {
  title: '유저 메뉴',
  items: [
    ...profileMenu,
    {
      title: '장바구니',
      href: '/order/basket',
      description: '장바구니 페이지',
      items: [] as any[],
    },
    {
      title: '주문 목록',
      href: '/order/list',
      description: '주문목록 페이지',
      items: [] as any[],
    },
  ],
} satisfies MainNavItem;

export const siteConfig = {
  name: 'Boutique',
  description: 'Next.js로 만든 오픈 소스 옷 쇼핑몰',
  url: 'https://clothes-commerce-app.vercel.app',
  ogImage: 'https://clothes-commerce-app.vercel.app/opengraph-image.png',
  links: {},
  mainNav: [
    userMenu,
    ...productCategories.map((category) => ({
      title: category,
      items: [
        {
          title: '전체',
          href: `/category/${encodeURIComponent(category)}`,
          description: `${category} 전체 상품 페이지`,
          items: [],
        },
        ...subCategories[category].map((subcategory) => ({
          title: subcategory,
          href: `/category/${encodeURIComponent(subcategory)}?from=${category}`,
          description: `${subcategory} 상품 페이지`,
          items: [],
        })),
      ],
    })),
  ] satisfies MainNavItem[],
};

export const authPageConfig = {
  header: [
    {
      title: '로그인',
      description: '로그인하여 서비스를 이용하세요.',
      href: '/sign-in',
    },
    {
      title: '회원가입',
      description: '이메일을 입력해주세요',
      href: '/sign-up/email',
      progress: 1 / 7,
    },
    {
      title: '회원가입',
      description: '비밀번호를 입력해주세요',
      href: '/sign-up/password',
      progress: 2 / 7,
    },
    {
      title: '회원가입',
      description: '이름을 입력해주세요',
      href: '/sign-up/profile/name',
      progress: 3 / 7,
    },
    {
      title: '회원가입',
      description: '전화번호를 입력해주세요',
      href: '/sign-up/profile/phone',
      progress: 4 / 7,
    },
    {
      title: '회원가입',
      description: '생일을 입력해주세요',
      href: '/sign-up/profile/birthdate',
      progress: 5 / 7,
    },
    {
      title: '회원가입',
      description: '주소를 입력해주세요',
      href: '/sign-up/profile/address',
      progress: 6 / 7,
    },
  ] satisfies AuthHeaderItem[],
};
