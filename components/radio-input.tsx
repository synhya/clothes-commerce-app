import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type RadioInputProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
const RadioInput = (props: RadioInputProps) => {
  const { label, className, ...rest } = props;
  return (
    <Label
      className={cn(
        'flex w-fit cursor-pointer items-center gap-2 rounded-md border px-2 transition-colors [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800',
        className,
      )}
      htmlFor={label}
    >
      <input id={label} type="radio" className="my-2" {...rest} />
      <span className="pt-0.5">{label}</span>
    </Label>
  );
};

export default RadioInput;
