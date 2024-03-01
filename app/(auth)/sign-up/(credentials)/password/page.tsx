'use client';
import * as React from 'react';
import { useState } from 'react';
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
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Shell } from '@/components/shells/shell';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext<SignupFormValues>();

  return (
    <Shell>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>비밀번호</FormLabel>
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="password"
                {...field}
              />
            </FormControl>
            <Button
              variant="link"
              type="button"
              className="absolute -right-1.5 -top-3"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </Button>
            <FormDescription />
            <FormMessage className="h-3.5" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="passwordCheck"
        render={({ field }) => (
          <FormItem>
            <FormLabel>확인</FormLabel>
            <FormControl>
              <Input {...field} type={showPassword ? 'text' : 'password'} className="col-span-3" />
            </FormControl>
            <FormDescription />
            <FormMessage className="h-3.5" />
          </FormItem>
        )}
      />
      <Button className="ml-auto">
        다음으로
      </Button>
    </Shell>
  );
}
