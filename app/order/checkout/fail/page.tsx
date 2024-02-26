import Link from 'next/link';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import React from 'react';

export default function FailPage({
  searchParams
}: {
  searchParams: {
    code?: string;
    message?: string;
  }
}) {
  const { code, message } = searchParams;

  throw new Error(message);
}
