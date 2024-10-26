'use client';

import Button from '@/app/components/button';
import { Warning } from '@/app/components/svg';
import { useRouter } from 'next/navigation';
import React from 'react';

const RegisterExpired = () => {
  const { push } = useRouter();

  return (
    <div className="flex min-h-tablet">
      <div className="m-auto flex max-w-[454px] flex-col items-center rounded-[30px] bg-white p-[40px] shadow-form">
        <Warning />
        <div className="mt-8 text-center font-bold ">
          <p className="text-[22px]  leading-[35.2px]">URLの有効期限が切れています</p>
          <p className="m-[6px] leading-[25px] text-required">有効期限は24時間以内です</p>
          <p className="mt-6 leading-[25px]">
            下のボタンから再度新規登録を行ってください
          </p>
        </div>

        <Button
          className="mt-6 w-[374px] hover:brightness-150 active:brightness-90"
          onClick={() => push('/register')}
        >
          新規登録画面に進む
        </Button>
      </div>
    </div>
  );
};

export default RegisterExpired;
