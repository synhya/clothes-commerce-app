import ClothCarousel from '@/components/page/home/cloth-carousel';
import React from 'react';
import ToasterOnMount from '@/components/page/toaster-on-mount';
import { fetchProfileById } from '@/lib/fetches';
import { AuthError } from '@supabase/supabase-js';
import HomeSideBanner from '@/components/page/home/home-side-banner';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import TrendingClothes from '@/components/page/home/trending-clothes';

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

  const { data, error } = user
    ? await fetchProfileById(user.id, supabase)
    : { data: null, error: null };
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className=" bg-accent">
      <div className="flex pt-5">
        <ClothCarousel />
        <HomeSideBanner
          isAdmin={isAdmin}
          profile={data}
          className="hidden rounded-l-md border-b border-l border-t p-4 lg:flex lg:basis-1/3 bg-background/60 text-foreground/80"
        />
      </div>
      {/* 모토 설명 */}
      <div className="group mt-5 flex flex-col items-center py-12 bg-background/60 gap-y-2 *:text-foreground/80 *:text-pretty *:text-center">
        <p className="text-5xl">Botique</p>
        <p className="text-2xl mt-3">차가운 인터넷 속에서도 따뜻한 나의 쇼핑메이트이고 싶습니다.</p>
        <p className="text-xl mt-2">화려하지 않아도 편안하고 담백한 나만의 분위기,</p>
        <p className="text-md">그 속에서 자주 손이 갈 실용적인 옷들을 제작합니다.</p>
      </div>
      {/* 인기 순위 */}
      <div>
        <TrendingClothes className="border-4 border-red-500"/>
      </div>

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
      {error && (
        <ToasterOnMount title={`알림`} description={`개인정보를 입력하고 가입을 완료해주세요!`} />
      )}
    </div>
  );
}
