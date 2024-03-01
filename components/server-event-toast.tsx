'use client';
import { ReactNode, useEffect } from 'react';
import { ExternalToast, toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

type ToastEventsProps = {
  message: ReactNode,     
  data?: ExternalToast
}

const ServerEventToast = (props: ToastEventsProps) => {
  useEffect(() => {
    toast.error(props.message, props.data);
  },[props.message, props.data])

  return <Toaster />
};

export default ServerEventToast;
