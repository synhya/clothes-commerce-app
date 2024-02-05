import React from 'react';
import Icon from '@ant-design/icons';
import { GetProps } from 'antd';

type CustomIconComponentProps = GetProps<typeof Icon>;

export const GoogleSvg = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.64 20.2045C29.64 19.5664 29.5827 18.9527 29.4764 18.3636H21V21.845H25.8436C25.635 22.97 25.0009 23.9232 24.0477 24.5614V26.8195H26.9564C28.6582 25.2527 29.64 22.9454 29.64 20.2045Z"
      fill="#4285F4"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 29C23.43 29 25.4673 28.1941 26.9564 26.8196L24.0477 24.5614C23.2418 25.1014 22.2109 25.4205 21 25.4205C18.6559 25.4205 16.6718 23.8373 15.9641 21.71H12.9573V24.0418C14.4382 26.9832 17.4818 29 21 29Z"
      fill="#34A853"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.9641 21.71C15.7841 21.17 15.6818 20.5932 15.6818 20C15.6818 19.4068 15.7841 18.83 15.9641 18.29V15.9582H12.9573C12.3477 17.1732 12 18.5477 12 20C12 21.4523 12.3477 22.8268 12.9573 24.0418L15.9641 21.71Z"
      fill="#FBBC05"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 14.5795C22.3214 14.5795 23.5077 15.0336 24.4405 15.9255L27.0218 13.3441C25.4632 11.8918 23.4259 11 21 11C17.4818 11 14.4382 13.0168 12.9573 15.9582L15.9641 18.29C16.6718 16.1627 18.6559 14.5795 21 14.5795Z"
      fill="#EA4335"
    />
  </svg>
);

export const GoogleIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={GoogleSvg} {...props} />
);