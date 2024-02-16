import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { uniqueCategories } from '@/lib/types/categories';
import { ProductFormSchema } from '@/components/page/admin/product-form';
import { useFormContext } from 'react-hook-form';
import { productSizeEnums } from '@/lib/types/database';
import { Badge } from '@/components/ui/badge';

export const CategoryFormField = () => {
  const form = useFormContext<ProductFormSchema>();
  const label = '카테고리';
  return (
    <FormField
      control={form.control}
      name='categories'
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-2">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-fit justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {`${label}를 선택해주세요`}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <Command>
                <CommandInput placeholder={`${label} 검색...`} />
                <CommandEmpty>결과 없음</CommandEmpty>
                <ScrollArea className="h-72 w-full">
                  <CommandGroup>
                    {uniqueCategories.map((subCategory) => (
                      <CommandItem
                        value={subCategory}
                        key={subCategory}
                        onSelect={() => {
                          const newCategories = field.value?.includes(subCategory)
                            ? field.value.filter((c) => c !== subCategory)
                            : [...field.value, subCategory];
                          form.setValue('categories', newCategories);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value.includes(subCategory) ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {subCategory}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage className="font-semibold" />
          <div className="text-md flex flex-wrap gap-1" >
            {field.value.map((category) =>
              <Badge key={category} variant="secondary">{category}</Badge>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};


export const SizeFormField = () => {
  const form = useFormContext<ProductFormSchema>();
  const label = '사이즈';
  return (
    <FormField
      control={form.control}
      name="available_sizes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mr-2">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-fit justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {`가능한 ${label}를 선택해주세요`}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-fit min-w-[200px] p-0">
              <Command>
                <ScrollArea className="max-h-72 w-full">
                  <CommandGroup>
                    {productSizeEnums.map((size) => (
                      <CommandItem
                        value={size}
                        key={size}
                        onSelect={() => {
                          const newSizes = field.value.includes(size)
                            ? field.value.filter((c) => c !== size)
                            : [...field.value, size];
                          form.setValue('available_sizes', newSizes);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value.includes(size) ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {size}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage className="font-semibold" />
          <div className="text-md flex flex-wrap gap-1">
            {field.value.map((size) =>
              <Badge key={size} variant="secondary">{size}</Badge>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

