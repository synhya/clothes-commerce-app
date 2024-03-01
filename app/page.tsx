import HeroSection from '@/app/_components/hero-section';
import React from 'react';
import { fetchProfileById } from '@/lib/fetchers/profile';
import ProfileSection from '@/app/_components/profile-section';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import TrendingClothes from '@/components/trending-clothes';
import { productDataToCardData } from '@/lib/utils';
import { Product } from '@/lib/types';
import ProfileAlertDialog from '@/app/_components/profile-alert-dialog';
import { env } from '@/lib/env';
import ServerEventToast from '@/components/server-event-toast';

export default async function Home({
  searchParams,
}: {
  searchParams: {
    newUser?: string;
    alert?: string;
  };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error: profileFetchError } = user
    ? await fetchProfileById(user.id, supabase)
    : { data: null, error: null };
  const isAdmin = user?.email === env.ADMIN_EMAIL;

  const { data: trendingProducts, error: trendingFetchError } = await supabase
    .from('products')
    .select('*')
    .limit(5)
    .order('sold', { ascending: false });

  const trendingClothes = trendingProducts.map((product) => {
    return productDataToCardData(product as Product, supabase);
  });

  return (
    <div className=" bg-accent">
      <div className="flex pt-5">
        <HeroSection />
        <ProfileSection
          isAdmin={isAdmin}
          profile={data}
          className="hidden rounded-l-md border-b border-l border-t bg-background/60 p-4 text-foreground/80 lg:flex lg:basis-1/3"
        />
      </div>
      {/* 모토 설명 */}
      <div className="group mt-5 flex flex-col items-center gap-y-2 bg-background/60 py-12 *:text-pretty *:text-center *:text-foreground/80">
        <p className="text-5xl">쇼핑몰</p>
        <p className="mt-3 text-2xl">Made with nextjs</p>
        <p className="mt-2 text-xl">상품은 매크로로 우겨넣어서 카테고리와 일치하지 않습니다.</p>
        <p className="text-md">vercel에서 기본 제공하는 이미지를 사용했습니다.</p>
        <p className="text-md">카테고리는 시중에 나도는 쇼핑몰에서 따왔습니다.</p>
      </div>
      {/* 인기 순위 */}
      <div>{!trendingFetchError && <TrendingClothes trendingClothes={trendingClothes} />}</div>

      {/* dialog */}
      {profileFetchError && <ProfileAlertDialog />}

      {searchParams.newUser && (
        <ServerEventToast
          message={`${decodeURIComponent(searchParams.newUser)}님 회원가입을 축하합니다`}
        />
      )}
      {searchParams.alert && <ServerEventToast message={`${searchParams.alert}`} />}
    </div>
  );
}
