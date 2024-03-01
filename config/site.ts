import { AuthHeaderItem, HeaderItem } from '@/lib/types';
import { env } from '@/lib/env';

type AuthPageConfig = {
  header: AuthHeaderItem[];
}

export const siteConfig = {
  name: "Boutique",
  description: "Next.js로 만든 오픈 소스 옷 쇼핑몰",
  url: "https://clothes-commerce-app.vercel.app",
  ogImage: "https://clothes-commerce-app.vercel.app/opengraph-image.png",
}

export const authPageConfig: AuthPageConfig = {
  header: [
    {
      title: "로그인",
      description: "로그인하여 서비스를 이용하세요.",
      href: "/sign-in",
    },
    {
      title: "회원가입",
      description: "이메일을 입력해주세요",
      href: "/sign-up/email",
      progress: 1/7
    },
    {
      title: "회원가입",
      description: "비밀번호를 입력해주세요",
      href: "/sign-up/password",
      progress: 2/7
    },
    {
      title: "회원가입",
      description: "이름을 입력해주세요",
      href: "/sign-up/profile/name",
      progress: 3/7
    },
    {
      title: "회원가입",
      description: "전화번호를 입력해주세요",
      href: "/sign-up/profile/phone",
      progress: 4/7
    },
    {
      title: "회원가입",
      description: "생일을 입력해주세요",
      href: "/sign-up/profile/birthdate",
      progress: 5/7
    },
    {
      title: "회원가입",
      description: "주소를 입력해주세요",
      href: "/sign-up/profile/address",
      progress: 6/7
    },
  ],
}
