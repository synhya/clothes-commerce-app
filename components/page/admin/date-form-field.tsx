import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { ArrayPath, FieldValues, useFormContext } from 'react-hook-form';

type Props<T extends FieldValues>  = {
  arrayPath : ArrayPath<T>
  label : string
} & React.ComponentPropsWithoutRef<'div'>

const DateFormField = ({arrayPath, label, className} : Props<FieldValues>) => {
  const form = useFormContext();

  return (
    <FormField
      name={arrayPath}
      control={form.control}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)} >
          <FormLabel className="mb-2 text-sm font-medium" htmlFor="category">
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? format(field.value, "PPP", { locale: ko }) : `${label}을 선택하세요`}
                  <CalendarIcon className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                defaultMonth={field.value}
                disabled={(date) =>
                  date > new Date() || date < new Date("2000-01-01")
                }
                initialFocus
                locale={ko}
                captionLayout="buttons" fromYear={2000} toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

export default DateFormField;
