'use client';
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';
import { createBasketItem } from '@/lib/actions/basket-actions';
import { DBEnums, productSizeEnums } from '@/lib/types/database';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import RadioInput from '@/components/page/radio-input';

type ProductOptionFormProps = {
  productId: string;
  availableColors: string[];
  availableSizes: DBEnums['product_size'][];
};

const ProductOptionForm = ({ productId, availableColors, availableSizes }: ProductOptionFormProps) => {
  const initialState = { message: '', errors: {} };
  const createBasketItemWithId = createBasketItem.bind(null, productId);
  const [state, dispatch] = useFormState(createBasketItemWithId, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: '알림',
        description: state.message,
      });
    }
  }, [state]);

  return (
    <>
      <form className='grid gap-4 md:gap-10' action={dispatch}>
        <div className='grid gap-2'>
          <Label className='text-base'>
            색상
          </Label>
          <div className='flex gap-2'>
            {availableColors.map((color) => (
              <RadioInput label={color} key={color} value={color} name='selectedColor' />
            ))}
          </div>
          {state.errors?.selectedColor && (
            <p className='text-red-500 text-sm'>{state.errors.selectedColor}</p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label className='text-base'>
            사이즈
          </Label>
          <div className='flex gap-2'>
            {availableSizes.sort((a, b) =>
              productSizeEnums.indexOf(a) - productSizeEnums.indexOf(b),
            ).map((size) => (
              <RadioInput label={size} key={size} value={size} name='selectedSize' />
            ))}
          </div>
          {state.errors?.selectedSize && (
            <p className='text-red-500 text-sm'>{state.errors.selectedSize}</p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label className='text-base'>
            수량
          </Label>
          <Select name='quantity' defaultValue='1'>
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>1</SelectItem>
              <SelectItem value='2'>2</SelectItem>
              <SelectItem value='3'>3</SelectItem>
              <SelectItem value='4'>4</SelectItem>
              <SelectItem value='5'>5</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.quantity && (
            <p className='text-red-500 text-sm'>{state.errors.quantity}</p>
          )}
        </div>
        <div className='grid sm:grid-cols-2 gap-4'>
          <Button
            size='lg'
            name='action'
            value='add-to-basket'
          >
            장바구니 추가
          </Button>
          <Button
            size='lg'
            name='action'
            value='checkout'
          >
            바로결제
          </Button>
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default ProductOptionForm;
