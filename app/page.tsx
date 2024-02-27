import HeroSection from '@/components/page/home/hero-section';
import React from 'react';
import ToasterOnMount from '@/components/page/shared/toaster-on-mount';
import { fetchProfileById } from '@/lib/fetches';
import ProfileSection from '@/components/page/home/profile-section';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import TrendingClothes from '@/components/page/shared/trending-clothes';
import { productDataToCardData } from '@/lib/utils';
import { Product } from '@/lib/types/database';
import ProfileAlertDialog from '@/components/page/home/profile-alert-dialog';

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
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

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
        <p className="text-5xl">Botique</p>
        <p className="mt-3 text-2xl">차가운 인터넷 속에서도 따뜻한 나의 쇼핑메이트이고 싶습니다.</p>
        <p className="mt-2 text-xl">화려하지 않아도 편안하고 담백한 나만의 분위기,</p>
        <p className="text-md">그 속에서 자주 손이 갈 실용적인 옷들을 제작합니다.</p>
      </div>
      {/* 인기 순위 */}
      <div>{!trendingFetchError && <TrendingClothes trendingClothes={trendingClothes} />}</div>

      {/* toasters */}
      {searchParams.newUser && (
        <ToasterOnMount
          title={`${decodeURIComponent(searchParams.newUser)}님`}
          description="회원가입을 축하합니다"
        />
      )}
      {searchParams.alert && (
        <ToasterOnMount title={`경고`} description={`${searchParams.alert}`} />
      )}
      {profileFetchError && (
        <ToasterOnMount title={`알림`} description={`개인정보를 입력하고 가입을 완료해주세요!`} />
      )}
      {trendingFetchError && (
        <ToasterOnMount title={`알림`} description={`트랜딩 의류를 가져오는데 실패했습니다.`} />
      )}

      {/* dialog */}
      {profileFetchError && <ProfileAlertDialog />}
    </div>
  );
}
