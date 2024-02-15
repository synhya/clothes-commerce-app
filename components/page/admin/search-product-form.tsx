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
import { uniqueCategories } from '@/lib/types/categories';
import { sub } from 'date-fns';

import DateFormField from '@/components/page/admin/date-form-field';
import { productSaleState } from '@/lib/types/database';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const categoryOptions = ['전체', ...uniqueCategories] as const;
const sellStatusOptions = ['전체', ...productSaleState] as const;

type SearchParams = {
  category: (typeof categoryOptions)[number];
  startDate: Date;
  endDate: Date;
  status: (typeof sellStatusOptions)[number];
  searchText: string;
};

const formSchema = z.object({
  category: z.enum(categoryOptions),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(sellStatusOptions, {
    required_error: 'You need to select a notification type.',
  }),
  searchText: z.string(),
} satisfies Record<keyof SearchParams, ZodTypeAny>);

type FormValues = z.infer<typeof formSchema>;

const SearchProductForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const form = useForm<FormValues>({
    defaultValues: {
      category: '전체',
      startDate: sub(new Date(), { days: 7 }),
      endDate: new Date(),
      status: '전체',
      searchText: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('category', values.category);
    newSearchParams.set('startDate', values.startDate.toISOString());
    newSearchParams.set('endDate', values.endDate.toISOString());
    newSearchParams.set('status', values.status);
    newSearchParams.set('searchText', values.searchText);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="mx-auto my-8 max-w-4xl">
      <div className="mb-6 mr-2">
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
              <DateFormField arrayPath="startDate" label="시작일" className="w-full" />
              <DateFormField arrayPath="endDate" label="종료일" className="w-full" />
            </div>
            <div className="col-start-2 row-start-2 flex flex-wrap gap-2">
              {['오늘', '1주일', '1개월', '3개월', '6개월', '1년'].map((text) => (
                <Button
                  key={text}
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.setValue(
                      'startDate',
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
                name="searchText"
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
                  name="status"
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
