'use client';
import React from 'react';
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { z, ZodTypeAny } from 'zod';
import {  endOfDay, startOfDay, sub } from 'date-fns';
import DateFormField from '@/components/forms/date-form-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Route } from 'next';
import { categoryOptions, sellStatusOptions } from '@/config/product';

type SearchParams = {
  category: (typeof categoryOptions)[number];
  from: Date;
  to: Date;
  sale_state: (typeof sellStatusOptions)[number];
  name: string;
};

const formSchema = z.object<Record<keyof SearchParams, ZodTypeAny>>({
  category: z.enum(categoryOptions),
  from: z.date(),
  to: z.date(),
  sale_state: z.enum(sellStatusOptions),
  name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const SearchProductForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>({
    defaultValues: {
      category: '전체',
      from: sub(new Date(), { days: 7 }),
      to: new Date(),
      sale_state: '전체',
      name: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (values.category !== '전체') newSearchParams.set('category', values.category);

    newSearchParams.set('from', startOfDay(values.from).toISOString());
    newSearchParams.set('to', endOfDay(values.to).toISOString());
    if (values.sale_state !== '전체') newSearchParams.set('sale_state', values.sale_state);
    newSearchParams.set('name', values.name);
    router.push(`${pathname}?${newSearchParams.toString()}` as Route);
  };

  return (
    <div className="mx-auto my-8 max-w-4xl">
      <div className="mb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 lg:grid lg:flex-none lg:grid-cols-2"
          >
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex max-w-[500px] flex-col max-md:max-w-[250px]">
                  <FormLabel className="mb-2 text-sm font-medium" htmlFor="category">
                    카테고리
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="전체 카테고리" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex max-w-[500px] flex-col gap-2 max-md:max-w-[250px] md:flex-row">
              <DateFormField arrayPath="from" label="시작일" className="w-full" />
              <DateFormField arrayPath="to" label="종료일" className="w-full" />
            </div>
            <div className="col-start-2 row-start-2 flex flex-wrap gap-2">
              {['오늘', '1주일', '1개월', '3개월', '6개월', '1년'].map((text) => (
                <Button
                  key={text}
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.setValue(
                      'from',
                      sub(new Date(), {
                        days:
                          text === '오늘'
                            ? 0
                            : text === '1주일'
                              ? 7
                              : text === '1개월'
                                ? 30
                                : text === '3개월'
                                  ? 90
                                  : text === '6개월'
                                    ? 180
                                    : 365,
                      }),
                    );
                  }}
                >
                  {text}
                </Button>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="상품명을 입력하세요."
                        className="max-w-[500px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 pt-1">
                <FormField
                  control={form.control}
                  name="sale_state"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row gap-3"
                        >
                          {sellStatusOptions.map((status) => (
                            <FormItem
                              key={status}
                              className="flex items-center space-x-1 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={status} />
                              </FormControl>
                              <FormLabel className="font-normal">{status}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button className="col-span-2 max-lg:max-w-[500px]">검색</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SearchProductForm;
