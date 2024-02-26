import React from 'react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from "react-dom";
import { ReloadIcon } from '@radix-ui/react-icons';

const SubmitButton = ({value, label} : {
  value: string
  label: string
}) => {
  const status =  useFormStatus();

  return (
    <Button
      size='lg'
      name='action'
      value={value}
      disabled={status.pending}
    >
      {status.pending && <ReloadIcon className='h-4 w-4 animate-spin mr-1.5 '/>}
      {label}
    </Button>
  );
};

export default SubmitButton;
