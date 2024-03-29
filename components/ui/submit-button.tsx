import React from 'react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { Icons } from '@/components/icons';

const SubmitButton = ({ value, label }: { value: string; label: string }) => {
  const status = useFormStatus();

  return (
    <Button size="lg" name="action" value={value} disabled={status.pending}>
      {status.pending && <Icons.spinner className="mr-1.5 h-4 w-4 animate-spin " />}
      {label}
    </Button>
  );
};

export default SubmitButton;
