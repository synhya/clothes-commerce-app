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
import { MaskedInput } from '@/components/page/shared/masked-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { updateAddress, updateProfile } from '@/lib/actions/profile-actions';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import AddressFormField from '@/components/page/shared/address-form-field';
import { DoubleArrowDownIcon, DoubleArrowUpIcon, StarIcon, TrashIcon } from '@radix-ui/react-icons';

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
    console.log();

    const newAddressData = data.addressList.map((address, index) => {
      if (index === 0) {
        return { ...address, is_main: true };
      }
      return { ...address, is_main: false };
    });

    const { message } = await updateAddress(JSON.stringify(newAddressData));

    toast({
      title: '알림',
      description: message,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-md border px-4 pb-4 pt-2 shadow-lg shadow-border"
          >
            <div className="absolute right-3 top-3 flex items-center gap-2">
              {index !== 0 && (
                <DoubleArrowUpIcon
                  className="size-5 cursor-pointer"
                  onClick={() => move(index, index - 1)}
                />
              )}
              {index !== fields.length - 1 && (
                <DoubleArrowDownIcon
                  className="size-5 cursor-pointer"
                  onClick={() => move(index, index + 1)}
                />
              )}
              <Button
                type="button"
                disabled={form.formState.isSubmitting}
                size="icon"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <TrashIcon className="size-6" />
              </Button>
            </div>
            <AddressFormField
              isMainAddress={index === 0}
              mainAddressName={`addressList.${index}.main_address`}
              extraAddressName={`addressList.${index}.extra_address`}
            />
          </div>
        ))}
        <Button
          type="button"
          disabled={form.formState.isSubmitting}
          className="mr-2"
          onClick={() => fields.length < 5 && append({ main_address: '', extra_address: '' })}
        >
          {form.formState.isSubmitting && (
            <Icons.spinner className="ml-0.5 mr-2.5 h-4 w-4 animate-spin" />
          )}
          추가
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Icons.spinner className="ml-0.5 mr-2.5 h-4 w-4 animate-spin" />
          )}
          저장
        </Button>
      </form>
      <Toaster />
    </Form>
  );
};

export default UpdateAddressForm;
