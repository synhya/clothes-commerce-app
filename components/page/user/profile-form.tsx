'use client';

import React, { useImperativeHandle, useRef, useState } from 'react';
import { Database } from '@/lib/supabase/schema';
import { createClient } from '@/lib/supabase/client';
import { z, ZodTypeAny } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProfile } from '@/lib/actions';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl, FormDescription,
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
import { useFormState } from "react-dom";
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';


const tenYearsAgo = new Date();
tenYearsAgo.setFullYear(new Date().getFullYear() - 10);

const formSchema = z.object({
  address: z
    .string(), // 팝업으로 불러옴
  extra_address: z
    .string()
    .max(100, { message: '상세주소는 100자 이하입니다.' }),
  birthdate: z
    .date({
      required_error: "생년월일을 입력하세요."
    })
    .max(tenYearsAgo, { message: '10세 미만은 가입할 수 없습니다.' }),
  email: z.string().email({ message: '이메일 형식이 아닙니다.' }),
  name: z
    .string()
    .min(2, { message: '이름은 2자 이상입니다.' })
    .max(20, { message: '이름은 20자 이하입니다.' })
    .regex(/^[가-힣a-zA-Z]+$/, { message: '이름은 한글 또는 영문으로 입력하세요.' }),
  phone: z
    .string()
    .regex(/^\d{3}\d{3,4}\d{4}$/, { message: '전화번호는 01012345678 형식입니다.' }),
} satisfies { [key in keyof Omit<Profile, 'id'>]: ZodTypeAny });

export type ProfileFormSchema = z.infer<typeof formSchema>;

const ProfileForm = ({ className, ...props }: Partial<Profile> & React.ComponentPropsWithRef<'div'>) => {
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      extra_address: '',
      birthdate: new Date(),
      email: props.email ?? '',
      name: props.name ?? '',
      phone: props.phone ?? '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const openPostcode = useDaumPostcodePopup();

  const onSubmit: SubmitHandler<ProfileFormSchema> = async (data) => {
    setIsLoading(true);

    // redirect는 try내부에서 쓰지 말자!
    const error = await createProfile(data);
    if(error) {
      setIsLoading(false);
    }
  };

  const handlePostComplete = (data: Address) => {
    let fullAddress = data.address; // 도로명 주소
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동명
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    form.setValue('address', fullAddress);
  }
  const onPostButtonClick = async () => {
    await openPostcode({ onComplete: handlePostComplete});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("grid", className)}>
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
              <FormItem className="flex gap-0.5 mt-2 flex-col">
                <FormLabel>생년월일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP", {locale: ko}): "생년월일을 선택하세요"}
                        <CalendarIcon className="w-4 h-4 ml-2 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      defaultMonth={field.value}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ko}
                      captionLayout="dropdown-buttons" fromYear={1960} toYear={new Date().getFullYear()}
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
                  <Input {...field} placeholder="전화번호를 입력하세요." />
                </FormControl>
                <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem >
                <FormLabel>주소</FormLabel>
                <div className="flex flex-col items-start gap-4 sm:flex-row ">
                  <Input {...field} placeholder="주소" className="max-w-[304px]" readOnly/>
                  <FormControl>
                    <Button type="button" onClick={() => onPostButtonClick()}>
                      우편번호 찾기
                    </Button>
                  </FormControl>
                </div>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="extra_address"
            render={({ field }) => (
              <FormItem
                className="col-span-2"
              >
                <FormLabel />
                <FormControl>
                  <Input {...field} placeholder="상세주소"/>
                </FormControl>
                <FormDescription>기본 배송지로 등록됩니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8 flex items-center md:justify-center">
          <Button type="submit" className="min-w-[200px]" disabled={isLoading}>
            {isLoading &&
                <Icons.spinner className="ml-0.5 mr-2.5 h-4 w-4 animate-spin" />}
            계정 생성</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;