'use client';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { signUpSchema } from '@/lib/validations/user';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { catchError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/actions/profile';

export type SignupFormValues = z.infer<typeof signUpSchema>;
interface SignupFormProviderProps extends React.PropsWithChildren {
  email?: string;
}
export default function SignupFormProvider({ children }: SignupFormProviderProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordCheck: '',
    }
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      await signUp(data);
      router.push('/sign-up/profile/name');
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
