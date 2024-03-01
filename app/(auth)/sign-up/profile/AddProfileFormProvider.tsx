'use client';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { addProfileSchema, signUpSchema } from '@/lib/validations/user';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addProfile } from '@/lib/actions/profile';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { catchError } from '@/lib/utils';

export type AddProfileFormValues = z.infer<typeof addProfileSchema>;
interface AddProfileFormProviderProps extends React.PropsWithChildren {
}
export default function AddProfileFormProvider({ children }: AddProfileFormProviderProps) {
  const form = useForm<AddProfileFormValues>({
    resolver: zodResolver(addProfileSchema),
    defaultValues: {
      name: '',
      phone: '',
      birthdate: new Date(1998,2,15),
      main_address: '',
      extra_address: '',
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<AddProfileFormValues> = async (data) => {
    try{
      await addProfile(data);

      toast.success('가입 완료', {
        description: '회원가입이 완료되었습니다.',
      });

      router.push(`/?newUser=${encodeURIComponent(data.name)}`);
    } catch (error) {
      catchError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}
