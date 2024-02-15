'use client'
import React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrayPath, FieldValues, useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormSchema } from '@/components/page/admin/add-product-form';

type Props<T extends FieldValues> = {
  arrayPath : ArrayPath<T>
  label : string
}

const HashtagFormField = ({arrayPath, label} : Props<ProductFormSchema>) => {
  const form = useFormContext<ProductFormSchema>();

  const { fields, append, remove } = useFieldArray({
    name: arrayPath,
    control: form.control,
  });

  return (
    <div>
      <p className="mb-2 text-sm">{label}</p>
      {fields.map((field, index) => (
        <FormField
          control={form.control}
          key={field.id}
          // as Path<T> is required to fix the error
          name={`${arrayPath}.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <div className="flex mb-1">
                <div>
                  <FormControl>
                    <Input {...field} className='h-8'/>
                  </FormControl>
                  <FormMessage className="font-semibold"/>
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
