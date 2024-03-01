'use client';
import * as React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { SignupFormValues } from '@/app/(auth)/sign-up/(credentials)/SignupFormProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/shells/shell';
import { fetchProfileByEmail } from '@/lib/fetchers/profile';

export default function Page() {
  const { control, trigger, getValues } = useFormContext<SignupFormValues>();
  const router = useRouter();

  const onClickNext = async () => {
    const isValid = await trigger('email');

    if (isValid) {
      const email = await fetchProfileByEmail(getValues('email'));

      if (!email) {
        router.push('/sign-up/password');
      } else {
        control.setError('email', {
          type: 'manual',
          message: '이미 가입된 이메일입니다.',
        })
      }
    }
  };

  return (
    <Shell>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>이메일</FormLabel>
            <FormControl>
              <Input
                placeholder="abc@example.com"
                type="email"
                autoComplete="email"
                autoCorrect="off"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage/>
          </FormItem>
        )}
      />
      <Button type="button" onClick={() => onClickNext()} className="ml-auto">
        다음으로
      </Button>
    </Shell>
  );
}
