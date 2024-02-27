import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

const ProfileAlertDialog = () => {
  return (
    <AlertDialog defaultOpen>
      {/*<AlertDialogTrigger asChild>*/}
      {/*  <Button variant="outline">Show Dialog</Button>*/}
      {/*</AlertDialogTrigger>*/}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로필이 없습니다.</AlertDialogTitle>
          <AlertDialogDescription>
            장바구니와 결제를 이용하실 수 없어요!
            <br />
            프로필을 입력하고 가입을 완료해주세요
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>그냥 쓸래요</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="user/create-profile">프로필 입력</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProfileAlertDialog;
