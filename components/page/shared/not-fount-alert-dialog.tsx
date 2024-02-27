import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

type NotFoundAlertDialogProps = {
  additionalLink?: {
    href: string;
    label: string;
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
            <Link href="/public">홈으로</Link>
          </AlertDialogAction>
          {additionalLink && (
            <AlertDialogAction asChild>
              <Link href={additionalLink.href}>{additionalLink.label}</Link>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotFoundAlertDialog;
