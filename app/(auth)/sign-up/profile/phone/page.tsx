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
import { PhoneInput } from '@/components/ui/phone-input';
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/shells/shell';

export default function Page() {
  const { control, watch, trigger } = useFormContext<AddProfileFormValues>();
  const router = useRouter();

  const onClickNext = async () => {
    const isValid = await trigger('phone');
    if (isValid) {
      router.push('/sign-up/profile/birthdate');
    }
  };

  return (
    <Shell>
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>전화번호</FormLabel>
            <FormControl>
              <PhoneInput
                {...field}
                placeholder="010-7777-7777"
                defaultCountry="KR"
                international={false}
                className="w-52"
              />
            </FormControl>
            <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={() => onClickNext()} className="ml-auto">다음으로</Button>
    </Shell>
  );
}
