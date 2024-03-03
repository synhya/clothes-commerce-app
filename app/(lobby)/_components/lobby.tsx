import * as React from 'react';
import { Shell } from '@/components/shells/shell';
import HeroSectionSlider from '@/app/_components/hero-section-slider';
import ProfileSection from '@/app/_components/profile-section';
import TrendingClothes from '@/components/trending-clothes';
import { productDataToCardData } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface LobbyProps {
  isAdmin: boolean;
  userName?: string;
  trendingClothes: ReturnType<typeof productDataToCardData>[];
}

export default function Lobby ({
  trendingClothes,
  isAdmin,
  userName,
}: LobbyProps) {
  return (
    <Shell variant="stretched" className="max-w-6xl">
      <HeroSectionSlider isAdmin={isAdmin} userName={userName} />
      <div
        className="group mt-5 flex flex-col items-center gap-y-2 bg-background/60 py-12 *:text-pretty *:text-center *:text-foreground/80">
        <p className="text-5xl">쇼핑몰</p>
        <p className="mt-3 text-2xl">Made with nextjs</p>
        <p className="mt-2 text-xl">상품은 더미데이터를 우겨넣어서 카테고리와 일치하지 않습니다.</p>
        <p className="text-md">vercel에서 기본 제공하는 이미지를 사용했습니다.</p>
        <p className="text-md">카테고리는 시중에 나도는 쇼핑몰에서 따왔습니다.</p>
      </div>
      <TrendingClothes trendingClothes={trendingClothes} />
    </Shell>
  );
};
