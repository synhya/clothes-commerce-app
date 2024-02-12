import React from 'react';
import { Button } from '@nextui-org/react';

const Layout = ({
  children,
  products,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  products: React.ReactNode
}) => {
  return (
    <div className="flex">
      {/* 사이드바 */}
      <div className="flex flex-col items-center mt-20 min-w-[200px]">
        <Button
          isIconOnly color="warning"
          variant="faded"
          radius="full"
          className="px-4 py-2"
        >
          테스트
        </Button>
        <Button color="primary">
          Button
        </Button>
      </div>
      <div>
        {products}
        {/*{analytics}*/}
      </div>
    </div>
  )
};

export default Layout;
