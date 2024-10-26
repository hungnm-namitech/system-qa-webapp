'use client';

import Button from '@/app/components/button';
import { Warning } from '@/app/components/svg';
import { useRouter } from 'next/navigation';
import React from 'react';

const ForgotPassExpired = () => {
  const { push } = useRouter();

  return (
    <div className="flex min-h-tablet">
      <div className="m-auto flex max-h-[328px] max-w-[454px] flex-col items-center rounded-[30px] bg-white p-[40px] pt-[56px]">
        <Warning />
        <div className="mt-8 text-center font-bold ">
          <p className="text-[22px]  leading-[35.2px]">このURLは無効です</p>
          <p className="m-[6px] leading-[25px] text-required">URLをご確認ください</p>
        </div>
        <Button
          className="mt-6 w-[374px] hover:brightness-150 active:brightness-90"
          onClick={() => push('/login')}
        >
          ログインして進む
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassExpired;
