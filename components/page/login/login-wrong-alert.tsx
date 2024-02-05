'use client'
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Terminal } from 'lucide-react';


const LoginWrongAlert = () => {
  return (
    <Alert variant='destructive'>
      <AlertCircle className="h-4 w-4"/>
      <AlertTitle>로그인 실패</AlertTitle>
      <AlertDescription>아이디 혹은 비밀번호가 틀렸습니다.</AlertDescription>
    </Alert>
  );
};

export default LoginWrongAlert;
