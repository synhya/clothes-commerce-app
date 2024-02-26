'use client'
import React, { useState } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/components/ui/use-toast';
import { signUp } from '@/lib/actions/actions';
import { Toaster } from '@/components/ui/toaster';


const formSchema = z.object({
  email: z
    .string()
    .email({
      message: '이메일 형식이 아닙니다.',
    }),
  password: z
    .string()
    .min(6, {
      message: '비밀번호는 6자이상 20자이하입니다.',
    })
    .max(20, {
      message: '비밀번호는 6자이상 20자이하입니다.',
    }),
  // additional check box
});
export type SignupFormSchema = Required<z.infer<typeof formSchema>>;

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}


// form signUp
const RegisterEmailForm = ({ className, ...props }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin1234',
    },
  });
  const { toast } = useToast();

  const onSubmit: SubmitHandler<SignupFormSchema> = async (data) => {
    setIsLoading(true);

    const error = await signUp(data);

    if(error) {
      setIsLoading(false);
      toast({
        title: '회원가입 실패',
        description: error.message as string ?? '회원가입에 실패했습니다. 다시 시도해주세요.',
      })
    }
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid gap-3">
            <div className="grid space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="이메일"
                        type="text"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage className="h-3.5"> </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        placeholder="비밀번호"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      variant="link"
                      type="button"
                      className="absolute right-2 top-1.5 translate-y-1/2 p-1"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </Button>
                    <FormDescription />
                    <FormMessage className="h-3.5">

                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading} className="mt-4">
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              인증메일 전송
            </Button>
            <Toaster />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterEmailForm;
