'use client';

import React, { useTransition } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProfile } from '@/lib/actions/profile';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { ko } from 'date-fns/locale';
import { Icons } from '@/components/ui/icons';
import { Profile } from '@/lib/types/database';
import AddressFormField from '@/components/forms/address-form-field';
import { PhoneInput } from '@/components/ui/phone-input';
import { profileSchema } from '@/lib/validations/profile';

export type Inputs = z.infer<typeof profileSchema>;

const CreateProfileForm = ({
  className,
  ...props
}: Partial<Profile> & React.ComponentPropsWithRef<'div'>) => {
  const form = useForm<Inputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      main_address: '',
      extra_address: '',
      birthdate: new Date(),
      email: props.email ?? '',
      name: props.name ?? '',
      phone: props.phone ?? '',
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    startTransition(async () => {
      await createProfile(data);
    })
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn('grid', className)}>
          <FormField
            control={form.control}
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
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="mt-2 flex flex-col gap-0.5">
                <FormLabel>생년월일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? format(field.value, 'PPP', { locale: ko })
                          : '생년월일을 선택하세요'}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      defaultMonth={field.value}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                      locale={ko}
                      captionLayout="dropdown-buttons"
                      fromYear={1960}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>14세 미만은 추가 인증이 필요합니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="이메일을 입력하세요." />
                </FormControl>
                <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전화번호</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    placeholder="전화번호를 입력하세요."
                    defaultCountry="KR"
                    international={false}
                  />
                </FormControl>
                <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 space-y-4">
          <AddressFormField
            isMainAddress
            mainAddressName="main_address"
            extraAddressName="extra_address"
          />
        </div>
        <div className="mt-8 flex items-center md:justify-center">
          <Button type="submit" className="min-w-[200px]" disabled={isPending}>
            {isPending && <Icons.spinner className="ml-0.5 mr-2.5 h-4 w-4 animate-spin" />}
            계정 생성
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProfileForm;
