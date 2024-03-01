'use client';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import { PhoneInput } from '@/components/ui/phone-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { updateProfile } from '@/lib/actions/profile';
import { toast } from 'sonner';
import { updateProfileSchema } from '@/lib/validations/user';
import { catchError } from '@/lib/utils';


export type UpdateFormSchema = z.infer<typeof updateProfileSchema>;

type UpdateProfileFormProps = {
  email?: string;
  name?: string;
  phone?: string;
};

const UpdateProfileForm = (props: UpdateProfileFormProps) => {
  const form = useForm<UpdateFormSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: props.email ?? '',
      name: props.name ?? '',
      phone: props.phone ?? '',
    },
  });

  const onSubmit: SubmitHandler<UpdateFormSchema> = async (data) => {
    try {
      await updateProfile(data);
      toast.success('프로필 업데이트 성공');
    } catch (error) {
      catchError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  defaultCountry="EC"
                  international={false}
                />
              </FormControl>
              <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Icons.spinner className="ml-0.5 mr-2.5 h-4 w-4 animate-spin" />
          ) : "저장"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
