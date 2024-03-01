'use client'
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import AddressFormField from '@/components/forms/address-form-field';
import { AddProfileFormValues } from '@/app/(auth)/sign-up/profile/AddProfileFormProvider';
import { Shell } from '@/components/shells/shell';

export default function Page () {
  const { formState } = useFormContext<AddProfileFormValues>();

  return (
    <Shell>
      <AddressFormField
        isMainAddress
        mainAddressName="main_address"
        extraAddressName="extra_address"
      />
      <Button disabled={formState.isSubmitting} className="ml-auto">
        {formState.isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        가입완료
      </Button>
    </Shell>
  );
};
