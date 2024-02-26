import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

const AddressFormField = ({
  isMainAddress,
  mainAddressName,
  extraAddressName,
}: {
  isMainAddress: boolean;
  mainAddressName: string;
  extraAddressName: string;
}) => {
  const form = useFormContext();

  const openPostcode = useDaumPostcodePopup();

  const handlePostComplete = (data: Address) => {
    let fullAddress = data.address; // 도로명 주소
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동명
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    form.setValue(mainAddressName, fullAddress);
  };
  const onPostButtonClick = async () => {
    await openPostcode({ onComplete: handlePostComplete });
  };

  return (
    <>
      <FormField
        control={form.control}
        name={mainAddressName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>주소</FormLabel>
            <div className='flex flex-col items-start gap-4 sm:flex-row '>
              <Input {...field} placeholder='주소' className='max-w-[304px]' readOnly />
              <FormControl>
                <Button type='button' onClick={() => onPostButtonClick()}>
                  우편번호 찾기
                </Button>
              </FormControl>
            </div>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={extraAddressName}
        render={({ field }) => (
          <FormItem
            className='col-span-2'
          >
            <FormLabel />
            <FormControl>
              <Input {...field} placeholder='상세주소' />
            </FormControl>
            {isMainAddress && (
              <FormDescription>기본 배송지로 등록됩니다.</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressFormField;
