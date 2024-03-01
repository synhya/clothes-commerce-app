'use client';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { AddProfileFormValues } from '@/app/(auth)/sign-up/profile/AddProfileFormProvider';
import { Shell } from '@/components/shells/shell';

export default function Page() {
  const { control, trigger } = useFormContext<AddProfileFormValues>();
  const router = useRouter();

  const onClickNext = async () => {
    const isValid = await trigger('birthdate');
    if (isValid) {
      router.push('/sign-up/profile/address');
    }
  };

  return (
    <Shell>
      <FormField
        control={control}
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
                      'pl-3 text-left font-normal',
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
      <Button type="button" onClick={() => onClickNext()} className="ml-auto">
        다음으로
      </Button>
    </Shell>
  );
}
