import React, { useCallback, useState } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Image } from '@nextui-org/react';
import { ProductFormSchema } from '@/components/page/admin/add-product-form';
import { useFormContext } from 'react-hook-form';
import Dropzone, { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

const DropzoneFormField = () => {
  const form = useFormContext<ProductFormSchema>();
  const [paths, setPaths] = useState<string[]>([]);

  return (
    <div>
      <FormField
        control={form.control}
        name="imageFiles"
        rules={{
          required: '이미지를 업로드해주세요.',
        }}
        render={({ field: { onChange, onBlur, ref, value }, fieldState }) => (
          <Dropzone
            noClick
            onDrop={(acceptedFiles) => {
              setPaths(acceptedFiles.map((file) => URL.createObjectURL(file)));
              form.setValue('imageFiles', acceptedFiles as unknown as FileList, {
                shouldValidate: true,
              });
            }}
            accept={{
              'image/jpeg': ['.jpg', '.jpeg', '.png', '.webp'],
            }}
          >
            {({ getRootProps, getInputProps, open, isDragActive, acceptedFiles }) => (
              <FormItem>
                <div className="flex items-center gap-x-4">
                  <FormLabel htmlFor="file">상품 이미지</FormLabel>
                  <Button type="button" size="sm" onClick={open}>직접선택</Button>
                </div>
                <div className="h-fit min-h-[300px] rounded-md border p-4" {...getRootProps()}>
                  <FormControl>
                    <Input
                      {...getInputProps({
                        onChange,
                        onBlur,
                      })}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                  <div className="flex flex-col items-center justify-center">
                    {acceptedFiles.length == 0 && <p>이미지를 드랍 해주세요!</p>}
                    {paths.map((path) => (
                      <Image key={path} src={path} alt="pic" className="max-h-[300px]" />
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          </Dropzone>
        )}
      />
    </div>
  );
};

export default DropzoneFormField;
