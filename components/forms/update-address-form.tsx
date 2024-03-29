'use client';
import React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
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
import { updateAddress, updateProfile } from '@/lib/actions/profile';
import AddressFormField from '@/components/forms/address-form-field';
import { DoubleArrowDownIcon, DoubleArrowUpIcon, StarIcon, TrashIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { catchError } from '@/lib/utils';

const formSchema = z.object({
  addressList: z.array(
    z.object({
      main_address: z.string().min(1, { message: '주소를 선택해주세요' }),
      extra_address: z.string().optional(),
    }),
    { invalid_type_error: '주소 목록은 배열이어야 합니다.' },
  ),
});

export type AddressInfo = {
  main_address?: string;
  extra_address?: string;
};

type UpdateFormSchema = z.infer<typeof formSchema>;

const UpdateAddressForm = ({ addressList }: { addressList: AddressInfo[] }) => {
  const form = useForm<UpdateFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressList: addressList,
    },
  });

  const { fields, append, swap, move, remove } = useFieldArray({
    name: 'addressList',
    control: form.control,
  });

  const onSubmit: SubmitHandler<UpdateFormSchema> = async (data) => {
    try {
      const newAddressData = data.addressList.map((address, index) => {
        if (index === 0) {
          return { ...address, is_main: true };
        }
        return { ...address, is_main: false };
      });

      await updateAddress(JSON.stringify(newAddressData));
      toast.success('주소 업데이트 성공');
    } catch (error) {
      catchError(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id + index}
            className="relative rounded-md border px-4 pb-4 pt-2 shadow-lg shadow-border"
          >
            <div className="absolute right-1.5 top-1 flex items-center gap-1">
              {index !== 0 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => swap(index, index - 1)}
                >
                  <DoubleArrowUpIcon className="size-4 cursor-pointer" />
                </Button>
              )}
              {index !== fields.length - 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => swap(index, index + 1)}
                >
                  <DoubleArrowDownIcon className="size-4 cursor-pointer" />
                </Button>
              )}
              <Button
                type="button"
                disabled={form.formState.isSubmitting}
                size="icon"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <TrashIcon className="size-4 text-red-500" />
              </Button>
            </div>
            <AddressFormField
              isMainAddress={index === 0}
              mainAddressName={`addressList.${index}.main_address`}
              extraAddressName={`addressList.${index}.extra_address`}
            />
            {index === 0 && (
              <div className="absolute inset-x-0  -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            )}
          </div>
        ))}
        <Button
          type="button"
          disabled={form.formState.isSubmitting}
          className="mr-2"
          onClick={() => fields.length < 5 && append({ main_address: '', extra_address: '' })}
        >
          {form.formState.isSubmitting ? (
            <Icons.spinner className="mx-1.5 h-4 w-4 animate-spin" />
          ) : (
            '추가'
          )}
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Icons.spinner className="mx-1.5 h-4 w-4 animate-spin" />
          ) : (
            '저장'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateAddressForm;
