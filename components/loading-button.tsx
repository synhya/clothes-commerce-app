import * as React from 'react';
import { Icons } from '@/components/ui/icons';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, disabled, label, ...props }, ref) => {
    return (
      <Button disabled={disabled} ref={ref} className={cn(className)} {...props}>
        {disabled ? (
          <Icons.spinner className='mx-1.5 h-4 w-4 animate-spin' />
        ) : label}
      </Button>
    );
  }
)
LoadingButton.displayName = 'LoadingButton';
