'use client';
import * as React from 'react';
import { ImagesSlider } from '@/components/ui/image-slider';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Route } from 'next';

interface HeroSectionSliderProps {
  userName: string;
  isAdmin: boolean;
}

export default function HeroSectionSlider({ userName, isAdmin }: HeroSectionSliderProps) {
  const images = [
    'https://images.unsplash.com/photo-1681038429854-38596ec0d7f7?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1709038460021-0e6935c5a2ad?q=80&w=1586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1709120421484-0105a333e306?q=80&w=1673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col items-center justify-center"
      >
        <motion.p className="cursor-default bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text py-4 text-center font-bold text-transparent">
          {userName ? (
            <>
              <p className="text-3xl md:text-5xl">{userName}님</p>
              <p className="text-xl md:text-3xl">환영합니다</p>

            </>
          ) : (
            <>
              <p className="font-header text-5xl md:text-7xl">Boutique</p>
              <p className="text-xl md:text-3xl mt-2">당신을 위한 쇼핑몰</p>
            </>
          )}
        </motion.p>
        <motion.div className="space-x-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="relative mx-auto mt-4 rounded-full border border-emerald-500/20 bg-emerald-300/10 px-4 py-2 text-center text-white backdrop-blur-sm"
            >
              <span>관리자 →</span>
              <div className="absolute inset-x-0  -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            </Link>
          )}
          <Link
            href={(userName ? '/category/all' : '/sign-in') as Route}
            className="relative mx-auto mt-4 rounded-full border border-emerald-500/20 bg-emerald-300/10 px-4 py-2 text-center text-white backdrop-blur-sm"
          >
            <span>{userName ? '쇼핑하기 →' : '가입하기 →'}</span>
            <div className="absolute inset-x-0  -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          </Link>
        </motion.div>
      </motion.div>
    </ImagesSlider>
  );
}
