'use client';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/page/masked-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { updateProfile } from '@/lib/actions/actions';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: '이름은 2자 이상입니다.' })
    .max(20, { message: '이름은 20자 이하입니다.' })
    .regex(/^[가-힣a-zA-Z]+$/, { message: '이름은 한글 또는 영문으로 입력하세요.' }),
  email: z.string().email({ message: '이메일 형식이 아닙니다.' }),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, { message: '전화번호는 010-1234-5678 형식입니다.' }),
});

export type UpdateFormSchema = z.infer<typeof formSchema>;

type UpdateProfileFormProps = {
  email?: string;
  name?: string;
  phone?: string;
}

const UpdateProfileForm = (props: UpdateProfileFormProps) => {
  const form = useForm<UpdateFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: props.email ?? '',
      name: props.name ?? '',
      phone: props.phone ?? '',
    },
  });

  const onSubmit: SubmitHandler<UpdateFormSchema> = async (data) => {
    // redirect는 try내부에서 쓰지 말자!
    const res = await updateProfile(data);

    if(res.message) {
      toast({
        title: '알림',
        description: res.message,
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} placeholder='이름을 입력하세요' />
              </FormControl>
              <FormDescription>배송시에 사용되는 이름입니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input {...field} placeholder='이메일을 입력하세요.' />
              </FormControl>
              <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <MaskedInput {...field} placeholder='전화번호를 입력하세요.' mask='phone' />
              </FormControl>
              <FormDescription>광고 및 알림 전송에 사용됩니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting &&
            <Icons.spinner className='ml-0.5 mr-2.5 h-4 w-4 animate-spin' />}
          저장
        </Button>
      </form>
      <Toaster/>
    </Form>
  );
};

export default UpdateProfileForm;
