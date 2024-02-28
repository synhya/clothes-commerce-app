import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({
    message: '이메일 형식이 아닙니다.',
  }),
  password: z
    .string()
    .min(5, {
      message: '비밀번호는 5자이상 20자이하입니다.',
    })
    .max(20, {
      message: '비밀번호는 5자이상 20자이하입니다.',
    }),
})

export const signUpSchema = signInSchema.extend({
  passwordCheck: z.string(),
}).refine((data) => data.password === data.passwordCheck, {
  path: ['passwordCheck'],
  message: 'Please check the password'
});

