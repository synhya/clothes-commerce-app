'use client';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { AddProfileFormValues } from '@/app/(auth)/sign-up/profile/AddProfileFormProvider';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/shells/shell';

export default function Page() {
  const { control, trigger } = useFormContext<AddProfileFormValues>();
  const router = useRouter();

  const onClickNext = async () => {
    const isValid = await trigger('name');
    if (isValid) {
      router.push('/sign-up/profile/phone');
    }
  };

  return (
    <Shell>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>이름</FormLabel>
            <FormControl>
              <Input {...field} placeholder="이름을 입력하세요" />
            </FormControl>
            <FormDescription>배송시에 사용되는 이름입니다.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={() => onClickNext()} className="ml-auto">다음으로</Button>
    </Shell>
  );
}
