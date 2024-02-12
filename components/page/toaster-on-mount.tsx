'use client'
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';

const ToasterOnMount = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  useEffect(() => {
    toast( {
      title: title,
      description: description,
    })
  }, [description, title])
  
  return <Toaster />;
}

export default ToasterOnMount;