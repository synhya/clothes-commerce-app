import { z, ZodTypeAny } from 'zod';
import { ProfileInfo } from '@/lib/types/database';
import { isValidPhoneNumber } from 'react-phone-number-input/min';

const tenYearsAgo = new Date();
tenYearsAgo.setFullYear(new Date().getFullYear() - 10);


export const profileSchema = z.object<{ [key in keyof Omit<ProfileInfo, 'id'>]: ZodTypeAny }>({
  main_address: z.string({
    invalid_type_error: '주소를 입력해주세요.',
  }),
  extra_address: z.string().max(100, { message: '상세주소는 100자 이하입니다.' }),
  birthdate: z
    .date({
      required_error: '생년월일을 입력하세요.',
    })
    .max(tenYearsAgo, { message: '10세 미만은 가입할 수 없습니다.' }),
  email: z.string().email({ message: '이메일 형식이 아닙니다.' }),
  name: z
    .string()
    .min(2, { message: '이름은 2자 이상입니다.' })
    .max(20, { message: '이름은 20자 이하입니다.' })
    .regex(/^[가-힣a-zA-Z]+$/, { message: '이름은 한글 또는 영문으로 입력하세요.' }),
  phone: z.string().refine(isValidPhoneNumber, { message: "전화번호 형식이 잘못되었습니다." }),
});

export  const updateProfileSchema = profileSchema.pick({ name: true, email: true, phone: true });
