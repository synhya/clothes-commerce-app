import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Route } from 'next';

type NotFoundAlertDialogProps = {
  additionalLink?: {
    href: Route;
    title: string;
  };
  description?: string;
};

const NotFoundAlertDialog = ({ additionalLink, description }: NotFoundAlertDialogProps) => {
  return (
    <AlertDialog defaultOpen>
      {/*<AlertDialogTrigger asChild>*/}
      {/*  <Button variant="outline">Show Dialog</Button>*/}
      {/*</AlertDialogTrigger>*/}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>결과가 없습니다.</AlertDialogTitle>
          <AlertDialogDescription>
            {description || '무언가 문제가 있었던 것으로 보입니다..'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Link href="/">홈으로</Link>
          </AlertDialogAction>
          {additionalLink && (
            <AlertDialogAction asChild>
              <Link href={additionalLink.href}>{additionalLink.title}</Link>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotFoundAlertDialog;
