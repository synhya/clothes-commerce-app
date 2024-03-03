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
import HeroSectionSlider from '@/app/_components/hero-section-slider';
import Lobby from '@/app/(lobby)/_components/lobby';

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
    .limit(8)
    .order('sold', { ascending: false });

  const trendingClothes = trendingProducts.map((product) => {
    return productDataToCardData(product as Product, supabase);
  });

  return (
    <>
      <Lobby userName={data?.name ?? null} isAdmin={isAdmin} trendingClothes={trendingClothes}/>
      {profileFetchError && <ProfileAlertDialog />}
      {searchParams.newUser && (
        <ServerEventToast
          message={`${decodeURIComponent(searchParams.newUser)}님 회원가입을 축하합니다`}
        />
      )}
      {searchParams.alert && <ServerEventToast message={`${searchParams.alert}`} />}
    </>
  );
}
