import * as React from 'react';

import { cn } from '@/lib/utils';
import InputMask from 'react-input-mask';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: keyof typeof MASK_TYPE;
}

const MASK_TYPE = {
  phone: '999-9999-9999', // "+4\\9 99 9999-9999",
  zipCode: "99999-999",
  date: "99/99/9999",
  time: "99:99",
  creditCard: "9999 9999 9999 9999",
} as const;

const MaskedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, ...props }, ref) => {
    return (
      <InputMask
        type={type}
        mask={MASK_TYPE[mask]}
        maskChar=''
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        inputRef={ref}
        {...props}
      />
    );
  },
);
MaskedInput.displayName = 'PhoneInput';

export { MaskedInput };
