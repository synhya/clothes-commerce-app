'use client';
import React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrayPath, FieldValues, useFieldArray, useFormContext } from 'react-hook-form';
import { Inputs } from '@/components/forms/product-form';
import { cn } from '@/lib/utils';

type Props<T extends FieldValues> = {
  arrayPath: ArrayPath<T>;
  label: string;
  required?: boolean;
};

const HashtagFormField = ({ arrayPath, label, required = false }: Props<Inputs>) => {
  const form = useFormContext<Inputs>();

  const { fields, append, remove } = useFieldArray({
    name: arrayPath,
    control: form.control,
  });

  return (
    <div>
      <p className='mb-2 text-sm'>{label}</p>
      {fields.map((field, index) => (
        <FormField
          control={form.control}
          key={field.id}
          // as Path<T> is required to fix the error
          name={`${arrayPath}.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <div className='mb-1 flex'>
                <div>
                  <FormControl>
                    <Input {...field} className='h-8' />
                  </FormControl>
                  <FormMessage className='mt-1' />
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='ml-2'
                  onClick={() => remove(index)}
                >
                  {label} 삭제
                </Button>
              </div>
            </FormItem>
          )}
        />
      ))}
      {fields.length === 0 &&
        required && (
          <p className={cn('text-[0.8rem] font-medium text-destructive')}>
            색상을 한개 이상 선택해주세요.
          </p>
        )}
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='mt-2'
        onClick={() => append({ value: '' })}
      >
        {label} 추가
      </Button>
    </div>
  );
};

export default HashtagFormField;
